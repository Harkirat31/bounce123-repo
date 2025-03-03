import { atom } from "recoil";

export const loadingState = atom<{isLoading:boolean,value:string|null}>({
    key: "loadingState",
    default: {
        isLoading:false,
        value:"Please Wait..."
    }
})