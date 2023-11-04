import { atom } from "recoil";
import { PathOrderType } from "types";

export const createPathAtom = atom<string[]>({
    key: "createPathAtom",
    default: []
})

export const savedPaths = atom<PathOrderType[]>({
    key: "getPaths",
    default: []
})