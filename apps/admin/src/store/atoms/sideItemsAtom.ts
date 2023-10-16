import { atom } from "recoil"
import { SideItemType } from "types"



type sideItemsStateType = {
    isLoading: boolean,
    value: SideItemType[]
}

export const sideItemsState = atom<sideItemsStateType>({
    key: "sideItemsState",
    default: {
        isLoading: false,
        value: []
    }
})