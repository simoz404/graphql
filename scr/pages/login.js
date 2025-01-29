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
    totalXP(queries.totalXp)
    createCards()
    auditRatio(queries.auditRatio);
} else {
    createLoginForm();

}

function createCards() {
    const container = document.createElement("div");
    container.className = "container";
    for (let i = 0; i < 4; i++) {
        const card = document.createElement("div");
        card.className = "item"; // Using "card" instead of "item" to match your CSS
        container.appendChild(card);
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
      .filter((transaction) => transaction.type === 'level')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    console.log('Total XP:', totalXp);

    
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
    const container = document.querySelector(".item");
    if (!container) {
        console.error("No card found to insert audit ratio!");
        return;
    }

    const auditCard = document.createElement("div");
    auditCard.className = "audit-ratio";
    const h1 = document.createElement('h1')
    h1.textContent = auditRatio
    auditCard.appendChild(h1)
    

    container.appendChild(auditCard);
}

