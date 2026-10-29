const WebSocket = require('ws');
const http = require('http');
const server = http.createServer((req,res)=>{
  res.writeHead(200);
  res.end('Trump Server Running - JIO FIX 100%');
});
const wss = new WebSocket.Server({server});
const rooms = {};
wss.on('connection', (ws)=>{
  ws.on('message', (msg)=>{
    try{
      const data = JSON.parse(msg);
      const roomId = data.roomDisplay;
      if(!roomId) return;
      if(!rooms[roomId]) rooms[roomId] = {clients:[]};
      if(data.type==='join'){
        rooms[roomId].clients.push(ws);
        ws.roomId=roomId;
      }
      if(rooms[roomId]){
        rooms[roomId].clients.forEach(c=>{
          if(c.readyState===1) c.send(JSON.stringify(data));
        });
      }
    }catch(e){}
  });
  ws.on('close', ()=>{
    if(ws.roomId && rooms[ws.roomId]){
      rooms[ws.roomId].clients = rooms[ws.roomId].clients.filter(c=>c!==ws);
    }
  });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>console.log('Server running '+PORT));
