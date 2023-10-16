import { selector } from "recoil";
import { sideItemsState } from "../atoms/sideItemsAtom";



export const getSideItems = selector({
    key: "getSideItems",
    get: ({ get }) => {
        const state = get(sideItemsState)
        return state.value
    }
})