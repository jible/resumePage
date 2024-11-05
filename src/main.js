function makePreview(parent,currentproject){
    if (currentproject.name == 'sample'){
        return;
    }
    const project = document.createElement("div");
    parent.classList.add("project-item")
    parent.append(project);


    // Project title
    const title = document.createElement('h3');
    title.textContent = currentproject.name;
    project.appendChild(title);

    // Project github
    const github = document.createElement('h3');
    github.textContent = "Github Repository";
    github.style = currentproject.github;
    project.appendChild(github);

   // Image loading with fixed width and dynamic height
    for (let img of currentproject.imgs) {
        const image = document.createElement('img');
        image.classList.add('responsive-image');
        image.src = img;

        // Optionally, add a CSS class for additional styling
        image.classList.add('responsive-image');

        project.appendChild(image);
    }


    

}

// Fetch the JSON data
fetch('src/projects.json').then((response) => response.json()).then((data) => {
        const projects = data.projects; // Access the projects array
        console.log(projects); // Log the projects array to verify the data

        const proList = document.getElementById("project-list");

        // Example: Access each project item
        for (let i = 0; i < projects.length; i++){
            makePreview(proList, projects[i]);
        }
    })
    .catch((error) => console.error('Error loading JSON:', error));