import { describe, expect, it } from "vitest";
import {
  loginSchema,
  registerSchema,
} from "@/lib/validations/auth.validation";

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "JOHN@EXAMPLE.COM",
      password: "Password@123",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("john@example.com");
    }
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "invalid-email",
      password: "Password@123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a short password", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a short name", () => {
    const result = registerSchema.safeParse({
      name: "A",
      email: "john@example.com",
      password: "Password@123",
    });

    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid login data", () => {
    const result = loginSchema.safeParse({
      email: "USER@EXAMPLE.COM",
      password: "Password@123",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
    }
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "Password@123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});
