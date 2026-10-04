// Architecture-ready Telephony & SIP Gateway Abstraction
// Supports future SIP Trunks, Twilio, Telnyx, or Bangladeshi IPTSP (BTCL, AmberIT, BracNet).
// Does not claim connected status without validated provider credentials.

export interface TelephonyNumber {
  id: string;
  e164Number: string;
  country: string;
  provider: 'BTCL IPTSP' | 'AmberIT SIP' | 'Twilio Voice' | 'Telnyx SIP' | 'Custom SIP';
  status: 'Connected' | 'Not Connected' | 'Setup Required' | 'Test Mode';
  assignedAgentId?: string;
  sipTrunkEndpoint?: string;
}

export const telephonyService = {
  async getNumbers(): Promise<TelephonyNumber[]> {
    return [
      {
        id: 'phone-bd-01',
        e164Number: '+880 9612-887766',
        country: 'BD',
        provider: 'BTCL IPTSP',
        status: 'Test Mode',
        assignedAgentId: 'agent-1',
        sipTrunkEndpoint: 'sip:trunk.voiceai.bd:5060'
      },
      {
        id: 'phone-bd-02',
        e164Number: '+880 9638-112233',
        country: 'BD',
        provider: 'AmberIT SIP',
        status: 'Setup Required',
        assignedAgentId: undefined,
        sipTrunkEndpoint: 'sip:amber.iptsp.bd:5060'
      }
    ];
  },

  async connectNumber(numberId: string, agentId: string): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `Phone number ${numberId} routed to Agent ${agentId} in test mode.`
    };
  },

  async disconnectNumber(numberId: string): Promise<{ success: boolean }> {
    return { success: true };
  },

  async startCall(caller: string, agentId: string): Promise<{ callId: string; status: string }> {
    return {
      callId: `call-${Date.now()}`,
      status: 'simulated_active'
    };
  },

  async endCall(callId: string): Promise<{ success: boolean }> {
    return { success: true };
  }
};
