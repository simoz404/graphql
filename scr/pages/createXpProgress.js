export function createXpGraph(xp) {    
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
    const data = xp.map(d => ({
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