import Link from "next/link";


export default function CreateBlock() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  }
  return (
    <div>
      <Link href="/">Go back Home</Link>
      <form>
        <div>
          <input type="text" placeholder="Block Title" />
        </div>
        <textarea placeholder="your code goes here..."></textarea>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
