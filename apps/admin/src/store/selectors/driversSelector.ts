import { selector } from "recoil";
import { driversState } from "../atoms/driversAtom"

export const getDrivers = selector({
    key: "getDrivers",
    get: ({ get }) => {
        const state = get(driversState)
        return state.value
    }
})


