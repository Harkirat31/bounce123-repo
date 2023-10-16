import { atom } from "recoil"
import { RentingItemType } from "types"

type rentingItemsStateType = {
    isLoading: boolean,
    value: RentingItemType[]
}


export const rentItemsState = atom<rentingItemsStateType>({
    key: "rentItemsState",
    default: {
        isLoading: true,
        value: []
    }
})

