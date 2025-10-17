import React, { useRef, useState } from "react";

export default function App() {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async (file: File) => {
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.append("image", file);

      const resp = await fetch("/api/upload", { method: "POST", body: form });
      const contentType = resp.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await resp.json()
        : await resp.text();

      if (!resp.ok) {
        throw new Error(data.error || data.message || "Upload failed");
      }

      setResult(data);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">
          Image Size Analyzer
        </h1>

        <ImageUploader onUpload={handleUpload} />

        {error && (
          <div className="mt-4 text-sm text-red-600 border border-red-200 bg-red-50 p-3 rounded-xl">
            Error: {error}
          </div>
        )}

        {result && (
          <div className="mt-4">
            <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function ImageUploader({ onUpload }: { onUpload: (file: File) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    await onUpload(file);
    setLoading(false);
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
    
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full cursor-pointer rounded-xl border border-dashed border-gray-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-700"
      />
      <button
        onClick={upload}
        disabled={!file || loading}
        className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Uploading…" : "Upload & Analyze"}
      </button>
      {file && (
        <p className="text-xs text-gray-500">
          Selected: <span className="font-medium">{file.name}</span>
        </p>
      )}
    </div>
  );
}
