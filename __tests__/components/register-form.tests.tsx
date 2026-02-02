
import { act, fireEvent, render, screen } from "@testing-library/react";
import RegisterForm from "@/app/register/register-form";

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}))

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}))

describe("Register fields and inputs", () => {
    it(`should render name field label and input`, async () => {
      render(<RegisterForm />);
      

      // Check for name label
      const nameLabel = screen.getByText("Nama");
      expect(nameLabel).toBeInTheDocument();

      // Check for name input
      const nameInput = screen.getByPlaceholderText("your name");
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute("type", "text");
      expect(nameInput).toHaveAttribute("id", "name");
    });
    it(`should render email field label and input`, async () => {
      render(<RegisterForm />);
      

      // Check for email label
      const emailLabel = screen.getByText("Email");
      expect(emailLabel).toBeInTheDocument();

      // Check for email input
      const emailInput = screen.getByPlaceholderText("example@mail.com");
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("id", "email");
    });
    it(`should render password field label and input`, async () => {
      render(<RegisterForm />);
      

      // Check for password label
      const passwordLabel = screen.getByText("Password");
      expect(passwordLabel).toBeInTheDocument();

      // Check for password input
      const passwordInput = screen.getByPlaceholderText("your password");
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(passwordInput).toHaveAttribute("id", "password");
    });
     it(`should show the password when eye button clicked`, async () => {
      render(<RegisterForm />);
      
      
      const passwordInput = screen.getByPlaceholderText("your password");
      const showPasswordButton = screen.getByTestId("show-password-button");
     
      // initial state: password hidden
      expect(passwordInput).toHaveAttribute("type", "password");

      // click once → show password
      act(() => {
        fireEvent.click(showPasswordButton);
      })
      expect(passwordInput).toHaveAttribute("type", "text");
    })

    it(`should hide the password when eye button clicked`, async () => {
      render(<RegisterForm />);
      
      
      const passwordInput = screen.getByPlaceholderText("your password");
      const showPasswordButton = screen.getByTestId("show-password-button");
      
      // initial state: password hidden
      expect(passwordInput).toHaveAttribute("type", "password");

      // click once → show password
      act(() => {
        fireEvent.click(showPasswordButton);
      })
      expect(passwordInput).toHaveAttribute("type", "text");

      // click again → hide password
      act(() => {
      fireEvent.click(showPasswordButton);
      })
      expect(passwordInput).toHaveAttribute("type", "password");
    })
  });

describe(`Test Register Success / Failed`, () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockPush.mockReset();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(`should show success dialog and redirect to Login page after user register successfully`, async () => {
    // Mock successful registration response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ status: 201, message: "User created successfully" }),
    });

    render(<RegisterForm />);
    
    const nameInput = screen.getByPlaceholderText("your name");
    const emailInput = screen.getByPlaceholderText("example@mail.com");
    const passwordInput = screen.getByPlaceholderText("your password");
    const submitButton = screen.getByRole("button", { name: /register/i });
    
    // Fill in the form
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Wait for the success dialog to appear
    const successDialog = await screen.findByText("Register Success");
    expect(successDialog).toBeInTheDocument();

    // Verify success message
    const successMessage = screen.getByText(/please press continue to sign-in/i);
    expect(successMessage).toBeInTheDocument();

    // Verify fetch was called with correct data
    expect(global.fetch).toHaveBeenCalledWith("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }),
    });

    // Click the Continue button
    const continueButton = screen.getByRole("button", { name: /continue to login/i });
    await act(async () => {
      fireEvent.click(continueButton);
    });

    // Verify router.push was called to redirect to login page
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it(`should show error dialog when user register failed`, async () => {
    // Mock failed registration response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ status: 400, message: "Email already exists" }),
    });

    render(<RegisterForm />);
    
    const nameInput = screen.getByPlaceholderText("your name");
    const emailInput = screen.getByPlaceholderText("example@mail.com");
    const passwordInput = screen.getByPlaceholderText("your password");
    const submitButton = screen.getByRole("button", { name: /register/i });
    
    // Fill in the form
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
      fireEvent.change(emailInput, { target: { value: "existing@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Wait for the error dialog to appear
    const errorDialog = await screen.findByText("Register Failed");
    expect(errorDialog).toBeInTheDocument();

    // Verify error message
    const errorMessage = screen.getByText(/sign-up failed/i);
    expect(errorMessage).toBeInTheDocument();

    // Verify router.push was NOT called
    expect(mockPush).not.toHaveBeenCalled();
  });
})

