import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface AdminSecurityConfig {
  adminPasswordHash: string;
  superAdminPasswordHash: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const SECURITY_FILE = path.join(DATA_DIR, 'adminSecurity.json');

function hashPassword(pass: string): string {
  return crypto.createHash('sha256').update(pass.trim()).digest('hex');
}

const DEFAULT_ADMIN_PASS = 'admin1234';
const DEFAULT_SUPER_ADMIN_PASS = 'superadmin2026';

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadSecurityConfig(): AdminSecurityConfig {
  ensureDataDir();
  try {
    if (fs.existsSync(SECURITY_FILE)) {
      const data = fs.readFileSync(SECURITY_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading security file:', err);
  }

  const initial: AdminSecurityConfig = {
    adminPasswordHash: hashPassword(DEFAULT_ADMIN_PASS),
    superAdminPasswordHash: hashPassword(DEFAULT_SUPER_ADMIN_PASS),
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(SECURITY_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  return initial;
}

export function verifyAdminPassword(password: string, role: 'admin' | 'superadmin'): boolean {
  if (!password) return false;
  const config = loadSecurityConfig();
  const inputHash = hashPassword(password);

  if (role === 'superadmin') {
    return inputHash === config.superAdminPasswordHash;
  }
  // Super admin pass also unlocks admin panel
  return inputHash === config.adminPasswordHash || inputHash === config.superAdminPasswordHash;
}

export function changeAdminPassword(
  role: 'admin' | 'superadmin',
  currentPassword: string,
  newPassword: string
): { success: boolean; message: string } {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' };
  }

  const isValidCurrent = verifyAdminPassword(currentPassword, role);
  if (!isValidCurrent) {
    return { success: false, message: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়।' };
  }

  const config = loadSecurityConfig();
  if (role === 'superadmin') {
    config.superAdminPasswordHash = hashPassword(newPassword);
  } else {
    config.adminPasswordHash = hashPassword(newPassword);
  }
  config.updatedAt = new Date().toISOString();

  fs.writeFileSync(SECURITY_FILE, JSON.stringify(config, null, 2), 'utf-8');
  return { success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!' };
}
