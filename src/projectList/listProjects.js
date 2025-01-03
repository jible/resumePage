



function makePreview(parent,currentproject){
    if (currentproject.name == 'sample'){
        return;
    }
    const project = document.createElement("div");
    project.classList.add("project-item")
    parent.append(project);


    // Project title
    const title = document.createElement('h3');
    title.textContent = currentproject.name;
    project.appendChild(title);

   // Project GitHub link
    const github = document.createElement('h3');
    const githubLink = document.createElement('a');
    githubLink.textContent = "GitHub Repository";
    githubLink.href = currentproject.github; // Use the GitHub URL
    githubLink.target = "_blank"; // Open in new tab
    githubLink.rel = "noopener noreferrer"; // Security best practice
    github.appendChild(githubLink);
    project.appendChild(github);

    // Playable Link
    const playText = document.createElement('h3');
    const playLink = document.createElement('a');
    playLink.textContent = "Play";
    playLink.href = currentproject.playableLink; // Use the GitHub URL
    playLink.target = "_blank"; // Open in new tab
    playLink.rel = "noopener noreferrer"; // Security best practice
    playText.appendChild(playLink);
    project.appendChild(playText);

   // Image loading with fixed width and dynamic height
    for (let img of currentproject.imgs) {
        const image = document.createElement('img');
        image.classList.add('responsive-image');
        image.src = img;

        // Optionally, add a CSS class for additional styling
        image.classList.add('responsive-image');

        project.appendChild(image);
    }

    // description 
    const descriptionLabel = document.createElement('h3')
    descriptionLabel.innerHTML = "Project Description: "
    const description = document.createElement('div')
    description.innerHTML = currentproject.description;
    description.classList.add('gameDescription')


    project.appendChild(descriptionLabel)
    project.appendChild(description)
    

}
// Fetch the JSON data
fetch('src/projectList/projects.json').then((response) => response.json()).then((data) => {
        const projects = data.projects; // Access the projects array
        console.log(projects); // Log the projects array to verify the data

        const proList = document.getElementById("project-list");

        // Example: Access each project item
        for (let i = 0; i < projects.length; i++){
            makePreview(proList, projects[i]);
        }
    })
    .catch((error) => console.error('Error loading JSON:', error));