import { prisma } from "@/database";
import Link from "next/link";
import { notFound, redirect} from "next/navigation";
import { deleteBlock } from "@/app/api"; // Import server action

type Params =  { id: string };


export default async function ShowBlock({ 
 
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params; // ✅ unwrap the Promise

  const numericId = Number(id);

  // Validate ID
  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound(); // do not return
  }

  // Fetch block by ID
  const block = await prisma.block.findUnique({
    where: { id: numericId },
  });

  if (!block) {
    notFound(); // do not return
  }


  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <header className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800">Code detail</h1>
        {/* Back link to balance the header with the 'justify-between' */}
        <Link
          href="/"
          className="inline-block px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-100 transition"
        >
          ← Home
        </Link>
      </header>

      {/* Block code */}
      <div className="max-w-2xl mx-auto mt-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{block.title}</h2>
        <pre className="bg-white p-4 rounded shadow">
          <code className="font-mono">{block.code}</code>
        </pre>
      </div>

      {/* Actions */}
      <div className="max-w-2xl mx-auto mt-4 flex space-x-4">
        <Link href={`/blocks/${block.id}/edit`}>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 cursor-pointer">
            Edit
          </button>
        </Link>

        {/* Delete form */}
        <form action={deleteBlock}>
          <input type="hidden" name="id" value={block.id} />
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
          >
            Delete
          </button>
        </form>
      </div>
    </main>
  );
}
