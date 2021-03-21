var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term")

// Data fetcher from form handler to display repos 
var getUserRepos = function(user) {

    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";


    fetch(apiUrl).then(function(response) {

        // request successful
        if (response.ok) {
            response.json().then(function(data) {
            displayRepos(data, user);
        });
        } else {
            alert("Error: " + response.status);
        }
    })
    .catch(function(error) {
        // catch() getting chained onto the end of the then
        alert("unable to connect to github")
    });
};



//Form handler
var formSubmitHandler = function(event) {
    event.preventDefault();
    
    // get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }

};

userFormEl.addEventListener("submit", formSubmitHandler);


// display repos
var displayRepos = function(repos, searchTerm) {

    if (repos.length ===0) {
        repoContainerEl.textContent = "No Repositories found.";
        return;
    }
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop for each repo
    for (var i=0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a psan element to hold repositoryt name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to container
        repoEl.appendChild(statusEl);

        //append container to the dom
        repoContainerEl.appendChild(repoEl);

    }
};

