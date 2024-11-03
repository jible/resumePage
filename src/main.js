// Fetch the JSON data
fetch('src/projects.json') // Adjust the path if needed
    .then((response) => response.json())  // Parse the JSON from the response
    .then((data) => {
        const projects = data.projects; // Access the projects array
        console.log(projects); // Log the projects array to verify the data

        const proList = document.getElementById("project-list");

        // Example: Access each project item
        for (let i = 0; i < projects.length; i++){
            const project = document.createElement("div");
            proList.append(project);


            // Project title
            const title = document.createElement('h3');
            title.textContent = projects[i].name;
            project.appendChild(title);

            // Project media
            projects[i].title;
        }
    })
    .catch((error) => console.error('Error loading JSON:', error));


/*
Games!

https://emiree-draws.itch.io/tail-of-two-tides


*/
