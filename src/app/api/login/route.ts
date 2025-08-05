import { NextResponse } from "next/server";
import { AuthValidation, LoginCredentials } from "@/lib/validation/authValidation";
import { AuthService } from "@/lib/services/authService";
import { ResponseUtils } from "@/lib/utils/responseUtils";

export async function POST(request: Request) {
  const startTime = performance.now();
  console.time('login-request');

  try {
    // Parse request body
    console.time('parse-request');
    const body = await request.json();
    console.timeEnd('parse-request');

    // Validate and sanitize credentials
    console.time('validate-credentials');
    const validationErrors = AuthValidation.validateLoginCredentials(body);
    
    if (validationErrors.length > 0) {
      console.timeEnd('validate-credentials');
      console.timeEnd('login-request');
      console.log(`Login validation failed in ${performance.now() - startTime}ms`);
      return ResponseUtils.createValidationErrorResponse(validationErrors);
    }

    const sanitizedCredentials: LoginCredentials = AuthValidation.sanitizeCredentials(body);
    console.timeEnd('validate-credentials');

    // Authenticate user
    console.time('authenticate-user');
    const authResult = await AuthService.authenticateUser(sanitizedCredentials);
    console.timeEnd('authenticate-user');

    // Log performance metrics
    const totalTime = performance.now() - startTime;
    console.timeEnd('login-request');
    console.log(`Login request completed in ${totalTime.toFixed(2)}ms`);

    return ResponseUtils.createAuthResponse(authResult);

  } catch (error) {
    console.error('Login error:', error);
    console.timeEnd('login-request');
    
    return ResponseUtils.createServerErrorResponse();
  }
}
