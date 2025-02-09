// script.js
const nbaTeams = {
    "ATL": { fullName: "Atlanta Hawks", color: "#E03A3E" },
    "BOS": { fullName: "Boston Celtics", color: "#007A33" },
    "BRK": { fullName: "Brooklyn Nets", color: "#000000" },
    "CHO": { fullName: "Charlotte Hornets", color: "#1D1160" },
    "CHI": { fullName: "Chicago Bulls", color: "#CE1141" },
    "CLE": { fullName: "Cleveland Cavaliers", color: "#860038" },
    "DAL": { fullName: "Dallas Mavericks", color: "#00538C" },
    "DEN": { fullName: "Denver Nuggets", color: "#0E2240" },
    "DET": { fullName: "Detroit Pistons", color: "#C8102E" },
    "GSW": { fullName: "Golden State Warriors", color: "#1D428A" },
    "HOU": { fullName: "Houston Rockets", color: "#CE1141" },
    "IND": { fullName: "Indiana Pacers", color: "#002D62" },
    "LAC": { fullName: "Los Angeles Clippers", color: "#C8102E" },
    "LAL": { fullName: "Los Angeles Lakers", color: "#552583" },
    "MEM": { fullName: "Memphis Grizzlies", color: "#5D76A9" },
    "MIA": { fullName: "Miami Heat", color: "#98002E" },
    "MIL": { fullName: "Milwaukee Bucks", color: "#00471B" },
    "MIN": { fullName: "Minnesota Timberwolves", color: "#0C2340" },
    "NOP": { fullName: "New Orleans Pelicans", color: "#85714D" },
    "NYK": { fullName: "New York Knicks", color: "#F58426" },
    "OKC": { fullName: "Oklahoma City Thunder", color: "#007AC1" },
    "ORL": { fullName: "Orlando Magic", color: "#0077C0" },
    "PHI": { fullName: "Philadelphia 76ers", color: "#006BB6" },
    "PHO": { fullName: "Phoenix Suns", color: "#1D1160" },
    "POR": { fullName: "Portland Trail Blazers", color: "#E03A3E" },
    "SAC": { fullName: "Sacramento Kings", color: "#5A2D81" },
    "SAS": { fullName: "San Antonio Spurs", color: "#C4CED4" },
    "TOR": { fullName: "Toronto Raptors", color: "#CE1141" },
    "UTA": { fullName: "Utah Jazz", color: "#002B5C" },
    "WAS": { fullName: "Washington Wizards", color: "#E31837" }
};


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
let teamColor = "#1E40AF";
async function fetchData(option) {
    try {
        
        const response = await fetch(`http://127.0.0.1:5000/api/${option}`);
        const data = await response.json();
        if (option === "players") {
            displayTeams(data);
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
        button.dataset.shortName = team; // Store short name

        button.onmouseover = () => {
            moveteamSlider(button, teamSlider);
            fetchPlayers(team);
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

    // Reset styles for all team buttons (except current team)
    document.querySelectorAll(".team-button").forEach(btn => {
        if (btn.innerText !== currentTeam) {
            btn.style.backgroundColor = "";
            btn.style.color = "";
            btn.innerText = btn.dataset.shortName; // Restore short name
        }
    });

    // Get top position relative to parent
    const offsetTop = element.offsetTop;
    
    slider.style.height = `${element.offsetHeight}px`; // Match button height
    slider.style.top = `${offsetTop}px`; // Move to hovered button
}


async function fetchPlayers(team) {
    currentTeam = team; // Update current team

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/players/${team}`);
        const players = await response.json();
        displayPlayers(players);

        document.querySelectorAll(".team-button").forEach(btn => {
            if (btn.innerText === currentTeam) {
                teamColor = nbaTeams[team]?.color || "grey"; // Default to white if not found
                
                // Apply neon glow effect
                btn.style.backgroundColor = teamColor;
                
                btn.style.color = "white";
                btn.style.textShadow = `0 0 5px ${teamColor}, 0 0 10px ${teamColor}, 0 0 15px ${teamColor}`;
                btn.innerText = nbaTeams[team]?.fullName || team; // Update to full name

                btn.classList.add("neon-text"); // Add CSS glow
            } else {
                btn.style.backgroundColor = "";
                btn.style.color = "";
                btn.style.textShadow = ""; // Remove glow effect
                btn.innerText = btn.dataset.shortName; // Restore short name
                btn.classList.remove("neon-text"); // Remove CSS glow
            }
        });

    } catch (error) {
        console.error("Error fetching players:", error);
    }
}
async function showPlayerStats(player) {
    try {
        // Fetch player stats from the API (assuming it's returned in JSON format)
        const response = await fetch(`http://127.0.0.1:5000/api/stats/${player}`);
        const playerStats = await response.json(); // Parse JSON data

        // Switch to the "Stats" panel
        document.querySelector(".nav-links a[href='#stats']").click(); // Simulate clicking Stats tab

        // Display the player’s stats in a formatted HTML table
        displayStats(player, playerStats);
        displayPlayerDashboard(player, playerStats);
       
        
    } catch (error) {
        console.error("Error fetching player stats:", error);
    }
}
function displayPlayers(players) {
    let playerList = document.getElementById("playerList");
    if (!playerList) return;

    playerList.innerHTML = ``;

    players.forEach(player => {
        const p = document.createElement("p");
        p.innerText = player;
        p.classList.add("player-name"); // Add a class for styling
        p.onclick = () => showPlayerStats(player); // Handle click event
        p.onmouseover = () => {
            p.style.backgroundColor = teamColor; // Team color on hover
            p.style.color = "white"; // White text on hover
        };
        p.onmouseout = () => {
            p.style.backgroundColor = ""; // Reset background color
            p.style.color = "#00ff00"; // Reset text color to neon green
        };
        playerList.appendChild(p);
    });
}

function displayStats(player, stats) {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = ` ${player}`; // Add player name header
    console.log(Object.keys(stats))
    
}
function displayPlayerDashboard(player, stats) {
    const contentDiv = document.getElementById("content");
    
    contentDiv.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-container ">
            <div class="stat-row">
                <span class="stat-label">Player</span>
                <span class="stat-value">${stats.Player[0] || 'N/A'}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Team</span>
                <span class="stat-value">${stats.Team[0] || 'N/A'}</span>
            </div>
            <div class="stat-row">
            <span class="stat-label">Position</span>
            <span class="stat-value">${stats.Pos[0] || 'N/A'}</span>
            </div>
            <div class="stat-row">
            <span class="stat-label">Age</span>
            <span class="stat-value">${stats.Age[0] || 'N/A'}</span>
            </div>
            <div class="stat-row">
            <span class="stat-label">Awards</span>
            <span class="stat-value">${stats.Awards[0] || 'N/A'}</span>
            </div>
            <div class="stat-row">
            <span class="stat-label">Games Played</span>
            <span class="stat-value">${stats.G[0] || 'N/A'}</span>
            </div>
            </div>

            <div class="dashboard-container">
                <div class="stat-row">
                    <span class="stat-label">Minutes Played</span>
                    <span class="stat-value">${stats.MP[0] || 'N/A'}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Points Per Game</span>
                    <span class="stat-value">${stats.PTS[0] || 'N/A'}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Rebounds Per Game</span>
                    <span class="stat-value">${stats.TRB[0] || 'N/A'}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Assists Per Game</span>
                    <span class="stat-value">${stats.AST[0] || 'N/A'}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Steals Per Game</span>
                    <span class="stat-value">${stats.STL[0] || 'N/A'}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Blocks Per Game</span>
                    <span class="stat-value">${stats.BLK[0] || 'N/A'}</span>
                </div>
            </div>
        </div>
    `;
   
    

}
function hidePlayers() {
    const playerList = document.getElementById("playerList");
    if (playerList) {
        playerList.innerHTML = ""; // Clear the player list
    }
}
