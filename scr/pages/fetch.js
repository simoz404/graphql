import {addLogoutButton} from "./logout.js"
import { createAuditCard } from "./auditRatio.js";
import {createXpGraph} from "./createXpProgress.js"
import {createXpCard} from "./totalXp.js"
import {createCheckpointsGraph} from "./goCheckpoints.js"
import {createWelcome} from "./welcome.js"
import {createCards} from "./createCards.js"


const graphqlEndpoint = 'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql';

export async function fetchData(query) {
    try {
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
        const audit = result.data?.user?.[0]; 

        const { auditRatio, totalUp, totalDown } = audit;
        createCards()
        addLogoutButton()
        createAuditCard(auditRatio, totalUp, totalDown)
        createXpGraph(result.data.xpProgress)
        createXpCard(result.data.xpProgress)
        createCheckpointsGraph(result.data)
        createWelcome(result.data.user)

    } catch (error) {
        localStorage.removeItem('jwt');
        location.reload();
    }
}
