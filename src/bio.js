import { BuildParagraphsHtml } from './projectList/renderHelpers.js';

const BIO_JSON_PATH = 'src/bio.json';
const dialogueBox = document.querySelector('.dialogue-box');
const choicesRow = document.querySelector('.bio-choices');

fetch(BIO_JSON_PATH)
    .then((response) => response.json())
    .then((entries) => {
        BuildChoices(entries);
        // The box always shows an answer, so it starts on the intro (the first entry)
        SelectEntry(entries[0]);
    })
    .catch((error) => console.error('Error loading JSON:', error));

// One button per entry, showing its question
const choiceButtons = new Map();
function BuildChoices(entries){
    entries.forEach((entry) => {
        let button = document.createElement('button');
        button.type = 'button';
        button.className = 'bio-choice';
        button.textContent = entry.question;
        button.addEventListener('click', () => SelectEntry(entry));
        choicesRow.appendChild(button);
        choiceButtons.set(entry, button);
    });
}

// Shows the entry's answer and marks its question as the current one
function SelectEntry(entry){
    ShowEntry(entry);
    choiceButtons.forEach((button, buttonEntry) => {
        button.setAttribute('aria-pressed', buttonEntry === entry);
    });
}

// Renders an entry's answer into the text box. This is the one place the text box gets its content.
function ShowEntry(entry){
    dialogueBox.innerHTML = BuildParagraphsHtml(entry.answer);
}
