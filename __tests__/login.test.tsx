/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    loading: jest.fn(() => "toast-id"),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe("LoginPage", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    jest.clearAllMocks();
  });

  it("should render the login form with all elements", () => {
    render(<LoginPage />);
    
    expect(screen.getAllByText("Login")[0]).toBeInTheDocument(); // Get the h1 element
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Password/i)[0]).toBeInTheDocument(); // Get the label
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Show password/i })).toBeInTheDocument();
  });

  it("should update email when typing", () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    
    expect(emailInput).toHaveValue("test@example.com");
  });

  it("should update password when typing", () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getAllByDisplayValue("")[1]; // Get the second input (password)
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    
    expect(passwordInput).toHaveValue("password123");
  });

  it("should toggle password visibility when show/hide button is clicked", () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getAllByDisplayValue("")[1]; // Get the second input (password)
    const toggleButton = screen.getByRole("button", { name: /Show password/i });
    
    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute("type", "password");
    
    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /Hide password/i })).toBeInTheDocument();
    
    // Click to hide password again
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: /Show password/i })).toBeInTheDocument();
  });

  it("should show validation error when email is empty and form is submitted", async () => {
    render(<LoginPage />);
    
    const submitButton = screen.getByRole("button", { name: /Login/i });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
  });

  it("should show validation error when password is less than 6 characters", async () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getAllByDisplayValue("")[1]; // Get the second input (password)
    const submitButton = screen.getByRole("button", { name: /Login/i });
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText("Password must be at least 6 characters.")).toBeInTheDocument();
  });

  it("should show validation errors for both email and password when both are invalid", async () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getAllByDisplayValue("")[1]; // Get the second input (password)
    const submitButton = screen.getByRole("button", { name: /Login/i });
    
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password must be at least 6 characters.")).toBeInTheDocument();
  });

  it("should not show validation errors when form is valid", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Login successful!" }),
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getAllByDisplayValue("")[1]; // Get the second input (password)
    const submitButton = screen.getByRole("button", { name: /Login/i });
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.queryByText("Email is required.")).not.toBeInTheDocument();
      expect(screen.queryByText("Password must be at least 6 characters.")).not.toBeInTheDocument();
    });
  });

  it("should call API with correct data when form is valid", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Login successful!" }),
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getAllByDisplayValue("")[1]; // Get the second input (password)
    const submitButton = screen.getByRole("button", { name: /Login/i });
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "test@example.com", password: "password123" }),
      });
    });
  });

  it("should show success toast when login is successful", async () => {
    const { toast } = require("react-hot-toast");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Login successful!" }),
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getAllByDisplayValue("")[1]; // Get the second input (password)
    const submitButton = screen.getByRole("button", { name: /Login/i });
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast.loading).toHaveBeenCalledWith("Logging in...");
      expect(toast.success).toHaveBeenCalledWith("Login successful!", { id: "toast-id" });
    });
  });

  it("should show error toast when login fails", async () => {
    const { toast } = require("react-hot-toast");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Invalid credentials." }),
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getAllByDisplayValue("")[1]; // Get the second input (password)
    const submitButton = screen.getByRole("button", { name: /Login/i });
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast.loading).toHaveBeenCalledWith("Logging in...");
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials.", { id: "toast-id" });
    });
  });

  it("should show generic error toast when API response has no message", async () => {
    const { toast } = require("react-hot-toast");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getAllByDisplayValue("")[1]; // Get the second input (password)
    const submitButton = screen.getByRole("button", { name: /Login/i });
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast.loading).toHaveBeenCalledWith("Logging in...");
      expect(toast.error).toHaveBeenCalledWith("An error occurred.", { id: "toast-id" });
    });
  });

  it("should not call API when form validation fails", async () => {
    render(<LoginPage />);
    
    const submitButton = screen.getByRole("button", { name: /Login/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  it("should prevent form submission when validation fails", async () => {
    const { toast } = require("react-hot-toast");
    
    render(<LoginPage />);
    
    const submitButton = screen.getByRole("button", { name: /Login/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast.loading).not.toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalled();
    });
  });
});
