import { UserProfile } from '../types';

export const PRIMARY_ADMIN_EMAIL = 'satyasangbad.media.bd@gmail.com';

/**
 * Checks whether the currently logged in user is the authorized administrator.
 * ONLY the owner with email `satyasangbad.media.bd@gmail.com` has admin access.
 * No other user can access or view the admin panel.
 */
export const isUserAdmin = (user: Partial<UserProfile> | null | undefined): boolean => {
  if (!user || !user.email) return false;
  const email = user.email.trim().toLowerCase();
  return email === PRIMARY_ADMIN_EMAIL.toLowerCase();
};
