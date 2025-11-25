import { prisma } from "@/database";
import Link from "next/link";
// import { setTimeout } from "node:timers/promises";
import { Suspense } from "react";
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function Home() {
  
  const userId = (await cookies()).get("user_id")?.value;
  if (!userId) {
    redirect("/login"); // Send to login if not authenticated
  }

  return (
      <BlocksList />
  );
}

async function BlocksList() {
  // Get current user id from cookies
  const userIdRaw = (await cookies()).get("user_id")?.value
  const currentUserId = Number(userIdRaw);
  if (!currentUserId) {
    <p className="text-gray-500 italic text-center">
      You must be logged in to view your code blocks.
    </p>
  }
  const blocks = await prisma.block.findMany({
    where: { userId: currentUserId },
    orderBy: { id: "desc" }, // order by latest
  });
  // await setTimeout(5000);
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Code blocks</h1>
          <Link
            href="/blocks/create"
            className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            + Create Block
          </Link>
        </header>

        {blocks.length === 0 ? (
          <p className="text-gray-500 italic text-center">
            No blocks yet. Create one to get started!
          </p>
        ) : (
          <ul className="space-y-3">
            {blocks.map((block) => (
              <li
                key={block.id}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
              >
                <span className="text-gray-800 font-medium">
                  <Link href={`/blocks/${block.id}`}>{block.title}</Link>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function SkeletonBlocks() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 animate-pulse">
      <div className="max-w-2xl mx-auto">
        {/* Header skeleton */}
        <header className="flex items-center justify-between mb-8">
          <div className="h-8 w-40 bg-gray-300 rounded"></div>
          <div className="h-10 w-32 bg-gray-300 rounded-lg"></div>
        </header>

        {/* List skeleton */}
        <ul className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="p-4 bg-white rounded-lg shadow-sm">
              <div className="h-5 w-48 bg-gray-300 rounded"></div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}