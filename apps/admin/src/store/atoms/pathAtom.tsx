import { atom, atomFamily, selectorFamily } from "recoil";
import { PathOrderType } from "types";

export const createPathAtom = atom<string[]>({
    key: "createPathAtom",
    default: []
})

export const savedPaths = atom<PathOrderType[]>({
    key: "getPaths",
    default: []
})

export const getSavedPathById = atomFamily({
    key: `getPath`,
    default: selectorFamily({
        key: "getPath/Default",
        get: (pathId: string) => ({ get }) => {
            const paths = get(savedPaths)
            return paths.find((path) => path.pathId === pathId)
        }
    })
})


export const getSavedPathWithId = atomFamily({
    key: "getSavedPathWithId",
    default: savedPaths
})