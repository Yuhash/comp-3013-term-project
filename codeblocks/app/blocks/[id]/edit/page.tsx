import Link from "next/link";
import { prisma } from '@/database'
import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: {
    id: string // changed to string bc Next.js passes route params as strings in URL
  }
}


// ✅ Server Action: must accept (formData: FormData)
async function updateBlockAction(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  const code = String(formData.get("code") ?? "");

  if (!Number.isFinite(id) || !title) {
    // You can return a structured error or throw
    throw new Error("Invalid input: numeric 'id' and non-empty 'title' are required.");
  }

  await prisma.block.update({
    where: { id },
    data: { title, code },
  });

  redirect(`/blocks/${id}`);
}


export default async function EditCodeBlock ({ params }: PageProps) {
    const id = Number(params.id); // convert to number for database query
    if (!Number.isFinite(id)) {
      return notFound();
    }
    
    const block = await prisma.block.findUnique ({
      where: { id: Number(params.id) },
    })

    if (!block) {
      return notFound();
    }   

    return (
        <div>
            <h1>Edit Block</h1>
            <form action={updateBlockAction} >
                <input type="hidden" name="id" value={block.id} />
                <label>
                    <input 
                        type="text" 
                        name="title" 
                        defaultValue={block.title} 
                        required
                        />  
                </label> 
                <label>
                    <span>Code</span>
                    <textarea 
                        name="code" 
                        defaultValue={block.code}
                    >
                    </textarea>    
                </label>
                <button type="submit">Save</button>
                <Link href={`/blocks/${id}`}>Cancel</Link>
            </form>
    
        </div>
    )
}