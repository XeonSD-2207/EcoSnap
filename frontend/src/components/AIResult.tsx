import { motion } from "framer-motion";

type Props = {
  severity: "low" | "medium" | "high";
  type: string;
};

export default function AIResult({ severity, type }: { severity?: string; type?: string }) {
  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-inner border border-red-200">
      <h3 className="text-red-600 font-bold mb-2">Báo cáo điểm đen:</h3>
      <div className="flex gap-4">
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
          {severity || "Đang quét..."}
        </span>
        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
          {type || "Chưa xác định"}
        </span>
      </div>
    </div>
  );
}