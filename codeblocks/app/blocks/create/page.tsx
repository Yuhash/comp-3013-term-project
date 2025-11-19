import { createBlock } from "@/app/api";
import { prisma } from "@/database";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function CreateBlock() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Create a block</h1>
      <form action={createBlock}
      className="max-w-2xl mx-auto mt-6 space-y-6 bg-white p-6 rounded shadow"
      >
        {/* Title input */}
        <div className="max-w-2xl mx-auto mt-6 mb-4">
          <label
            htmlFor="title" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title <span className="text-red-600">*</span>
          </label>
          <input 
            name="title" 
            type="text" 
            placeholder="Enter a descriptive title" 
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus: border-blue-600 focus:ring-blue-600"
            />
        </div>
        {/* Code input */}
        <div>
          <label
            htmlFor="title" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Code <span className="text-red-600">*</span>
          </label>
        </div>
        <textarea 
          name="code" 
          placeholder="your code goes here..."
          required
          rows={12}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 font-mono shadow-sm focus: border-blue-600 focus: ring-blue-600">
        </textarea>

        {/* Actions */}
        <div className="flex items-center space-x-4 mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create
              </button>
          <Link
            href={`/`}
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
