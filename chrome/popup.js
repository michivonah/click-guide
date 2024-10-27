let isRecording = false;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("toggle-recording").addEventListener("click", () => {
    isRecording = !isRecording;
    const message = isRecording ? "start" : "stop";
    chrome.runtime.sendMessage({ action: message });
    document.getElementById("toggle-recording").textContent = isRecording ? "Stop Recording" : "Start Recording";
  });
});
