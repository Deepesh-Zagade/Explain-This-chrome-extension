import { AlertCircle } from "lucide-react";

export default function ErrorState({ message }) {
  return (
    <div className="flex gap-2 py-4 text-[13px] leading-relaxed">
      <AlertCircle size={16} className="text-highlight shrink-0 mt-0.5" />
      <p className="text-muted">{message}</p>
    </div>
  );
}