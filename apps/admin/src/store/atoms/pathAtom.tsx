import { atom, useRecoilState } from "recoil";
import { PathOrderType } from "types";

export const createPathAtom = atom<string[]>({
    key: "createPathAtom",
    default: []
})

export const savedPaths = atom<PathOrderType[]>({
    key: "getPaths",
    default: []
})

export const getSavedPathById = (id?: string) => {
    const [paths] = useRecoilState(savedPaths)
    let path = paths.find((path) => id === path.pathId)
    return atom({
        key: `path${id}`,
        default: path
    })
}