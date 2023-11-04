import { useEffect } from "react"
import { getDriversAPI, getOrdersAPI, getPathsAPI, getRentingItemsAPI, getSideItemsAPI } from "../services/ApiService"
import { useSetRecoilState } from "recoil"
import { rentItemsState } from "../store/atoms/rentItemsAtom"
import { sideItemsState } from "../store/atoms/sideItemsAtom"
import { driversState } from "../store/atoms/driversAtom"
import { ordersAtom } from "../store/atoms/orderAtom"
import { savedPaths } from "../store/atoms/pathAtom"

const Init = () => {
    const setRentingItems = useSetRecoilState(rentItemsState)
    const setSideItems = useSetRecoilState(sideItemsState)
    const setDrivers = useSetRecoilState(driversState)
    const setOrders = useSetRecoilState(ordersAtom)
    const setPaths = useSetRecoilState(savedPaths)
    useEffect(() => {
        getRentingItemsAPI().then((rentingItems: any) => {
            console.log(rentingItems)
            setRentingItems({
                isLoading: false,
                value: rentingItems
            })
        })
        getSideItemsAPI().then((sideItems: any) => {
            setSideItems({
                isLoading: false,
                value: sideItems
            })
        })
        getDriversAPI().then((drivers: any) => {
            setDrivers({
                isLoading: false,
                value: drivers
            })
        })
        getOrdersAPI().then((orders: any) => {
            setOrders(orders)
        })
        getPathsAPI(new Date()).then((paths: any) => {
            setPaths(paths)
        })
    }, [])

    return (
        <div>

        </div>
    )
}

export default Init
