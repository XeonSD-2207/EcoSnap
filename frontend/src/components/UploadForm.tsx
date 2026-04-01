import axios from "axios";
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
      // Đổi localhost thành 127.0.0.1 để tránh lỗi CORS khi backend chạy trên localhost
      const response = await axios.post('http://127.0.0.1:8000/reports/', formData);
      setResult(response.data);
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Backend chưa chạy hoặc sai địa chỉ API!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow w-full">
      <input type="file" onChange={(e) => handleFiles(e.target.files)} className="mb-4" />
      
      <div className="grid grid-cols-1 gap-4 mt-4">
  {preview.map((src, i) => (
    <div key={i} className="border-2 border-red-500 rounded-xl overflow-hidden">
      {/* Nếu có result và có tọa độ boxes thì vẽ Heatmap */}
      {result && result.boxes ? (
        <HeatmapCanvas image={src} boxes={result.boxes} />
      ) : (
        <img src={src} className="w-full h-64 object-cover" />
      )}
    </div>
  ))}
</div>

      <button
        onClick={handleSubmit}
        disabled={loading || files.length === 0}
        className="mt-4 w-full py-2 bg-green-600 text-white rounded-xl"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && <AIResult severity={result.severity} type={result.type} />}
    </div>
  );
}