/**
 * @jest-environment node
 */
import { POST } from "@/app/api/login/route";
import { NextResponse } from "next/server";

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      ...data,
      status: options?.status || 200,
      json: () => Promise.resolve(data),
    })),
  },
}));

describe("POST /api/login", () => {
  beforeEach(() => {
    (NextResponse.json as jest.Mock).mockClear();
  });

  it("should return 400 if email is missing", async () => {
    const request = {
      json: () => Promise.resolve({ password: "password123" }),
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Email and password are required." },
      { status: 400 }
    );
  });

  it("should return 400 if password is missing", async () => {
    const request = {
      json: () => Promise.resolve({ email: "test@example.com" }),
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Email and password are required." },
      { status: 400 }
    );
  });

  it("should return 400 if both email and password are missing", async () => {
    const request = {
      json: () => Promise.resolve({}),
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Email and password are required." },
      { status: 400 }
    );
  });

  it("should return 400 if password is less than 6 characters", async () => {
    const request = {
      json: () => Promise.resolve({ 
        email: "test@example.com", 
        password: "12345" 
      }),
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Password must be at least 6 characters." },
      { status: 400 }
    );
  });

  it("should return 200 for valid credentials", async () => {
    const request = {
      json: () => Promise.resolve({ 
        email: "test@example.com", 
        password: "password123" 
      }),
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Login successful!" }
    );
  });

  it("should return 401 for invalid email", async () => {
    const request = {
      json: () => Promise.resolve({ 
        email: "wrong@example.com", 
        password: "password123" 
      }),
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Invalid credentials." },
      { status: 401 }
    );
  });

  it("should return 401 for invalid password", async () => {
    const request = {
      json: () => Promise.resolve({ 
        email: "test@example.com", 
        password: "wrongpassword" 
      }),
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Invalid credentials." },
      { status: 401 }
    );
  });

  it("should return 401 for completely invalid credentials", async () => {
    const request = {
      json: () => Promise.resolve({ 
        email: "wrong@example.com", 
        password: "wrongpassword" 
      }),
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Invalid credentials." },
      { status: 401 }
    );
  });

  it("should handle password with exactly 6 characters", async () => {
    const request = {
      json: () => Promise.resolve({ 
        email: "test@example.com", 
        password: "123456" 
      }),
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Invalid credentials." },
      { status: 401 }
    );
  });
});
