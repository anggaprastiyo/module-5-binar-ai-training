// Test script to demonstrate refactoring benefits
const { performance } = require('perf_hooks');

// Mock the refactored modules for demonstration
class AuthValidation {
  static validateLoginCredentials(credentials) {
    const errors = [];
    
    if (!credentials || typeof credentials !== 'object') {
      return [{ field: 'general', message: 'Invalid request body.' }];
    }

    const { email, password } = credentials;

    if (!email) {
      errors.push({ field: 'email', message: 'Email is required.' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ field: 'email', message: 'Invalid email format.' });
    }

    if (!password) {
      errors.push({ field: 'password', message: 'Password is required.' });
    } else if (password.length < 6) {
      errors.push({ field: 'password', message: 'Password must be at least 6 characters.' });
    }

    return errors;
  }

  static sanitizeCredentials(credentials) {
    return {
      email: credentials.email?.trim().toLowerCase() || '',
      password: credentials.password || ''
    };
  }
}

class AuthService {
  static async authenticateUser(credentials) {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 10));
    
    if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
      return {
        success: true,
        message: 'Login successful!',
        statusCode: 200,
        data: { user: { email: credentials.email, id: 'user-123' } }
      };
    }
    
    return {
      success: false,
      message: 'Invalid credentials.',
      statusCode: 401
    };
  }
}

// Simulate the refactored login function
async function loginRequest(requestBody) {
  const startTime = performance.now();
  console.time('login-request');

  try {
    // Parse request body
    console.time('parse-request');
    const body = requestBody; // In real scenario, this would be await request.json()
    console.timeEnd('parse-request');

    // Validate and sanitize credentials
    console.time('validate-credentials');
    const validationErrors = AuthValidation.validateLoginCredentials(body);
    
    if (validationErrors.length > 0) {
      console.timeEnd('validate-credentials');
      console.timeEnd('login-request');
      console.log(`Login validation failed in ${performance.now() - startTime}ms`);
      return { success: false, errors: validationErrors, statusCode: 400 };
    }

    const sanitizedCredentials = AuthValidation.sanitizeCredentials(body);
    console.timeEnd('validate-credentials');

    // Authenticate user
    console.time('authenticate-user');
    const authResult = await AuthService.authenticateUser(sanitizedCredentials);
    console.timeEnd('authenticate-user');

    // Log performance metrics
    const totalTime = performance.now() - startTime;
    console.timeEnd('login-request');
    console.log(`Login request completed in ${totalTime.toFixed(2)}ms`);

    return authResult;

  } catch (error) {
    console.error('Login error:', error);
    console.timeEnd('login-request');
    return { success: false, message: 'Internal server error', statusCode: 500 };
  }
}

// Test scenarios
console.log('=== REFACTORING DEMONSTRATION ===\n');

// Test 1: Successful login
console.log('1. Testing successful login:');
const result1 = await loginRequest({ email: 'test@example.com', password: 'password123' });
console.log('Result:', result1);
console.log('\n');

// Test 2: Validation error
console.log('2. Testing validation error:');
const result2 = await loginRequest({ email: 'invalid-email', password: '123' });
console.log('Result:', result2);
console.log('\n');

// Test 3: Invalid credentials
console.log('3. Testing invalid credentials:');
const result3 = await loginRequest({ email: 'wrong@example.com', password: 'wrongpassword' });
console.log('Result:', result3);
console.log('\n');

// Test 4: Missing fields
console.log('4. Testing missing fields:');
const result4 = await loginRequest({ email: '', password: '' });
console.log('Result:', result4);
console.log('\n');

console.log('=== REFACTORING BENEFITS ===');
console.log('✅ Modular code with single responsibility');
console.log('✅ Performance monitoring with console.time');
console.log('✅ Better error handling and validation');
console.log('✅ Reusable validation and service classes');
console.log('✅ Cleaner separation of concerns');
console.log('✅ Enhanced security with input sanitization');
console.log('✅ Detailed performance metrics'); 