import { atom, selectorFamily } from "recoil";
import { ordersAtom } from "./orderAtom";
import { getOrder } from "../selectors/orderSelector";
import { getSavedPathById, savedPathsAtom } from "./pathAtom";

/*
This selector is used to refresh each order as Order is cached need to set to new value in ordersAtom State. 
Reset Recoil State can be used in future
*/
export const refresh = selectorFamily({
    key: "refresh",
    get:()=>({ get }) => {   
    },
    set:()=>({get,set})=>{
        let orders = get(ordersAtom);
        orders.forEach(element => {
           set(getOrder(element.orderId!),{...element}) 
        })
        let paths = get(savedPathsAtom)
        paths.forEach(element=>{
            set(getSavedPathById(element.pathId!),{...element})
        })
    }
})


export const refreshData = atom<string>({
    key:"refreshDAta",
    default:"refresh"
})