import { RealTimeUpdates } from "types";
import { clients } from "../websocket";
import { WebSocket } from 'ws';

// Function to broadcast a message to all clients
export function delivered(companyId:string,orderId:string) {
    const clientArray = clients.get(companyId)
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

export function pathAcceptedOrRejected(companyId:string,pathId:string,isAccepted:boolean) {
    const clientArray = clients.get(companyId)
    if(clientArray){
        for (const client of clientArray){
            if(client){
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type:RealTimeUpdates.PATH_ACCEPTED,
                        id:pathId,
                        isAccepted:isAccepted
                    })); // Send message to each connected client
                }
            }     
        }
    } 
}