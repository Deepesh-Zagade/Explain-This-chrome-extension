import { useState, useEffect } from "react";
import Header from "./components/Header";
import IdleState from "./components/IdleState";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import ExplanationView from "./components/ExplanationView";

function App() {
  const [status, setStatus] = useState("idle");
  const [selectedText, setSelectedText] = useState("");
  const [explanation, setExplanation] = useState("");

  // Load whatever's currently in storage when the popup first opens
  // (covers the case where a result already exists from before).
  useEffect(() => {
    chrome.storage.local.get(
      ["status", "selectedText", "explanation"],
      (result) => {
        setStatus(result.status || "idle");
        setSelectedText(result.selectedText || "");
        setExplanation(result.explanation || "");
      }
    );

    // updating the states as the api response comes.
    // in real time from "loading" to "done" without needing a refresh.
    const listener = (changes) => {
      if (changes.status) setStatus(changes.status.newValue);
      if (changes.selectedText) setSelectedText(changes.selectedText.newValue);
      if (changes.explanation) setExplanation(changes.explanation.newValue);
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  return (
    <div className="w-110 bg-ink text-paper font-sans">
      <Header />
      <div className="p-4 max-h-115 overflow-y-auto">
        {status === "idle" && <IdleState />}
        {status === "loading" && <LoadingState />}
        {status === "error" && <ErrorState message={explanation} />}
        {status === "done" && (
          <ExplanationView
            selectedText={selectedText}
            explanation={explanation}
          />
        )}
      </div>
    </div>
  );
}

export default App;