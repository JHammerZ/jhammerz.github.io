async function projectLysander() {
    const response = await fetch('./blueprint.json');
    const data = await response.json();
    const svg = document.getElementById('lysander-shadow');

    data.geometry_entities.forEach(entity => {
        let element;
        if (entity.type === 'circle') {
            element = document.createElementNS("http://w3.org", "circle");
            element.setAttribute("cx", entity.parameters.cx);
            element.setAttribute("cy", entity.parameters.cy);
            element.setAttribute("r", entity.parameters.r);
        } else if (entity.type === 'triangle') {
            element = document.createElementNS("http://w3.org", "polygon");
            const pts = entity.vertices.map(v => `${v.x},${v.y}`).join(" ");
            element.setAttribute("points", pts);
        }

        element.setAttribute("fill", "none");
        element.setAttribute("stroke", "cyan");
        element.setAttribute("stroke-width", "2");
        element.style.cursor = "pointer";
        
        svg.appendChild(element);
    });
}

projectLysander();
