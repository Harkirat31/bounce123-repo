import { atom } from "recoil"
import { DriverType } from "types"

type driversStateType = {
    isLoading: boolean,
    value: DriverType[]
}


export const driversState = atom<driversStateType>({
    key: "driversState",
    default: {
        isLoading: true,
        value: []
    }
})

