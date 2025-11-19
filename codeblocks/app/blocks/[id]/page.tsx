import { prisma } from "@/database";
import Link from "next/link";
import { notFound, redirect} from "next/navigation";

type Props = { params: { id: string } };

{/* Delete  block function */}
async function deleteBlock(formData: FormData) {
  "use server";

  const rawId = formData.get("id");
  const id = Number(rawId);

  // Return not found if it doesn't exist or is null
  if (!rawId || Number.isNaN(id)  ) {
    return notFound();
  }

  const existingId = await prisma.block.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingId) {
    return notFound();
  }
  await prisma.block.delete({
    where: { id },
  });
  redirect("/"); // Go back to home page
}

export default async function ShowBlock({ params }: Props) {

  const { id } =  await params;

  const numericId = Number(id);
  // Manage invalid id value
  if (Number.isNaN(numericId) || !Number.isInteger(numericId)) {
    return notFound();
  }

  const block = await prisma.block.findUnique({
    where: { id: Number(id) },
  });

  if (!block) return notFound();

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
      <div className="max-w-2xl mx-auto">
        <h1>{block.title}</h1>
      </div>
      <div className="max-w-2xl mx-auto mt-4">
        <pre className="bg-white p-4 rounded shadow">
          <code>{block.code}</code>
        </pre>
      </div>
      <div className="max-w-2xl mx-auto mt-4 flex space-x-4">
        <Link href={`/blocks/${block.id}/edit`}>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 cursor-pointer">Edit</button>
        </Link>
        <form action = {deleteBlock}>
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
