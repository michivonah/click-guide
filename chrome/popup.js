// Script for Popup

const toggleRecordingBtn = document.getElementById("toggleRecording");
const exportBtn = document.getElementById("exportBtn");

toggleRecordingBtn.addEventListener('click', () => {
    console.log("Button clicked");
    chrome.runtime.sendMessage({action: 'triggerName'});
});

exportBtn.addEventListener('click', () => {
    console.log("Export requested");
    chrome.runtime.sendMessage({
        action: "generateGuide"
    }, (response) => {
        const guide = response.guide;
        exportJSON(guide, "guide.json");
    });
});

function exportJSON(object, filename){
    const json = JSON.stringify(object, null, 2);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}