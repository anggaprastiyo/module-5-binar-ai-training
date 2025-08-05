export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export class AuthValidation {
  private static readonly MIN_PASSWORD_LENGTH = 6;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  static validateLoginCredentials(credentials: any): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check if credentials object exists
    if (!credentials || typeof credentials !== 'object') {
      return [{ field: 'general', message: 'Invalid request body.' }];
    }

    const { email, password } = credentials;

    // Email validation
    if (!email) {
      errors.push({ field: 'email', message: 'Email is required.' });
    } else if (!this.EMAIL_REGEX.test(email)) {
      errors.push({ field: 'email', message: 'Invalid email format.' });
    }

    // Password validation
    if (!password) {
      errors.push({ field: 'password', message: 'Password is required.' });
    } else if (password.length < this.MIN_PASSWORD_LENGTH) {
      errors.push({ 
        field: 'password', 
        message: `Password must be at least ${this.MIN_PASSWORD_LENGTH} characters.` 
      });
    }

    return errors;
  }

  static sanitizeCredentials(credentials: any): LoginCredentials {
    return {
      email: credentials.email?.trim().toLowerCase() || '',
      password: credentials.password || ''
    };
  }
} 