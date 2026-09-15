async function loadMeshTraffic(){
  try{
    const r = await fetch('/.hfid/indexing/traffic-summary.json');
    const d = await r.json();
    const el = document.getElementById('mesh-traffic-data');
    if(!el) return;
    let html = `<div style="margin-bottom:8px">TOTAL LOAD: <b style="color:#00FF41">${d.total_hits.toLocaleString()}</b> human hits</div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px">`;
    for(let [k,v] of Object.entries(d.platform_distribution)){
      let pct = ((v/d.total_hits)*100).toFixed(1);
      html += `<div style="border:1px solid #1e293b;padding:8px;border-radius:8px;background:rgba(16,24,32,0.5)">
        <div style="font-size:11px;opacity:0.7">${k.toUpperCase()}</div>
        <div style="font-weight:700">${v.toLocaleString()} <span style="opacity:0.6;font-size:11px">${pct}%</span></div>
        <div style="height:4px;background:#111;margin-top:6px;border-radius:2px"><div style="height:4px;background:#00FF41;width:${pct}%;border-radius:2px"></div></div>
      </div>`;
    }
    html += `</div>`;
    el.innerHTML = html;
  }catch(e){
    const el=document.getElementById('mesh-traffic-data');
    if(el) el.innerHTML='Mesh telemetry offline';
  }
}
document.addEventListener('DOMContentLoaded', loadMeshTraffic);
