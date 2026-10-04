// Repository & Data Service Abstraction for VoiceAI BD
// Decouples UI pages from direct localStorage dependence.
// Ready for backend databases (Firestore, Cloud SQL PostgreSQL, or REST API).

import { Agent, CallLog, Lead, KnowledgeDocument, PhoneNumber, UserProfile } from '../types';

export interface DataService {
  getAgents(): Promise<Agent[]>;
  saveAgents(agents: Agent[]): Promise<void>;
  getCalls(): Promise<CallLog[]>;
  saveCalls(calls: CallLog[]): Promise<void>;
  getLeads(): Promise<Lead[]>;
  saveLeads(leads: Lead[]): Promise<void>;
  getKnowledge(): Promise<KnowledgeDocument[]>;
  saveKnowledge(docs: KnowledgeDocument[]): Promise<void>;
  getPhoneNumbers(): Promise<PhoneNumber[]>;
  savePhoneNumbers(phones: PhoneNumber[]): Promise<void>;
}

// LocalStorage Demo Provider (Default fallback)
export class LocalStorageDataService implements DataService {
  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`Failed to write to localStorage for key ${key}:`, err);
    }
  }

  async getAgents(): Promise<Agent[]> {
    return this.getItem('voiceai_agents', []);
  }

  async saveAgents(agents: Agent[]): Promise<void> {
    this.setItem('voiceai_agents', agents);
  }

  async getCalls(): Promise<CallLog[]> {
    return this.getItem('voiceai_calls', []);
  }

  async saveCalls(calls: CallLog[]): Promise<void> {
    this.setItem('voiceai_calls', calls);
  }

  async getLeads(): Promise<Lead[]> {
    return this.getItem('voiceai_leads', []);
  }

  async saveLeads(leads: Lead[]): Promise<void> {
    this.setItem('voiceai_leads', leads);
  }

  async getKnowledge(): Promise<KnowledgeDocument[]> {
    return this.getItem('voiceai_knowledge', []);
  }

  async saveKnowledge(docs: KnowledgeDocument[]): Promise<void> {
    this.setItem('voiceai_knowledge', docs);
  }

  async getPhoneNumbers(): Promise<PhoneNumber[]> {
    return this.getItem('voiceai_phone_numbers', []);
  }

  async savePhoneNumbers(phones: PhoneNumber[]): Promise<void> {
    this.setItem('voiceai_phone_numbers', phones);
  }
}

// Global active instance
export const dataService: DataService = new LocalStorageDataService();
