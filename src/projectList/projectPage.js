import { PROJECTS_JSON_PATH, BuildMediaHtml, BuildParagraphsHtml, LoadDeferredMedia } from './renderHelpers.js';

const Container = document.getElementById("project-detail");
const projectId = new URLSearchParams(window.location.search).get('id');

fetch(PROJECTS_JSON_PATH)
    .then((response) => response.json())
    .then((data) => {
        let project = data.find((p) => p.id === projectId);
        if (!project) {
            Container.innerHTML = `<p class="project-missing">Project not found.</p>`;
            return;
        }
        document.title = `${project.name} - James Milestone`;
        ConstructHtmlSection(project);
        LoadDeferredMedia(Container);
    })
    .catch((error) => console.error('Error loading JSON:', error));

function ConstructHtmlSection(project){
    let RelevantLinks = ``;
    if (project.links != null){
        for(let i = 0; i < project.links.length; i++){
            RelevantLinks += `<a href="${project.links[i].url}" target = "_blank">${project.links[i].title} </a> ${i < project.links.length -1 ?`<br/>` : ``}`
        }
    }

    let Highlights = ``;
    Object.entries(project.highlights).forEach(([key,value]) => {
        Highlights += `
        <details class="highlight">
            <summary class="highlight__title"><h4>${key}</h4></summary>
            <div class="highlight__content">
                ${BuildMediaHtml(value, key)}
                ${BuildParagraphsHtml(value.text)}
            </div>
        </details>`;
    });

    Container.innerHTML = `
    <div class ="project-row" style=" justify-content: center; ">
        <div class = "project-card">
            <div class ="top-section">
                <img src="${project.titleImage}" class = "project__title-image">
                <div class ="small-info">
                    <div class="project__subsection">
                        <h3>Relevant Links</h3>
                        <div class ="links">
                            ${RelevantLinks}
                        </div>
                    </div>
                    <div class="project__subsection">
                        <h3>Skills</h3>
                        <p>${project.skills}</p>
                    </div>
                </div>
            </div>

            <div class="project__subsection">
                <h3>Description</h3>
                ${BuildMediaHtml(project, project.name)}
                ${BuildParagraphsHtml(project.description)}
            </div>

            <div class="project__subsection">
                <h3>Highlights</h3>
                ${Highlights}
            </div>
        </div>
    </div>`;
}
