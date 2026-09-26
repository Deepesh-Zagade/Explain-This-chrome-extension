// load any existing key in storage when page opens
chrome.storage.local.get(["geminiApiKey"], (result) => {
  if (result.geminiApiKey) {
    document.getElementById("apiKey").value = result.geminiApiKey;
  }
});

document.getElementById('save').addEventListener('click',()=>{
    const key = document.getElementById('apiKey').value.trim()
    chrome.storage.local.set({ geminiApiKey: key }, () => {
    const status = document.getElementById("status");
    status.textContent = "Saved!";
    setTimeout(() => (status.textContent = ""), 1500);
  });
})