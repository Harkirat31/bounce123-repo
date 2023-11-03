import { atom } from "recoil";
import { pathOrderType } from "types";

export const createPathAtom = atom<string[]>({
    key: "createPathAtom",
    default: []
})

export const savedPaths = atom<pathOrderType[]>({
    key: "getPaths",
    default: []
})