import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw<
      Array<{ current_database: string; current_port: number }>
    >`
      SELECT
        current_database(),
        inet_server_port() AS current_port;
    `;

    return NextResponse.json({
      success: true,
      database: result[0]?.current_database,
      port: result[0]?.current_port,
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 }
    );
  }
}
