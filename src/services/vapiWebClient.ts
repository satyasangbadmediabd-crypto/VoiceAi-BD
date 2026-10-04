import Vapi from '@vapi-ai/web';

export type VapiCallStatus = 'idle' | 'connecting' | 'connected' | 'speaking' | 'listening' | 'ended' | 'error';

export interface VapiTranscriptItem {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isFinal?: boolean;
  transcriptType?: 'partial' | 'final';
}

export interface VapiCallEvents {
  onStatusChange?: (status: VapiCallStatus) => void;
  onTranscript?: (item: VapiTranscriptItem) => void;
  onVolumeChange?: (volume: number) => void;
  onError?: (error: any) => void;
  onCallStart?: () => void;
  onCallEnd?: () => void;
}

/**
 * Robust detector for normal call closure or Daily.co ejection events.
 * Daily WebRTC wraps participant leaves, session timeouts, and room closures
 * in an action="error" / type="ejected" payload with message "Meeting has ended".
 */
export function isNormalMeetingEnd(err: any): boolean {
  if (!err) return false;

  const errMsg = String(
    err?.errorMsg ||
    err?.error?.msg ||
    err?.error?.message?.msg ||
    err?.error?.message ||
    err?.message ||
    ''
  );

  const errType = String(
    err?.error?.type ||
    err?.type ||
    err?.error?.message?.type ||
    ''
  );

  if (
    errMsg.includes('Meeting has ended') ||
    errMsg.includes('meeting ended') ||
    errMsg.includes('ejection') ||
    errMsg.includes('Participant left') ||
    errMsg.includes('Left meeting') ||
    errType === 'ejected' ||
    errType === 'meeting-ended' ||
    errType === 'call-ended'
  ) {
    return true;
  }

  try {
    const str = typeof err === 'string' ? err : JSON.stringify(err);
    if (
      str.includes('Meeting has ended') ||
      str.includes('"type":"ejected"') ||
      str.includes('ejected') ||
      str.includes('meeting-ended')
    ) {
      return true;
    }
  } catch {
    // Ignore serialization failure
  }

  return false;
}

// Global protection against Daily WebRTC unhandled ejection rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (isNormalMeetingEnd(event.reason)) {
      event.preventDefault();
    }
  });
}

class VapiWebManager {
  private vapi: any = null;
  private currentPublicKey: string | null = null;
  private activeStatus: VapiCallStatus = 'idle';
  private isStopping = false;

  public init(publicKey: string): any {
    if (this.vapi && this.currentPublicKey === publicKey) {
      return this.vapi;
    }

    try {
      const VapiClass = (Vapi as any).default || Vapi;
      this.vapi = new VapiClass(publicKey);
      this.currentPublicKey = publicKey;
      return this.vapi;
    } catch (err) {
      console.warn('Failed to initialize Vapi web client:', err);
      throw err;
    }
  }

  public async startCall(
    publicKey: string,
    assistantId: string,
    events?: VapiCallEvents,
    assistantOverrides?: any
  ): Promise<void> {
    // If a call is currently active or stopping, clean it up gracefully before starting
    if (this.vapi && (this.activeStatus === 'connected' || this.activeStatus === 'speaking' || this.activeStatus === 'listening')) {
      try {
        this.vapi.stop();
      } catch {
        // Safe ignore
      }
    }

    this.isStopping = false;
    const client = this.init(publicKey);

    // Remove prior listeners if any to prevent duplicate handler accumulation
    client.removeAllListeners?.();

    events?.onStatusChange?.('connecting');
    this.activeStatus = 'connecting';

    client.on('call-start', () => {
      this.isStopping = false;
      this.activeStatus = 'connected';
      events?.onStatusChange?.('connected');
      events?.onCallStart?.();
    });

    client.on('call-end', () => {
      this.activeStatus = 'ended';
      events?.onStatusChange?.('ended');
      events?.onCallEnd?.();
    });

    client.on('speech-start', () => {
      if (this.activeStatus !== 'ended') {
        events?.onStatusChange?.('speaking');
      }
    });

    client.on('speech-end', () => {
      if (this.activeStatus !== 'ended') {
        events?.onStatusChange?.('listening');
      }
    });

    client.on('volume-level', (volume: number) => {
      if (this.activeStatus !== 'ended') {
        events?.onVolumeChange?.(volume);
      }
    });

    client.on('message', (message: any) => {
      if (message.type === 'transcript') {
        const role = message.role === 'user' ? 'user' : 'assistant';
        const text = message.transcript || message.text || '';
        if (text) {
          events?.onTranscript?.({
            id: `vapi-tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            role,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isFinal: message.transcriptType === 'final',
            transcriptType: message.transcriptType
          });
        }
      }
    });

    client.on('error', (err: any) => {
      if (this.isStopping || isNormalMeetingEnd(err)) {
        // Normal call teardown or meeting closure from Daily WebRTC
        this.activeStatus = 'ended';
        events?.onStatusChange?.('ended');
        events?.onCallEnd?.();
        return;
      }

      console.warn('Vapi client reported event:', err);
      this.activeStatus = 'error';
      events?.onStatusChange?.('error');
      events?.onError?.(err);
    });

    try {
      if (assistantOverrides) {
        await client.start(assistantId, assistantOverrides);
      } else {
        await client.start(assistantId);
      }
    } catch (err: any) {
      if (this.isStopping || isNormalMeetingEnd(err)) {
        this.activeStatus = 'ended';
        events?.onStatusChange?.('ended');
        events?.onCallEnd?.();
        return;
      }
      console.warn('Vapi client startCall error:', err);
      this.activeStatus = 'error';
      events?.onStatusChange?.('error');
      events?.onError?.(err);
      throw err;
    }
  }

  public stopCall(): void {
    if (this.vapi) {
      this.isStopping = true;
      this.activeStatus = 'ended';
      try {
        this.vapi.stop();
      } catch (err) {
        console.warn('Error stopping Vapi call:', err);
      }
      // Reset isStopping flag after Daily WebRTC teardown finishes
      setTimeout(() => {
        this.isStopping = false;
      }, 2000);
    }
  }

  public setMuted(muted: boolean): void {
    if (this.vapi) {
      try {
        this.vapi.setMuted(muted);
      } catch (err) {
        console.warn('Error setting muted on Vapi:', err);
      }
    }
  }

  public getStatus(): VapiCallStatus {
    return this.activeStatus;
  }
}

export const vapiWebManager = new VapiWebManager();
