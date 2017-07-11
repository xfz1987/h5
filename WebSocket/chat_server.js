var sys = require('sys');
var ws = require('websocket');
var server = ws.createServer();
server.addEventListener('connection',function(conn){//当客户端接入时
    conn.send('hi,'+conn.id);//向客户端发送消息
    conn.addEventListener('message',function(msg){//当收到客户端发来的消息时
        console.log('Recieved message :' + msg);
        server.broadcast(msg);//向所有客户端广播消息
        conn.send(msg);
    });
});
server.addEventListener('close',function(conn){
    server.broadcast('Disconnected: ' + conn.id);
});
server.listen(8000);
console.log('Hello,Server is Running:8000');
