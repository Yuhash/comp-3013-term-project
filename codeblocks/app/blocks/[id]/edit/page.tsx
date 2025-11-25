
import { prisma } from "@/database";
import { notFound } from "next/navigation";
import { updateBlock } from "@/app/api";
import Link from "next/link";

type Params = { id: string };

function parseNumericId(input: unknown): number | null {
  const n = Number(input);
  return Number.isFinite(n) && Number.isInteger(n) ? n : null;
}

export default async function EditBlockPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params; //  unwrap params
  const blockId = parseNumericId(id);

  if (blockId === null) {
    notFound(); // do not return
  }

  const block = await prisma.block.findUnique({
    where: { id: blockId }, // id is a number bc null is filtered out
  });

  if (!block) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Edit Block</h1>

        <form
          action={updateBlock}
          className="space-y-6 bg-white p-6 rounded shadow"
        >
          <input type="hidden" name="id" value={String(block.id)} />

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title <span className="text-red-600">*</span>
            </label>
            <input
              name="title"
              type="text"
              defaultValue={block.title}
              required
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-600 focus:ring-blue-600"
            />
          </div>

          {/* Code */}
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Code <span className="text-red-600">*</span>
            </label>
            <textarea
              name="code"
              defaultValue={block.code}
              required
              rows={12}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 font-mono shadow-sm focus:border-blue-600 focus:ring-blue-600"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 mt-4">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <Link
              href={`/blocks/${block.id}`}
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
