import { NextResponse } from "next/server";

const STATE_CHANGING_METHODS = new Set([
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);

export function validateRequestOrigin(request: Request) {
  if (!STATE_CHANGING_METHODS.has(request.method)) {
    return null;
  }

  const origin = request.headers.get("origin");

  if (!origin) {
    return NextResponse.json(
      { message: "Missing request origin" },
      { status: 403 }
    );
  }

  const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL;

  if (!allowedOrigin) {
    console.error("NEXT_PUBLIC_APP_URL is not configured");

    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const requestOrigin = new URL(origin).origin;
    const expectedOrigin = new URL(allowedOrigin).origin;

    if (requestOrigin !== expectedOrigin) {
      return NextResponse.json(
        { message: "Invalid request origin" },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json(
      { message: "Invalid request origin" },
      { status: 403 }
    );
  }

  return null;
}
