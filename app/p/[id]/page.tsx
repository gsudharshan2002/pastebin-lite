import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  // ❗ Handle error responses
  if (!res.ok) {
    let message = "Paste not available";

    try {
      const err = await res.json();
      if (err?.error) message = err.error;
    } catch {}

    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">404</h1>
          <p className="text-gray-700 capitalize">
            {message.replace("_", " ")}
          </p>
        </div>
      </main>
    );
  }

  // ✅ Success case
  const data = await res.json();

  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-100">
      <pre className="bg-white p-6 rounded shadow max-w-xl whitespace-pre-wrap">
        {data.content}
      </pre>
    </main>
  );
}
