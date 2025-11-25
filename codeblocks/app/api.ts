
"use server"; 
// Store actions here

import { prisma } from "@/database"; // ✅ Prisma client for DB operations
import { redirect, notFound } from "next/navigation"; // ✅ Helpers for navigation after actions
import { cookies } from "next/headers"; // ✅ For reading/writing cookies (used in login)

/* -------------------- Utility Functions -------------------- */

/**
Return null if input is not an integer
 */
function parseNumericId(input: unknown): number | null {
  const n = Number(input);
  return Number.isFinite(n) && Number.isInteger(n) ? n : null;
}

/**
 Ensure field value is not empty else throw an error
 */
function requireNonEmpty(value: string | null | undefined, name: string) {
  const v = (value ?? "").toString().trim();
  if (!v) throw new Error(`${name} is required`);
  return v;
}

/**
 * Get user id from cookies
 */
async function getCurrentUserId(): Promise<number | null> {
  const c = await cookies();
  const raw = c.get("user_id")?.value;
  const id = parseNumericId(raw);
  return id ?? null;
}

/* -------------------- Server Actions -------------------- */

/**
 * Create a new Block.
 * Require logged-in user (userId from cookie).
 * Redirect to home after creation.
 */
export async function createBlock(formData: FormData) {
  const title = requireNonEmpty(formData.get("title") as string, "title");
  const code = requireNonEmpty(formData.get("code") as string, "code");

  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("You must be logged in to create a block.");
  }

  await prisma.block.create({
    data: { title, code, userId },
  });

  redirect("/"); // After creating a block go back to homepage
}

/**
 * Update/edit an existing Block.
 * Validate ID, check ownership, update title & code.
 * Redirect to the block details page after updating
 */
export async function updateBlock(formData: FormData) {
  const id = parseNumericId(formData.get("id"));
  if (id === null) return notFound();

  const title = requireNonEmpty(formData.get("title") as string, "title");
  const code = requireNonEmpty(formData.get("code") as string, "code");

  const existing = await prisma.block.findUnique({ where: { id } });
  if (!existing) return notFound();

  // Only allow the owner to edit
  const currentUserId = await getCurrentUserId();
  if (!currentUserId || existing.userId !== currentUserId) {
    throw new Error("Not authorized to edit this block.");
  }

  await prisma.block.update({
    where: { id },
    data: { title, code },
  });

  redirect(`/blocks/${id}`);
}

/**
 * Delete a Block.
 * Validate ID, check ownership, delete block record.
 * Redirect to home after deleting
 */
export async function deleteBlock(formData: FormData) {
  const id = parseNumericId(formData.get("id"));
  if (id === null) return notFound();

  const existing = await prisma.block.findUnique({ where: { id } });
  if (!existing) return notFound();

  const currentUserId = await getCurrentUserId();
  if (!currentUserId || existing.userId !== currentUserId) {
    throw new Error("Not authorized to delete this block.");
  }

  await prisma.block.delete({ where: { id } });
  redirect("/");
}

/**
 * Handle user login.
 * Find user by username, check password (plaintext for demo).
 * Set a cookie with user_id and redirect to home.
 */
export async function handleLogin(formData: FormData) {
  const username = requireNonEmpty(formData.get("username") as string, "username");
  const password = requireNonEmpty(formData.get("password") as string, "password");

  // Prisma findUnique only supports one unique field.
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.password !== password) {
    redirect("/login");
    return;
  }

  // Set cookie for session
  (await cookies()).set("user_id", String(user.id));
  redirect("/");
}
