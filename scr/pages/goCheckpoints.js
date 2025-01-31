export function createCheckpointsGraph(data) {
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