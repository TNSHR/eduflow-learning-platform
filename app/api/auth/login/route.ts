import { NextResponse } from "next/server";
import { comparePassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validations/auth.validation";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    // 1. Read request body
    const body = await request.json();

    // 2. Validate and normalize input
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid login data",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // 3. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 4. Do not reveal whether the email exists
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // 5. Compare supplied password with stored hash
    const passwordMatches = await comparePassword(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }
    // 6. Create authenticated session
await createSession(user.id);
    // 7. Return safe user information
    
    return NextResponse.json({
      success: true,
      message: "Login credentials verified",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong during login",
      },
      { status: 500 }
    );
  }
}