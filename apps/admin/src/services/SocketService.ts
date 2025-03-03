const socketUrl = import.meta.env.VITE_WEBSOCKET_URL


export const connectToSocket = (token: string) => {
    const ws = new WebSocket(socketUrl + token)
    ws.onopen = () => {
        console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
        console.log('Received:', event.data);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };

    return ws
}


