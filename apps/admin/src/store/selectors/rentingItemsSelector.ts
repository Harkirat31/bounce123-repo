import { selector } from "recoil";
import { rentItemsState } from "../atoms/rentItemsAtom"

export const getRentingItems = selector({
    key: "getRentingItems",
    get: ({ get }) => {
        const state = get(rentItemsState)
        return state.value
    }
})

export const isRentingItemsLoading = selector({
    key: "isRentingItemsLoading",
    get: ({ get }) => {
        const state = get(rentItemsState)
        return state.isLoading
    }
})