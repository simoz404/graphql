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
                    addLogoutButton()
                    createWelcome(queries.name)
                    createCards()
                    auditRatio(queries.auditRatio);
                    createGraphProgress(queries.xpProgress)
                }
            } else {
                alert(data.error);
            }
        // form.reset();
    });
}

if (localStorage.getItem('jwt')) {
    addLogoutButton()
    createWelcome(queries.name)
    // totalXP(queries.totalXp)
    createCards()
    auditRatio(queries.auditRatio);
    createGraphProgress(queries.xpProgress)

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
            'Content-Type': 'application/json', // Important for JSON body
        },
        body: JSON.stringify({ query }) // Use 'query' as the key
    });

    const data = await response.json();
    const { firstName, lastName } = data.data.user[0]; // Extract directly
        const h1 = document.createElement('h1')
        h1.className = 'welcome'
        h1.textContent = `Welcome, ${firstName} ${lastName}!`
        document.body.appendChild(h1)
}

// async function totalXP(query) {
//     const jwt = localStorage.getItem('jwt');
//     if (!jwt) {
//         throw new Error('No JWT token found');
//     }

//     const response = await fetch(graphqlEndpoint, {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${jwt}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ query })
//     });

//     const data = await response.json();

//     const transactions = data.data.transaction;

//     const totalXp = transactions
//       .reduce((sum, transaction) => sum + transaction.amount, 0);

//     console.log('Total XP:', totalXp);

    
// }


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


    
    if (!container) {
        console.error("No card found to insert audit ratio!");
        return;
    }

    const auditCard = document.createElement("div");
    auditCard.className = "audit-ratio";
    const h1 = document.createElement('h1')
    h1.textContent = auditRatio.toFixed(1)
    auditCard.appendChild(h1)
    

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
    
    createGraphCard(result)
}

function createGraphCard(xp) {    
    const container = document.querySelector(".item.item-2");
    if (!container) {
        console.error("No card found to insert audit ratio!");
        return;
    }

    // Create the SVG element
    const svg = document.createElement("svg");
    svg.id = "chart";
    svg.style.width = "800px";  // Set width with units
    svg.style.height = "400px";  // Set height with units
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    // Log xp data to ensure it's correct
    console.log(xp.data.transaction);

    // Prepare the transaction data
    xp.data.transaction.forEach(d => {
        d.date = new Date(d.createdAt);  // Convert createdAt to Date
    });

    // Sort the transactions by date
    xp.data.transaction.sort((a, b) => a.date - b.date);

    // Calculate cumulative sum
    let cumulativeSum = 0;
    const dataPoints = xp.data.transaction.map(d => {
        cumulativeSum += d.amount;
        return { date: d.date, cumulativeAmount: cumulativeSum };
    });

    // Check dataPoints for correctness
    console.log(dataPoints);

    // SVG dimensions and margins
    const width = 800;
    const height = 400;
    const margin = 50;
    
    const maxAmount = Math.max(...dataPoints.map(d => d.cumulativeAmount));
    const minDate = dataPoints[0].date;
    const maxDate = dataPoints[dataPoints.length - 1].date;

    // Scaling functions for X and Y axes
    const xScale = (date) => ((date - minDate) / (maxDate - minDate)) * (width - 2 * margin) + margin;
    const yScale = (amount) => height - margin - (amount / maxAmount) * (height - 2 * margin);

    // Create path data for the line chart
    let pathData = "";
    dataPoints.forEach((d, i) => {
        const x = xScale(d.date);
        const y = yScale(d.cumulativeAmount);
        pathData += (i === 0 ? "M" : "L") + x + "," + y + " ";
    });

    // Create the line path
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "line");
    path.setAttribute("d", pathData);
    path.setAttribute("stroke", "steelblue");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);

    // Add X-axis labels (dates)
    dataPoints.forEach(d => {
        const x = xScale(d.date);
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", height - margin + 20);  // Position text below axis
        text.setAttribute("class", "axis-label");
        text.setAttribute("text-anchor", "middle");
        text.textContent = d.date.toISOString().slice(0, 10);  // Format as YYYY-MM-DD
        svg.appendChild(text);
    });

    // Add Y-axis labels
    const yTicks = [0, maxAmount / 4, maxAmount / 2, (3 * maxAmount) / 4, maxAmount];
    yTicks.forEach((tick) => {
        const y = yScale(tick);
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", margin - 10);
        text.setAttribute("y", y);
        text.setAttribute("class", "axis-label");
        text.setAttribute("text-anchor", "end");
        text.textContent = tick;
        svg.appendChild(text);
    });

    // Create Y-axis line
    
    const yAxisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxisLine.setAttribute("x1", margin);
    yAxisLine.setAttribute("y1", margin);
    yAxisLine.setAttribute("x2", margin);
    yAxisLine.setAttribute("y2", height - margin);
    yAxisLine.setAttribute("stroke", "black");
    svg.appendChild(yAxisLine);

    // Create X-axis line
    const xAxisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxisLine.setAttribute("x1", margin);
    xAxisLine.setAttribute("y1", height - margin);
    xAxisLine.setAttribute("x2", width - margin);
    xAxisLine.setAttribute("y2", height - margin);
    xAxisLine.setAttribute("stroke", "black");
    svg.appendChild(xAxisLine);

    // Append the SVG to the container
    container.appendChild(svg);
}
