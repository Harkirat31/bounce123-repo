import { atom } from "recoil";

export const distinctOrdersDateAtom = atom<Date[]>({
    key: "distinctOrdersDateAtom",
    default: []
})