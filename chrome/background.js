let steps = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start") {
    steps = []; // Leeren, falls eine neue Aufzeichnung beginnt
    chrome.storage.local.set({ recording: true });
  } else if (request.action === "stop") {
    chrome.storage.local.set({ recording: false });
    downloadJSON(); // JSON anzeigen oder herunterladen
  } else if (request.action === "captureStep") {
    steps.push(request.step);
  }
});

function downloadJSON() {
  const guide = {
    title: "Guide Title",
    description: "Description of the guide",
    date: new Date().toISOString().split("T")[0],
    author: "Me",
    steps: steps
  };

  const json = JSON.stringify(guide, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  chrome.downloads.download({
    url: url,
    filename: "guide.json"
  });
}
