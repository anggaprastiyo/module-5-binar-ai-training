import { LoginCredentials } from '../validation/authValidation';

export interface AuthResult {
  success: boolean;
  message: string;
  statusCode: number;
  data?: any;
}

export class AuthService {
  private static readonly VALID_CREDENTIALS = {
    email: 'test@example.com',
    password: 'password123'
  };

  static async authenticateUser(credentials: LoginCredentials): Promise<AuthResult> {
    // Simulate database lookup delay
    await this.simulateDatabaseDelay();

    const { email, password } = credentials;

    if (email === this.VALID_CREDENTIALS.email && password === this.VALID_CREDENTIALS.password) {
      return {
        success: true,
        message: 'Login successful!',
        statusCode: 200,
        data: {
          user: {
            email: email,
            id: 'user-123',
            role: 'user'
          }
        }
      };
    }

    return {
      success: false,
      message: 'Invalid credentials.',
      statusCode: 401
    };
  }

  private static async simulateDatabaseDelay(): Promise<void> {
    // Simulate realistic database query time
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  static async validateSession(token?: string): Promise<boolean> {
    // Mock session validation
    return token === 'valid-token';
  }
} 