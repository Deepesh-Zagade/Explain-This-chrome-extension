const MODEL = "gemini-3.6-flash";
console.log("Background worker running");
// Runs once when the extension is installed/reloaded
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "explain-this",
    title: "Explain this",
    contexts: ["selection"], // only show when text is selected
  });
});

// Runs when the context menu item is clicked

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log("info>>>>", info);
  console.log("tab>>>>", tab);
  if (info.menuItemId === "explain-this") {
    console.log("Selected text:", info.selectionText);
    const text = info.selectionText;

    //checking if api key is present in storage , if not present opening the popup to ask user to enter key
    const { geminiApiKey } = await chrome.storage.local.get(["geminiApiKey"]);
    if (!geminiApiKey) {
      await chrome.storage.local.set({
        status: "error",
        explanation:
          "No API key set. Right-click the extension icon → Options, and add your Gemini API key.",
      });
      chrome.action.openPopup();
      return;
    }

    // initialising a localstorage to save data
    await chrome.storage.local.set({
      status: "loading",
      selectedText: text,
      explanation: null,
    });
    // opens our extensions popup
    chrome.action.openPopup();

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { parts: [{ text: `Explain this simply: \n\n${text}` }] },
            ],
          }),
        },
      );

      const data = await response.json();
      console.log("Gemini response >>>>>>>>>>", data);
      const generated_answer = data.candidates[0].content.parts[0].text;
      await chrome.storage.local.set({
        status: "done",
        explanation: generated_answer,
      });
    } catch (error) {
      console.log(error);
      await chrome.storage.local.set({
        status: "error",
        explanation: error.message,
      });
    }
  }
});
