import {addLogoutButton} from './logout.js'
import {queries} from '../graphql/queries.js'

const graphqlEndpoint = 'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql';
const endpoint = "https://learn.zone01oujda.ma/api/auth/signin";

var cardLogin;
function createLoginForm() {
    const card = document.createElement("div");
    card.className = "card";
  
    const title = document.createElement("h4");
    title.className = "title";
    title.textContent = "Log In!";
    card.appendChild(title);

    const form = document.createElement("form");
  
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
  
    const button = document.createElement("button");
    button.className = "btn";
    button.type = "submit";
    button.textContent = "Login";
    form.appendChild(button);
  
    card.appendChild(form);
  
    document.body.appendChild(card);
    cardLogin = card
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
                if (cardLogin) {
                    cardLogin.remove()
                    createWelcome(queries.name)
                    addLogoutButton()
                    createCards()
                    auditRatio(queries.auditRatio);
                    createGraphProgress(queries.xpProgress)
    goCheckpointsGraph(queries.goCheckpoint)

                }
            } else {
                alert(data.error);
            }
        // form.reset();
    });
}

if (localStorage.getItem('jwt')) {
    createWelcome(queries.name)
    addLogoutButton()
    createCards()
    auditRatio(queries.auditRatio);
    createGraphProgress(queries.xpProgress)
    goCheckpointsGraph(queries.goCheckpoint)
} else {
    createLoginForm();

}

function createCards() {
    const container = document.createElement("div");
    container.className = "container";
    let n = 1
    for (let i = 0; i < 4; i++) {
        const card = document.createElement("div");
        card.className = `item item-${n}`;
                const title = document.createElement("h2");
        title.className = "card-title";
        title.textContent = n === 1 ? "Audit Ratio" : 
                          n === 2 ? "Progress Chart" : 
                          n === 3 ? "Go Checkpoint" : 
                          "Total Xp";
        card.appendChild(title);
        
        container.appendChild(card);
        n++
    }
    document.body.appendChild(container);
}



async function createWelcome(query) {
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
    const { firstName, lastName } = data.data.user[0];
        const h1 = document.createElement('h1')
        h1.className = 'welcome'
        h1.textContent = `Welcome, ${firstName} ${lastName}!`
        document.body.appendChild(h1)
}


async function auditRatio(query) {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        throw new Error('No JWT token found');
    }

    const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    });

    const result = await response.json();
    const data = result.data?.user?.[0]; 

    const { auditRatio, totalUp, totalDown } = data;

    createAuditCard(auditRatio, totalUp, totalDown);
}



function createAuditCard(auditRatio, totalUp, totalDown) {
    const container = document.querySelector(".item.item-1");
    if (!container) return;

    const auditCard = document.createElement("div");
    auditCard.className = "audit-ratio";
    
    const ratioBox = document.createElement("div");
    ratioBox.className = "ratio-box";
    
    const h1 = document.createElement('h1');
    h1.textContent = auditRatio.toFixed(1);
    h1.className = 'auditnum'
    const stats = document.createElement("div");
    stats.className = "audit-stats";
    
    const upStat = document.createElement("div");
    upStat.className = "stat up";
    upStat.innerHTML = `<span class="arrow">▲</span> ${totalUp}`;
    
    const downStat = document.createElement("div");
    downStat.className = "stat down";
    downStat.innerHTML = `<span class="arrow">▼</span> ${totalDown}`;
    
    stats.appendChild(upStat);
    stats.appendChild(downStat);
    ratioBox.appendChild(h1);
    auditCard.appendChild(ratioBox);
    auditCard.appendChild(stats);
    container.appendChild(auditCard);
}

async function createGraphProgress(query) {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        throw new Error('No JWT token found');
    }

    const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    });
    const result = await response.json();
    console.log(result);
    
    createSampleGraph(result)
    totalXP(query)
}

