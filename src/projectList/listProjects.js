const ProjectsSection = document.getElementById("projects")

// Get the Json file
const jsonPath = 'src/projectList/projects.json'
let projects;
fetch(jsonPath)
    .then((response) => response.json())
    .then((data) => {
        RenderProjects(data); // Access the projects array
        projectsRendered = true;
        maybeLoadGifs();
    })
    .catch((error) => console.error('Error loading JSON:', error));

// The gameplay gifs are huge, so they're kept out of `src` (and off the
// window "load" event) until the intro animations have started. Only then
// do we start fetching them in the background.
let animationsStarted = false;
let projectsRendered = false;
function maybeLoadGifs() {
    if (!animationsStarted || !projectsRendered) return;
    document.querySelectorAll('.gameplay-gif[data-src]').forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    });
}
window.addEventListener('animations-ready', () => {
    animationsStarted = true;
    maybeLoadGifs();
});

// Make html elements for each project
let ProjectRowIsLeft = false;
function RenderProjects(data){
    for (let ProjectNumber = 0 ; ProjectNumber < data.length; ProjectNumber ++){
        let project = data[ProjectNumber];
        ConstructHtmlSection(project, ProjectNumber, data.length);

        if ( ProjectNumber == data.length -1) break;
        let ProjectDivider = document.createElement("div");
        ProjectDivider.classList.add("project-divider");
        if (ProjectRowIsLeft){
            ProjectDivider.style.transform="scaleY(-1)";

        }
        ProjectsSection.appendChild(ProjectDivider)
        ProjectRowIsLeft = !ProjectRowIsLeft;
    };
}


function ConstructHtmlSection(project, ProjectNumber, ProjectCount){
    
    let CardSide = ProjectRowIsLeft ? "Left": "Right"; 
    let PathSide = !ProjectRowIsLeft ? "Left": "Right"; 

    let RelevantLinks = ``;
    let projectRowPinStyle = `${ProjectRowIsLeft? `flex-start`: `flex-end`}`

    let pathImage;
    if (PathSide=="Left" && ProjectNumber == 0){
        pathImage = "bottomLeftPath";
    } else if (PathSide=="Right" && ProjectNumber != ProjectCount -1){
        pathImage = "longRightPath";
    }
    else if (PathSide=="Right" && ProjectNumber != ProjectCount-1 ){
        pathImage = "longRightPath";
    } else if (PathSide=="Left" && ProjectNumber != ProjectCount -1){
        pathImage = "longLeftPath";
    } else if (PathSide=="Left" && ProjectNumber == ProjectCount -1){
        pathImage = "topLeftPath";
    } else if (PathSide=="Right" && ProjectNumber == ProjectCount -1){
        pathImage = "topRightPath";
    }    

    if (project.linkTitles != null){
        for(let i = 0; i < project.linkTitles.length; i++){
                RelevantLinks += `<a href="${project.links[i]}" target = "_blank">${project.linkTitles[i]} </a> ${i < project.linkTitles.length -1 ?`<br/>` : ``}`
            }
    }
    

    let Highlights = ``;
    Object.entries(project.highlights).forEach(([key,value]) => {
        Highlights += `<img data-src="${value.gif}" class = "gameplay-gif" alt="${key} gameplay">`;
        Highlights += `<h4>${key}</h4>`;
        Highlights += `<p1>${value.text}</p1>`;
        Highlights += `<br>`;
    });
    

    ProjectsSection.insertAdjacentHTML( 'beforeend',  `
    <div class ="project-row" style="background-image: url(images/projectSelect/${pathImage}.png); justify-content: ${projectRowPinStyle}">
        <div class = "project-node" style = "background-image: url(images/projectSelect/node${PathSide}.png);"></div>
        <div class = "project-card">
            <img src="${project.titleImage}" class = "project__title-image">
            <div class = "basic-info project-info">
                
                <div class="project__subsection">
                    <h3>Description</h3>
                    <p1>
                        ${project.description}
                    </p1>
                </div>
                <div class = "small-sections">
                    <div class="project__subsection">
                        <h3>Skills</h3>
                        <p1>${project.skills}</p1>
                    </div>
                    <div class="project__subsection">
                        <h3>Relevant Links</h3>
                        <div class ="links">
                            ${RelevantLinks}
                        </div>
                    </div>
                    
                </div>
                
            </div>
            <div class="project__subsection expandable-section hidden">
                    <h3>Highlights</h3>
                    ${Highlights}
                
                </div>
            <button class="show-more">Show More</button>                        

        </div>
    </div>`);

    let buttons = ProjectsSection.querySelectorAll(".show-more");
    let button = buttons[buttons.length - 1];
    

    let expandedSections = ProjectsSection.querySelectorAll(".expandable-section");
    let expandedSection = expandedSections[expandedSections.length -1]

    button.addEventListener("click", function() {
        if (button.innerHTML === "Show More") {
            button.innerHTML = "Show Less";
            expandedSection.classList.remove("hidden");
        } else {
            button.innerHTML = "Show More";
            expandedSection.classList.add("hidden");
        }
    });
}