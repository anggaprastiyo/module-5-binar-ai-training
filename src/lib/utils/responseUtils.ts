import { NextResponse } from 'next/server';
import { ValidationError } from '../validation/authValidation';
import { AuthResult } from '../services/authService';

export class ResponseUtils {
  static createSuccessResponse(data: any, message?: string) {
    return NextResponse.json({
      success: true,
      message: message || 'Operation successful',
      data
    });
  }

  static createErrorResponse(message: string, statusCode: number = 400) {
    return NextResponse.json({
      success: false,
      message
    }, { status: statusCode });
  }

  static createValidationErrorResponse(errors: ValidationError[]) {
    return NextResponse.json({
      success: false,
      message: 'Validation failed',
      errors
    }, { status: 400 });
  }

  static createAuthResponse(authResult: AuthResult) {
    return NextResponse.json({
      success: authResult.success,
      message: authResult.message,
      ...(authResult.data && { data: authResult.data })
    }, { status: authResult.statusCode });
  }

  static createServerErrorResponse() {
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
} 