function createSampleGraph(xp) {
    const container = document.querySelector(".item.item-2");
    if (!container) {
        console.error("Container not found!");
        return;
    }
    container.innerHTML = '';
    const h2 = document.createElement('h2')
    h2.className = 'card-title'
    h2.textContent = "Progress Chart"
    container.appendChild(h2)
    // Create SVG with correct namespace
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "-20 0 800 400");
    svg.style.width = "100%";
    svg.style.height = "auto";
    svg.setAttribute("id", "chart");

    // Process data
    const data = xp.data.transaction.map(d => ({
        date: new Date(d.createdAt),
        amount: d.amount,
        name: d.object.name
    }));

    // Calculate cumulative amounts
    let sum = 0;
    const dataPoints = data.map(d => {
        sum += d.amount;
        return { date: d.date, total: sum, name: d.name };
    });

    // Set dimensions
    const width = 800;
    const height = 400;
    const margin = 50;

    // Calculate scales
    const maxY = Math.max(...dataPoints.map(d => d.total));
    const minDate = dataPoints[0].date;
    const maxDate = dataPoints[dataPoints.length - 1].date;

    // Create line path
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let pathData = "";
    dataPoints.forEach((d, i) => {
        const x = margin + (d.date - minDate) * (width - 2 * margin) / (maxDate - minDate);
        const y = height - margin - (d.total / maxY) * (height - 2 * margin);
        pathData += (i === 0 ? "M" : "L") + x + "," + y;
    });
    path.setAttribute("d", pathData);
    path.setAttribute("stroke", "black");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);

    // Tooltip
    const tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.background = "rgba(0,0,0,0.7)";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "5px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.visibility = "hidden";
    tooltip.style.fontSize = "12px";
    tooltip.style.pointerEvents = "none";
    document.body.appendChild(tooltip);

    // Add data points as circles with hover
    dataPoints.forEach(d => {
        const x = margin + (d.date - minDate) * (width - 2 * margin) / (maxDate - minDate);
        const y = height - margin - (d.total / maxY) * (height - 2 * margin);

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", "5");
        circle.setAttribute("fill", "red");
        circle.style.cursor = "pointer";

        circle.addEventListener("mouseover", (event) => {
            tooltip.innerHTML = `${d.name}<br>${d.date.toISOString().slice(0, 10)}`

            tooltip.style.visibility = "visible";
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY - 10}px`;
        });

        circle.addEventListener("mousemove", (event) => {
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY - 10}px`;
        });

        circle.addEventListener("mouseout", () => {
            tooltip.style.visibility = "hidden";
        });

        svg.appendChild(circle);
    });

    // Create axes
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", margin);
    xAxis.setAttribute("y1", height - margin);
    xAxis.setAttribute("x2", width - margin);
    xAxis.setAttribute("y2", height - margin);
    xAxis.setAttribute("stroke", "black");
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", margin);
    yAxis.setAttribute("y1", margin);
    yAxis.setAttribute("x2", margin);
    yAxis.setAttribute("y2", height - margin);
    yAxis.setAttribute("stroke", "black");
    svg.appendChild(yAxis);

    // Add Y-axis labels
    [0, maxY/4, maxY/2, 3*maxY/4, maxY].forEach(value => {
        const y = height - margin - (value / maxY) * (height - 2 * margin);
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", margin - 10);
        text.setAttribute("y", y);
        text.setAttribute("text-anchor", "end");
        text.setAttribute("class", "axis-label");
        text.textContent = Math.round(value);
        svg.appendChild(text);
    });

    container.appendChild(svg);
}

async function totalXP(query) {
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
        const transactions = data.data.transaction;
        const totalXp = transactions
          .reduce((sum, transaction) => sum + transaction.amount, 0);
          const names = transactions
          .map(transaction => transaction.object?.name) // Extract names (or undefined if missing)
          .filter(name => name) // Remove undefined values
          .slice(-4); // Get the last two names
      console.log(names);
      
        
        createXpCard(totalXp, names)
        
    }

function createXpCard(totalxp, names) {
  const container = document.querySelector(".item.item-4");
  container.innerHTML = `
    <h2 class="card-title">Total XP</h2>
    <div class="xp-card">
      <div class="xp-amount">${totalxp}B</div>
      <h3 class="projects-title">Recent Projects</h3>
      <ul class="projects-list"></ul>
    </div>
  `;

  const projectsList = container.querySelector('.projects-list');
  names.slice(0, 4).forEach(name => {
    const li = document.createElement('li');
    li.className = 'project-item';
    li.innerHTML = `
      <span>${name.replace(/-/g, ' ')}</span>
    `;
    projectsList.appendChild(li);
  });
}

goCheckpointsGraph(queries)
    async function goCheckpointsGraph(query) {
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
        const result = await response.json();
        createGraph(result.data)
    }

    function createGraph(data) {
        const container = document.querySelector(".item.item-3");
        container.innerHTML = `
          <h2 class="card-title">Piscine Go Checkpoints</h2>
          <div class="checkpoints-container"></div>
        `;
      
        const checkpointsContainer = container.querySelector('.checkpoints-container');
        const checkpoints = ["checkpoint01", "checkpoint02", "checkpoint03", "finalCheckpoint"];
        const counts = checkpoints.map(key => data[key]?.length || 0);
        const maxCount = Math.max(...counts, 10);
        const labels = ["Ch1", "Ch2", "Ch3", "Final"];
        
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 400 200");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.innerHTML = `
          <style>
            .checkpoint-bar:hover { opacity: 0.9; }
            .checkpoint-value { font-size: 14px; }
          </style>
        `;
      
        counts.forEach((count, index) => {
          const barHeight = (count / maxCount) * 120;
          const x = index * 90 + 30;
          const y = 160 - barHeight;
      
          const barGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
          barGroup.innerHTML = `
            <rect class="checkpoint-bar" 
                  x="${x}" 
                  y="${y}" 
                  width="50" 
                  height="${barHeight}" 
                  rx="6" 
                  fill="url(#barGradient)"/>
            <text class="checkpoint-label" 
                  x="${x + 25}" 
                  y="180" 
                  text-anchor="middle">${labels[index]}</text>
            <text class="checkpoint-value" 
                  x="${x + 25}" 
                  y="${y - 10}" 
                  text-anchor="middle">${count}</text>
          `;
      
          // Add hover effect
          barGroup.addEventListener('mouseover', () => {
            barGroup.querySelector('rect').setAttribute('fill', '#818cf8');
          });
          barGroup.addEventListener('mouseout', () => {
            barGroup.querySelector('rect').setAttribute('fill', 'url(#barGradient)');
          });
      
          svg.appendChild(barGroup);
        });
      
        // Add gradient definition
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.innerHTML = `
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#6366f1"/>
            <stop offset="100%" stop-color="#3b82f6"/>
          </linearGradient>
        `;
        svg.insertBefore(defs, svg.firstChild);
      
        checkpointsContainer.appendChild(svg);
      }