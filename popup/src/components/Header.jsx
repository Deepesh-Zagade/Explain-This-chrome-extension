import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
      <Sparkles size={15} className="text-highlight" />
      <span className="text-[13px] font-medium tracking-wide">
        Explain This
      </span>
    </div>
  );
}