let recording = false;

chrome.storage.local.get("recording", (data) => {
  recording = data.recording || false;
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.recording) {
    recording = changes.recording.newValue;
  }
});

document.addEventListener("click", async (event) => {
  if (!recording) return;

  const elementSelector = getElementSelector(event.target);

  chrome.tabs.captureVisibleTab(null, { format: "jpeg" }, (image) => {
    const step = {
      label: `Click on ${elementSelector}`,
      description: "Short description of the step",
      action: "click",
      element: elementSelector,
      image: image
    };

    chrome.runtime.sendMessage({ action: "captureStep", step: step });
  });
});

function getElementSelector(element) {
  if (element.id) return `#${element.id}`;
  if (element.className) return `.${element.className.split(" ").join(".")}`;
  return element.tagName.toLowerCase();
}
