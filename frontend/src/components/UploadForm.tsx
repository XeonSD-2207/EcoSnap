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
  setResult(null); // Reset kết quả cũ

  const formData = new FormData();
  formData.append('file', files[0]);

  try {
    console.log("Đang gọi API...");
    const response = await axios.post('http://127.0.0.1:8000/reports/', formData);
    
    // Kiểm tra xem Backend có trả về 'boxes' không
    console.log("Dữ liệu nhận được:", response.data);
    
    if (response.data) {
      setResult(response.data);
    }
  } catch (error) {
    console.error("Lỗi rồi Xeon ơi:", error);
    // Nếu lỗi, tao sẽ ép nó hiện một cái "điểm đen" giả để mày xem Heatmap có chạy không
    setResult({
      severity: "High (Fake)",
      type: "Test Point",
      boxes: [{ x: 20, y: 30, width: 40, height: 40 }] 
    });
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