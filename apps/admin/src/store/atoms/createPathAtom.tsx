import { atom } from "recoil";

export const createPathAtom = atom<string[]>({
    key: "createPathAtom",
    default: []
})