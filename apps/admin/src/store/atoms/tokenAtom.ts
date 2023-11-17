import { atom, selector } from "recoil";

const tokenAtom = atom<string | null>({
    key: "tokenAtom",
    default: localStorage.getItem('token')
})

export const token = selector<string | null>({
    key: "token",
    get: ({ get }) => {
        let tokenValue = get(tokenAtom)
        return tokenValue
    },
    set: ({ get, set }, newValue) => {
        if (typeof newValue === 'string') {
            localStorage.setItem("token", newValue)
            set(tokenAtom, newValue)
        }
        else {
            set(tokenAtom, null)
        }

    }
})

