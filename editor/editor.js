// Custom branding
//document.body.style.setProperty('--primary', '#3498db');
//document.getElementById("logo").src = "https://michivonah.ch/assets/logo/logo_white.svg";

// Print Button
const printBtn = document.getElementById("printBtn");
printBtn.addEventListener('click', function(){
    window.print();
});

// Import guide
const importBtn = document.getElementById("importBtn");
const fileInput = document.getElementById("file-import-input");
importBtn.addEventListener('click', function(){
    fileInput.click();
});

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event){
        const content = event.target.result;
        const data = JSON.parse(content);
        loadGuide(data);
    };
    reader.readAsText(file);
});

// add step
const addStepBtn = document.getElementById("addStepBtn");
addStepBtn.addEventListener('click', function(){
    const stepsContainer = document.getElementById("stepsContainer");
    stepsContainer.append(createStepElement("Title", "Description", "../logo/mockup-viewer-editor.jpg"));
});

// render guide with steps
function loadGuide(data){
    // render meta data
    const guideTitle = document.getElementById("guideTitle");
    const guideDescription = document.getElementById("guideDescription");
    const guideAuthor = document.getElementById("guideAuthor");

    guideTitle.textContent = data.title;
    guideDescription.textContent = data.description;
    guideAuthor.textContent = data.author;

    // render steps
    const steps =  data.steps;
    const stepsContainer = document.getElementById("stepsContainer");

    for (const step of steps){
        const element = createStepElement(step.label, step.description, step.image);
        stepsContainer.append(element);
    }
}

function createStepElement(label, description, imgSrc){
    // create container
    const container = document.createElement("div");
    container.classList = "step";

    // create container for text & image
    const textContainer = document.createElement("div");
    const imgContainer = document.createElement("div");

    // create title
    const title = document.createElement("h2");
    title.textContent = label;
    textContainer.appendChild(title);

    // create description
    const desc = document.createElement("p");
    desc.textContent = description;
    textContainer.appendChild(desc);

    // create image
    const image = document.createElement("img");
    image.src = imgSrc;
    imgContainer.appendChild(image);

    // append to main container
    container.appendChild(textContainer);
    container.appendChild(imgContainer);

    // return step element
    return container;
}