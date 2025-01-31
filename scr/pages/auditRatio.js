export function createAuditCard(auditRatio, totalUp, totalDown) {
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