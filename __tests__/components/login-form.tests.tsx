
import { render, screen } from "@testing-library/react";
import { LoginForm } from "@/app/components/login-form";

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe("LoginForm - Render fields and inputs", () => {
  const mockingHandleLogin = jest.fn();

  describe(`Login mode`, () => {
    it(`should render email field label and input`, () => {
      render(<LoginForm isLogin={"Sign up"} handleLogin={mockingHandleLogin} />);

      // Check for email label
      const emailLabel = screen.getByText("Email");
      expect(emailLabel).toBeInTheDocument();

      // Check for email input
      const emailInput = screen.getByPlaceholderText("example@mail.com");
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("id", "email");
      
    });

    it(`should render password field label and input`, () => {
      render(<LoginForm isLogin={`Sign up`} handleLogin={mockingHandleLogin} />);

      // Check for password label
      const passwordLabel = screen.getByText("Password");
      expect(passwordLabel).toBeInTheDocument();

      // Check for password input
      const passwordInput = screen.getByPlaceholderText("your password");
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(passwordInput).toHaveAttribute("id", "password");
    });
  });

  describe(`Register mode`, () => {
    it(`should render name field label and input`, () => {
      render(<LoginForm isLogin={`Sign in`} handleLogin={mockingHandleLogin} />);

      // Check for name label
      const nameLabel = screen.getByText("Nama");
      expect(nameLabel).toBeInTheDocument();

      // Check for name input
      const nameInput = screen.getByPlaceholderText("your name");
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute("type", "text");
      expect(nameInput).toHaveAttribute("id", "name");
    });
    it(`should render email field label and input`, () => {
      render(<LoginForm isLogin={`Sign in`} handleLogin={mockingHandleLogin} />);

      // Check for email label
      const emailLabel = screen.getByText("Email");
      expect(emailLabel).toBeInTheDocument();

      // Check for email input
      const emailInput = screen.getByPlaceholderText("example@mail.com");
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("id", "email");
    });
    it(`should render password field label and input`, () => {
      render(<LoginForm isLogin={`Sign in`} handleLogin={mockingHandleLogin} />);

      // Check for password label
      const passwordLabel = screen.getByText("Password");
      expect(passwordLabel).toBeInTheDocument();

      // Check for password input
      const passwordInput = screen.getByPlaceholderText("your password");
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(passwordInput).toHaveAttribute("id", "password");
    });
  });

});
