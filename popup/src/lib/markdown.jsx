// This file turns Gemini's markdown-style text (**bold**, * bullet points)
// into real React elements, instead of dumping raw "**text**" into a <p> tag.

// Handles INLINE formatting within a single line — currently just **bold**.
// Splits the line on the **bold** pattern, keeping the matched parts in the
// array (that's what the parentheses in the regex do), then wraps any piece
// that starts/ends with ** in a <strong> tag and leaves everything else as
// plain text.
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-paper">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

// Handles BLOCK-level structure — paragraphs vs bullet lists.
// Step 1: split the whole response into "blocks" wherever there's a blank
//         line (\n\n), same idea as how Markdown/Word treat paragraphs.
// Step 2: for each block, check if every line starts with "*" or "-" —
//         if so, treat the whole block as a bullet list.
// Step 3: otherwise, treat it as a normal paragraph and join its lines
//         back into one block of text.
// Every line of actual text also passes through renderInline() above,
// so bold formatting works inside both paragraphs and bullets.
export function renderMarkdown(text) {
  const blocks = text.split(/\n\s*\n/);

  return blocks.map((block, i) => {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const isList = lines.length > 0 && lines.every((l) => /^[-*]\s+/.test(l));

    if (isList) {
      return (
        <ul key={i} className="space-y-1.5 my-3">
          {lines.map((line, j) => (
            <li key={j} className="flex gap-2 text-[14.5px] leading-relaxed">
              <span className="text-highlight mt-0.75 shrink-0">—</span>
              <span>{renderInline(line.replace(/^[-*]\s+/, ""))}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={i} className="mb-3 last:mb-0 text-[14.5px] leading-relaxed">
        {renderInline(lines.join(" "))}
      </p>
    );
  });
}