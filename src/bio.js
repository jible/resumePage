import { BuildParagraphsHtml } from './projectList/renderHelpers.js';

const BIO_JSON_PATH = 'src/bio.json';
// The answer text rolls out letter by letter, like a dating sim. Clicking the text box finishes it at once.
const CharactersPerSecond = 90;
const ReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const dialogueBox = document.querySelector('.dialogue-box');
const choicesRow = document.querySelector('.bio-choices');

fetch(BIO_JSON_PATH)
    .then((response) => response.json())
    .then((entries) => {
        BuildChoices(entries);
        // The box always shows an answer, so it starts on the intro (the first entry). The first one waits
        // until the box is on screen so the roll-out isn't finished before anyone scrolls down to it.
        SelectEntry(entries[0], true);
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
function SelectEntry(entry, waitUntilVisible = false){
    ShowEntry(entry, waitUntilVisible);
    choiceButtons.forEach((button, buttonEntry) => {
        button.setAttribute('aria-pressed', buttonEntry === entry);
    });
}

// Renders an entry's answer into the text box. This is the one place the text box gets its content.
// Every letter is in the box from the start, just invisible, so the box never changes size as it rolls out.
let rollout = 0; // identifies the current roll-out, so starting a new one cancels the old one
function ShowEntry(entry, waitUntilVisible = false){
    let current = ++rollout;
    dialogueBox.innerHTML = BuildParagraphsHtml(entry.answer);
    if (ReducedMotion) return;

    let letters = WrapLettersInSpans(dialogueBox);
    let revealTimes = ScheduleLetters(letters);
    let finish = () => letters.forEach((letter) => letter.classList.add('shown'));
    dialogueBox.onclick = finish;

    function Start(){
        if (current !== rollout) return;
        let start = performance.now() / 1000;
        let revealed = 0;
        function Frame(){
            if (current !== rollout) return;
            let elapsed = performance.now() / 1000 - start;
            while (revealed < letters.length && revealTimes[revealed] <= elapsed){
                letters[revealed++].classList.add('shown');
            }
            if (revealed < letters.length) requestAnimationFrame(Frame);
        }
        Frame();
    }

    if (!waitUntilVisible){
        Start();
        return;
    }
    let observer = new IntersectionObserver((observed) => {
        if (observed[0].isIntersecting){
            observer.disconnect();
            Start();
        }
    }, { threshold: 0.6 });
    observer.observe(dialogueBox);
}

// Replaces each character of the box's text with its own <span>, keeping any links or bold/italic
// markup around it. Returns the letter spans in reading order.
function WrapLettersInSpans(root){
    let letters = [];
    let walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
        let fragment = document.createDocumentFragment();
        for (let character of node.textContent){
            let span = document.createElement('span');
            span.className = 'letter';
            span.textContent = character;
            fragment.appendChild(span);
            letters.push(span);
        }
        node.replaceWith(fragment);
    });
    return letters;
}

// The time (seconds after the start) at which each letter should appear
function ScheduleLetters(letters){
    let time = 0;
    return letters.map((letter) => {
        let appearsAt = time;
        time += 1 / CharactersPerSecond;
        return appearsAt;
    });
}
