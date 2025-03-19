import { atom } from "recoil";

export const webSocket = atom<WebSocket|null>({
    key:"socket",
    default:null
})
