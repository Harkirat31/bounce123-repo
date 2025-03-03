import {app} from "./index"
import { initWebSocketServer } from "./sockets/websocket";

const port = process.env.PORT

const server = app.listen(port, () => console.log(`Running at port ${port}`))

initWebSocketServer(server);
