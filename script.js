// script.js
function toggleMenu() {
    var menu = document.getElementById("mobileMenu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

function moveSlider(element) {
    var slider = document.querySelector(".nav-slider");
    var rect = element.getBoundingClientRect();
    var navRect = document.querySelector(".nav-links").getBoundingClientRect();
    slider.style.width = rect.width + "px";
    slider.style.left = rect.left - navRect.left + "px";
}


let currentTeam = null; // Track the current active team

async function fetchData(option) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/${option}`);
        const data = await response.json();
        if (option === "players") {
            displayTeams(data);
        } else {
            displayData(data);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayTeams(teams) {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    // Create scrollable container
    const scrollableContainer = document.createElement("div");
    scrollableContainer.classList.add("scrollable-container");

    // Team container (left side)
    const teamContainer = document.createElement("div");
    teamContainer.classList.add("team-container");

    // Create slider element
    const teamSlider = document.createElement("div");
    teamSlider.classList.add("team-slider");
    teamContainer.appendChild(teamSlider);

    teams.forEach(team => {
        const button = document.createElement("button");
        button.innerText = team;
        button.classList.add("team-button");
        button.onmouseover = () => {
            moveteamSlider(button, teamSlider); // Move the slider to the active team button
            fetchPlayers(team); // Display players for the hovered team
        };
        
        teamContainer.appendChild(button);
    });

    scrollableContainer.appendChild(teamContainer);

    // Player container (right side)
    let playerList = document.getElementById("playerList");
    if (!playerList) {
        playerList = document.createElement("div");
        playerList.id = "playerList";
        playerList.classList.add("player-list");
        scrollableContainer.appendChild(playerList);
    }

    contentDiv.appendChild(scrollableContainer);
}

function moveteamSlider(element, slider) {
    if (!slider) return;

    // Get the top position relative to the parent container
    const offsetTop = element.offsetTop; 

    slider.style.height = `${element.offsetHeight}px`; // Match button height
    slider.style.top = `${offsetTop}px`; // Move it exactly to the hovered button
}

async function fetchPlayers(team) {
    currentTeam = team;
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/players/${team}`);
        const players = await response.json();
        displayPlayers(players);
    } catch (error) {
        console.error("Error fetching players:", error);
    }
}

function displayPlayers(players) {
    let playerList = document.getElementById("playerList");
    if (!playerList) return;

    playerList.innerHTML = ``;
    
    players.forEach(player => {
        const p = document.createElement("p");
        p.innerText = player;
        playerList.appendChild(p);
    });
}

function hidePlayers() {
    const playerList = document.getElementById("playerList");
    if (playerList) {
        playerList.innerHTML = ""; // Clear the player list
    }
}
