import { RealTimeUpdates } from "types";
import { clients } from "../websocket";
import { WebSocket } from 'ws';

// Function to broadcast a message to all clients
export function delivered(userId:string,orderId:string) {
    const clientArray = clients.get(userId)
    console.log("Size",clientArray?.size)
    if(clientArray){
        for (const client of clientArray){
            if(client){
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type:RealTimeUpdates.ORDER_DELIVERED,
                        id:orderId
                    })); // Send message to each connected client
                }
            }     
        }
    }

   
    
}