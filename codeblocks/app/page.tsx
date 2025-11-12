import Image from "next/image";
import { Prisma } from "@prisma/client";
import Link from "next/link";

export default async function Home() {
  const blocks = [
    { id: 1, title: "Test 1", code: `console.log("hello 1")`},
    { id: 2, title: "Test 2", code: `console.log("hello 2")`},
  
  ]; // Placeholder for fetched data}]
  // const blocks = await Prisma.block.findMany();
  return (
    <div>
        <h1>Code Blocks</h1>
        <ul>
          {blocks.map((block) => (
            <li key={block.id}>
              <Link href={`blocks/${block.id}`}>
              {block.title}: {block.code}
              </Link>
            </li>
          ))}                   
        </ul>
      
    </div>
  );
}
