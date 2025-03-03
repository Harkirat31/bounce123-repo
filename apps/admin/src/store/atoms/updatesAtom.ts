import { atom } from "recoil";
import { RealTimeMessage } from "types";


export const realTimeUpdates = atom<RealTimeMessage[]>({
    key:"updates",
    default:[]
})