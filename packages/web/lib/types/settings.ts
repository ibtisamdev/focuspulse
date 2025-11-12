// User profile data
export interface ProfileData {
  fullName: string;
  email: string;
  avatarUrl?: string;
}

// Security settings
export interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Preferences data
export interface PreferencesData {
  weeklyGoal: number;
  defaultSessionDuration: number;
  theme: 'dark' | 'light' | 'system';
  timezone: string;
  notifications: {
    email: boolean;
    sessionReminders: boolean;
    streakAlerts: boolean;
  };
}

// Password validation state
export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
}
