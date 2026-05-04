/* 
 * LYSANDER OS - TOWN SQUARE REGISTRY v1.0
 * Purpose: Visualizing the Citizen Registry
 */

const TownSquare = {
    loadRegistry: async () => {
        try {
            const response = await fetch('SOVEREIGN_FOLDER.json');
            const data = await response.json();
            console.log(`[!] LYSANDER CITY: ${data.citizens.length} Citizens Present.`);
            
            data.citizens.forEach(citizen => {
                console.log(`CITIZEN: ${citizen.citizen_name} | ROLE: ${citizen.vocation}`);
                // Logic to render 'Folded' icons on the Hub
            });
        } catch (e) {
            console.log("[WAIT] Registry Syncing...");
        }
    }
};

window.onload = TownSquare.loadRegistry;
