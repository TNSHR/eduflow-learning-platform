import { redirect } from "next/navigation";
import { UserRole } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import { AppError } from "@/lib/utils/app-error";

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireUser();

  if (!allowedRoles.includes(user.role)) {
    throw new AppError("Forbidden", 403);
  }

  return user;
}