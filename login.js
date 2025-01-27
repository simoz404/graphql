const endpoint = "https://learn.zone01oujda.ma/api/auth/signin";

function createLoginForm() {
    // Create card container
    const card = document.createElement("div");
    card.className = "card";
  
    // Create title
    const title = document.createElement("h4");
    title.className = "title";
    title.textContent = "Log In!";
    card.appendChild(title);

    // Create form
    const form = document.createElement("form");
  
    // Create first field (username)
    const field1 = document.createElement("div");
    field1.className = "field";
  
    const input1 = document.createElement("input");
    input1.id = "username";
    input1.name = "logemail";
    input1.placeholder = "Email or Username";
    input1.className = "input-field";
    input1.setAttribute("autocomplete", "off");
    input1.required = true;
    field1.appendChild(input1);
  
    form.appendChild(field1);
  
    // Create second field (password)
    const field2 = document.createElement("div");
    field2.className = "field";

  
    const input2 = document.createElement("input");
    input2.id = "password";
    input2.name = "logpass";
    input2.placeholder = "Password";
    input2.className = "input-field";
    input2.setAttribute("type", "password");
    input2.setAttribute("autocomplete", "off");
    input2.required = true;
    field2.appendChild(input2);
  
    form.appendChild(field2);
  
    // Create submit button
    const button = document.createElement("button");
    button.className = "btn";
    button.type = "submit";
    button.textContent = "Login";
    form.appendChild(button);
  
    card.appendChild(form);
  
    // Append the card to the body
    document.body.appendChild(card);
    login(form)
}

function login(form) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); 
    
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        
        const encodedCredentials = btoa(`${username}:${password}`);


            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${encodedCredentials}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("jwt", data)
                console.log(data);
                
                return data
            } else {
                alert(data.error);
            }
        // Reset the form only after handling
        // form.reset();
    });
}

createLoginForm();
  
// GraphQL client setup
const graphqlEndpoint = 'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql';

async function queryGraphQL(query) {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        throw new Error('No JWT token found');
    }

    const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
    });

    const data = await response.json();
    if (data.errors) {
        throw new Error(data.errors[0].message);
    }
    return data.data;
}

// Sample queries
const queries = {
    basicInfo: `{
        user {
            id
            login
            attrs
        }
    }`,
    xpProgress: `{
        transaction(where: {type: {_eq: "xp"}}, order_by: {createdAt: asc}) {
            amount
            createdAt
            path
        }
    }`,
    projectResults: `{
        progress(order_by: {createdAt: asc}) {
            grade
            createdAt
            object {
                name
                type
            }
        }
    }`
};

// Create profile page structure
function createProfilePage() {
    const container = document.createElement('div');
    container.className = 'profile-container';

    // Create sections
    const basicInfoSection = document.createElement('section');
    const statsSection = document.createElement('section');
    const graphsSection = document.createElement('section');

    // Add titles
    basicInfoSection.innerHTML = '<h2>Basic Information</h2>';
    statsSection.innerHTML = '<h2>Statistics</h2>';
    graphsSection.innerHTML = '<h2>Progress Graphs</h2>';

    // Add to container
    container.appendChild(basicInfoSection);
    container.appendChild(statsSection);
    container.appendChild(graphsSection);

    // Replace login form with profile page
    document.body.innerHTML = '';
    document.body.appendChild(container);

    // Load data
    loadProfileData(basicInfoSection, statsSection, graphsSection);
}

// Load and display profile data
async function loadProfileData(basicInfoSection, statsSection, graphsSection) {
    try {
        // Fetch basic info
        const basicInfo = await queryGraphQL(queries.basicInfo);
        const xpData = await queryGraphQL(queries.xpProgress);
        const projectData = await queryGraphQL(queries.projectResults);

        // Display basic info
        displayBasicInfo(basicInfoSection, basicInfo.user[0]);
        
        // Display statistics
        displayStats(statsSection, xpData, projectData);
        
        // Create graphs
        createGraphs(graphsSection, xpData, projectData);

    } catch (error) {
        console.error('Error loading profile data:', error);
        alert('Error loading profile data. Please try logging in again.');
    }
}

// Helper function to display basic info
function displayBasicInfo(section, user) {
    section.innerHTML += `
        <div class="info-card">
            <p><strong>Login:</strong> ${user.login}</p>
            <p><strong>ID:</strong> ${user.id}</p>
        </div>
    `;
}

// Helper function to display statistics
function displayStats(section, xpData, projectData) {
    const totalXP = xpData.transaction.reduce((sum, t) => sum + t.amount, 0);
    const projectCount = projectData.progress.length;
    const passedProjects = projectData.progress.filter(p => p.grade > 0).length;

    section.innerHTML += `
        <div class="stats-card">
            <p><strong>Total XP:</strong> ${totalXP}</p>
            <p><strong>Projects Completed:</strong> ${projectCount}</p>
            <p><strong>Success Rate:</strong> ${((passedProjects / projectCount) * 100).toFixed(1)}%</p>
        </div>
    `;
}

// Add logout button
function addLogoutButton() {
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.className = 'logout-btn';
    logoutBtn.onclick = () => {
        localStorage.removeItem('jwt');
        location.reload();
    };
    document.body.appendChild(logoutBtn);
}

// Initialize profile page
if (localStorage.getItem('jwt')) {
    createProfilePage();
    addLogoutButton();
}