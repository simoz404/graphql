export function createXpCard(transactions) {
        const totalXp = transactions
          .reduce((sum, transaction) => sum + transaction.amount, 0);
          const names = transactions
          .map(transaction => transaction.object?.name) 
          .filter(name => name) 
          .slice(-4);

    const container = document.querySelector(".item.item-4");
    container.innerHTML = `
      <h2 class="card-title">Total XP</h2>
      <div class="xp-card">
        <div class="xp-amount">${totalXp}B</div>
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