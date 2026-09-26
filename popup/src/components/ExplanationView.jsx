import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { renderMarkdown } from "../lib/markdown";

export default function ExplanationView({ selectedText, explanation }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      {selectedText && (
        <div className="border-l-2 border-highlight/70 bg-ink-2 pl-3 pr-2 py-2 mb-4 rounded-r">
          <p className="text-[12px] text-muted italic line-clamp-3">
            "{selectedText}"
          </p>
        </div>
      )}

      <div className="font-serif-read text-paper">
        {renderMarkdown(explanation)}
      </div>

      <button
        onClick={handleCopy}
        className="mt-3 flex items-center gap-1.5 text-[11px] text-muted hover:text-highlight cursor-pointer transition-colors"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? "Copied" : "Copy explanation"}
      </button>
    </div>
  );
}