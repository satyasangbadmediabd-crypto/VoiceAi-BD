// Architecture-ready Authentication Service for VoiceAI BD
// Prepares application for Firebase Auth / Supabase Auth / JWT Server Auth.
// Falls back to demo local authentication session.

import { UserProfile } from '../types';

export interface AuthSession {
  user: UserProfile | null;
  token: string | null;
  isDemo: boolean;
  expiresAt?: string;
}

export const authService = {
  async getCurrentSession(): Promise<AuthSession> {
    try {
      const stored = localStorage.getItem('voiceai_user');
      if (stored) {
        return {
          user: JSON.parse(stored),
          token: 'demo-session-token',
          isDemo: true
        };
      }
    } catch (e) {
      console.warn('Error reading auth session:', e);
    }
    return {
      user: null,
      token: null,
      isDemo: true
    };
  },

  async signIn(email: string, _password?: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    // In production, this proxies to POST /api/auth/login or Firebase signInWithEmailAndPassword
    return {
      success: true,
      user: {
        name: email.split('@')[0] || 'User',
        businessName: 'My Enterprise BD',
        phone: '+880 1711-000000',
        email,
        plan: 'Business',
        minutesUsed: 140,
        minutesLimit: 1000,
        joinedDate: new Date().toLocaleDateString('en-GB')
      }
    };
  },

  async signOut(): Promise<void> {
    localStorage.removeItem('voiceai_user');
  }
};
