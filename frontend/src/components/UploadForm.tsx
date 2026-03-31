import { useState, useEffect } from "react";
import AIResult from "./AIResult";
import HeatmapCanvas from "./HeatmapCanvas";

export default function UploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const arr = Array.from(selectedFiles);
    setFiles(arr);
    setPreview(arr.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await axios.post('http://127.0.0.1:8000/reports/', formData);
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Fail to respond. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result) {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow w-full">
      <label className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer block border-gray-300 dark:border-gray-600 hover:bg-gray-50 transition">
        Drag & drop or click to upload
        <input type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </label>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {preview.map((src, i) => (
          <div key={i}>
            {result && result.boxes ? (
              <HeatmapCanvas image={src} boxes={result.boxes} />
            ) : (
              <img src={src} className="rounded-lg object-cover w-full h-32" />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={files.length === 0 || loading}
        className="mt-4 w-full py-2 rounded-xl bg-green-600 text-white flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? <span className="animate-spin">🌀</span> : "Analyze"}
      </button>

      {result && (
        <div id="result" className="mt-4">
          <AIResult severity={result.severity} type={result.type} />
        </div>
      )}
    </div>
  );
}