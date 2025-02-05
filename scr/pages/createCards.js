export function createCards() {
    const cn = document.querySelectorAll(".container")
    if (cn) {
    const container = document.createElement("div");
    container.className = "container";
    const h1 = document.createElement('h1')
    h1.className = "welcome"
    let n = 1
    document.body.appendChild(h1)
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
}