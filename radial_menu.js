/* 
 * LYSANDER OS - RADIAL COMMAND MENU v1.0
 * Purpose: Manual Kernel Interaction within the Shell
 * Architect: jhammerz
 */

const RadialMenu = {
    timer: null,
    
    show: (x, y) => {
        console.log("[!] KERNEL INTERRUPT: Opening Radial Command...");
        const menu = document.createElement('div');
        menu.id = "os-radial-menu";
        menu.style = `position:fixed; left:${x}px; top:${y}px; transform:translate(-50%, -50%); 
                      width:200px; height:200px; border:2px dashed gold; border-radius:50%; 
                      background:rgba(0,0,0,0.8); z-index:9999; display:flex; 
                      align-items:center; justify-content:center; color:gold; font-size:10px;`;
        menu.innerHTML = "SYSTEM_MENU<br>[RELEASE TO CLOSE]";
        
        // Add a "Force Reboot" trigger
        menu.onmouseup = () => {
            alert("INITIATING REMOTE REBOOT SIGNAL...");
            menu.remove();
        };
        
        document.body.appendChild(menu);
    },

    bind: () => {
        const iris = document.getElementById('iris');
        if (!iris) return;

        iris.onmousedown = (e) => {
            RadialMenu.timer = setTimeout(() => RadialMenu.show(e.clientX, e.clientY), 800);
        };

        iris.onmouseup = () => clearTimeout(RadialMenu.timer);
    }
};

// Initialize after the Shell renders the first frame
setTimeout(RadialMenu.bind, 6000); 
