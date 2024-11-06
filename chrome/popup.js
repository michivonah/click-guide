// Script for Popup
const toggleRecordingBtn = document.getElementById("toggleRecording");

toggleRecordingBtn.addEventListener('click', () => {
    console.log("Button clicked");
    chrome.runtime.sendMessage({action: 'triggerName'});
});