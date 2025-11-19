
import { prisma } from "@/database";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type PageProps = { params: Promise<{ id: string }> };

function parseNumericId(input: string): number | null {
  const n = Number(input);
  return Number.isFinite(n) && Number.isInteger(n) ? n : null;
}

{/* Server action to save edits */}
async function saveBlock(formData: FormData) {
  "use server";

  const rawId = formData.get("id");
  const title = (formData.get("title") || "").toString().trim();
  const code = (formData.get("code") || "").toString();

  if (!rawId) return notFound();

  const id = parseNumericId(rawId.toString());
  if (id === null) return notFound();

  // Require title and code values, if empty throw error
  if (!title || !code) {
    throw new Error("Both title and code are required.");
  }

  // Ensure the block id exists else return not found
  const existing = await prisma.block.findUnique({ where: { id } });
  if (!existing) return notFound();

  // Update 
  await prisma.block.update({
    where: { id },
    data: { title, code },
  });

  // Redirect back to the code block details page
  redirect(`/blocks/${id}`);
}


export default async function EditBlockPage({ params }: PageProps) {
  const { id: idParam } = await params; // ✅ await params in your setup
  const blockId = parseNumericId(idParam);
  if (blockId === null) return notFound();

  const block = await prisma.block.findUnique({
    where: { id: blockId },
  });

  if (!block) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold">Edit code block</h1>
        <p className="text-gray-600 mt-1">
          Update the fields below and save your changes.
        </p>
      </div>

      {/* Edit form */}
      <form
        action={saveBlock}
        className="max-w-2xl mx-auto mt-6 space-y-6 bg-white p-6 rounded shadow"
      >
        {/* ID */}
        <input type="hidden" name="id" value={block.id} />

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={block.title ?? ""}
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-600 focus:ring-blue-600"
            placeholder="Enter a descriptive title"
          />
        </div>

        {/* Code */}
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Code
          </label>
          <textarea
            id="code"
            name="code"
            defaultValue={block.code ?? ""}
            rows={12}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 font-mono shadow-sm focus:border-blue-600 focus:ring-blue-600"
            placeholder="// Paste your snippet here"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Save changes
          </button>
          <Link
            href={`/blocks/${block.id}`}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
