import Link from "next/link";
import { prisma } from '@/database'
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    id: string // changed to string bc Next.js passes route params as strings in URL
  }
}


export default async function CodeBlockDetail({ params }: PageProps) {
  const id = Number(params.id); // convert to number for database query
  if (!Number.isFinite(id)) {
    return notFound();
  }
  const block = await prisma.block.findUnique ({
    where: { id: Number(params.id) },
  }) 
  // block not found handling
  if (!block) {
    return (
      notFound()
    );
  }
  return (
    <div>
      <h1>{block.title}</h1>
      <pre>
        <code>{block.code}</code>
      </pre>
      <div>
      <Link href={`/blocks/${id}/edit`}><button type="button">Edit</button>
      </Link>
      <button>Delete</button>

      <div>
        <Link href="/">Go back Home</Link>
      </div>
    </div>
  </div>
  );
}
