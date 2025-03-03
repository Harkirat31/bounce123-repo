import { WebSocketServer, WebSocket } from 'ws';
import { Server as HttpServer, IncomingMessage } from 'http';
import { Server as HttpsServer } from 'https';
import jwt from 'jsonwebtoken';
import url from 'url';

// Track connected clients
const clients = new Map<string,WebSocket>();
const secretKey = process.env.JWT_SECRET


// setTimeout(()=>{
//     delivered("7yPWUGula8TfVctK9cyUnKsuq1l2","test")
// },5000)

// Initialize WebSocket server
function initWebSocketServer(server: HttpServer | HttpsServer) {
    const wss = new WebSocketServer({ noServer:true });


    server.on("upgrade", (request, socket, head) => {
        const token = extractTokenFromRequest(request);
        if (!token) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }
        jwt.verify(token, secretKey!, (err, user) => {
            if (err) {
                //console.log(err)
                // Reject connection if token is invalid
                socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
                socket.destroy();
                return;
            }
            // If authentication is successful, upgrade to WebSocket
            try {
                wss.handleUpgrade(request, socket, head, (ws) => {
                    wss.emit('connection', ws, user);
                });
            } catch (err) {
                console.log(err)
            }
        });
    })
    // Handle new WebSocket connections
    wss.on('connection', (ws: WebSocket,user:jwt.JwtPayload | undefined) => {
        console.log('New WebSocket connection established');
        clients.set(user!.user.userId,ws); // Add the client to the set

        // Handle WebSocket disconnection
        ws.on('close', () => {
            console.log('WebSocket connection closed');
     //       clients.delete(ws); // Remove the client from the set
        });

        // Handle incoming messages from WebSocket
        ws.on('message', (message: string) => {
            console.log(`Received message: ${message}`);
        });
    });
}




function extractTokenFromRequest(request: IncomingMessage): string | null {

    
    const queryParams = url.parse(request.url!, true).query;
    if(queryParams.token && typeof queryParams.token =="string"){
        return queryParams.token
    }else{
        return null
    }
    // const authHeader = request.headers['authorization'];
    // if (authHeader) {
    //     return authHeader.split(' ')[1];
    // }
    // else {
    //     return null
    // }
}

export { initWebSocketServer, clients };
