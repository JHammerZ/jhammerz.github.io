const http = require('http');
const fs = require('fs');
const kv = new Map();

const CORS = {
  'Access-Control-Allow-Origin': 'https://jhammerz.github.io',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

http.createServer((req,res)=>{
  const url = new URL(req.url, 'http://127.0.0.1:8787');
  Object.entries(CORS).forEach(([k,v])=>res.setHeader(k,v));
  if(req.method==='OPTIONS'){res.writeHead(200);return res.end();}
  
  if(url.pathname==='/'){
    res.writeHead(200,{'Content-Type':'text/plain'});
    return res.end('Lysander KV-GZIP v95ac07b2 online - Termux native');
  }
  if(url.pathname==='/decompress'){
    const key=url.searchParams.get('key')||'w4final';
    const data=kv.get(key)||{name:'lysander-node',w4:'root_absolute',time:new Date().toISOString()};
    res.writeHead(200,{'Content-Type':'application/json'});
    return res.end(JSON.stringify(data));
  }
  if(url.pathname==='/compress' && req.method==='PUT'){
    let body='';
    req.on('data',c=>body+=c);
    req.on('end',()=>{
      const key=url.searchParams.get('key')||'gh_test';
      try{kv.set(key,JSON.parse(body));}catch{kv.set(key,{raw:body});}
      res.writeHead(200);res.end(`GZIP stored to KV key: ${key}`);
    });
    return;
  }
  // serve static files from src if they exist
  res.writeHead(200,{'Content-Type':'text/plain'});
  res.end('OK '+url.pathname);
}).listen(8787,'127.0.0.1',()=>console.log('Listening on 127.0.0.1:8787 - Termux native, no workerd'));
