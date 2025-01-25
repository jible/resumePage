
// Main function to generate the project preview
function makePreview(parent, currentproject) {
    if (currentproject.name == 'sample') {
        return;
    }

    const project = document.createElement("div");
    project.classList.add("project-item");
    parent.append(project);

    // Project title
    let title;
    if (currentproject.titleImage) {
        title = document.createElement('img');
        title.src = currentproject.titleImage;
    } else {
        title = document.createElement('h3');
        if (currentproject.titleCss) {
            title.id = currentproject.titleCss;
        }
        title.textContent = currentproject.name;
    }
    project.appendChild(title);

    // GitHub link
    const githubLink = createLinkElement("GitHub Repository", currentproject.github);
    const github = document.createElement('h3');
    github.appendChild(githubLink);
    project.appendChild(github);

    // Playable Link
    const playLink = createLinkElement("Play", currentproject.playableLink);
    const playText = document.createElement('h3');
    playText.appendChild(playLink);
    project.appendChild(playText);

    // Images
    currentproject.imgs.forEach(img => {
        const image = createImageElement(img);
        project.appendChild(image);
    });

    // Project Description
    const description = createSection("Project Description: ", currentproject.description);
    project.appendChild(description.label);
    project.appendChild(description.contentDiv);

    // My Contributions
    const contributionsLabel = document.createElement('h3');
    contributionsLabel.innerHTML = "Contributions: ";
    project.appendChild(contributionsLabel);

    const contributions = document.createElement('div');
    contributions.appendChild(createSkillList(currentproject.contribution));
    contributions.classList.add('gameDescription');
    project.appendChild(contributions);

    // Highlights
    const highlightLabel = document.createElement('h3');
    highlightLabel.innerHTML = "Highlights: ";
    project.appendChild(highlightLabel);

    const highlights = document.createElement('div');
    highlights.appendChild(createSkillList(currentproject.highlights));
    highlights.classList.add('gameDescription');
    project.appendChild(highlights);
    
    


    // Skills Demonstrated (using createBulletPointList)
    const skillsLabel = document.createElement('h3');
    skillsLabel.innerHTML = "Skills Demonstrated: ";
    project.appendChild(skillsLabel);

    const skills = document.createElement('div');
    skills.appendChild(createSkillList(currentproject.skillsDemonstrated));
    skills.classList.add('gameDescription');
    project.appendChild(skills);

}

// Fetch the JSON data
fetch('src/projectList/projects.json')
    .then((response) => response.json())
    .then((data) => {
        const projects = data.projects; // Access the projects array
        const proList = document.getElementById("project-list");

        // Generate preview for each project
        projects.forEach(project => {
            makePreview(proList, project);
        });
    })
    .catch((error) => console.error('Error loading JSON:', error));




//------------------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS



// Function to create a bullet point list from an array of items
function createBulletPointList(items) {
    const list = document.createElement('ul');
    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        list.appendChild(listItem);
    });
    return list;
}

// Function to create a link element
function createLinkElement(text, href) {
    const link = document.createElement('a');
    link.textContent = text;
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
}

// Function to create a section (h3 + content div)
function createSection(labelText, content) {
    const label = document.createElement('h3');
    label.innerHTML = labelText;

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = content;
    contentDiv.classList.add('gameDescription');

    return { label, contentDiv };
}

// Function to create an image element
function createImageElement(src) {
    const image = document.createElement('img');
    image.classList.add('responsive-image');
    image.src = src;
    return image;
}

// Function to create skill list from array of skills
function createSkillList(skills) {
    const skillsList = createBulletPointList(skills);
    return skillsList;
}
