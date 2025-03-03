import { RealTimeUpdates } from "types";
import { clients } from "../websocket";
import { WebSocket } from 'ws';

// Function to broadcast a message to all clients
export function delivered(userId:string,orderId:string) {
    const client = clients.get(userId)
    if(client){
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type:RealTimeUpdates.ORDER_DELIVERED,
                id:orderId
            })); // Send message to each connected client
        }
    }      
}