
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

  describe("Login mode (isLogin='Sign up')", () => {
    it("should render email field label and input", () => {
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
  });

});
