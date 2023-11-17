import { atom } from "recoil";
import { UserType } from "types";

export const userAtom = atom<UserType | null>({
    key: "userAtom",
    default: null
})