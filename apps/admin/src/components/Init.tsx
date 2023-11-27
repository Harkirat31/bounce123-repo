import { useEffect } from "react"
import { getDriversAPI, getOrdersAPI, getPathsAPI, getRentingItemsAPI, getSideItemsAPI } from "../services/ApiService"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { rentItemsState } from "../store/atoms/rentItemsAtom"
import { sideItemsState } from "../store/atoms/sideItemsAtom"
import { driversState } from "../store/atoms/driversAtom"
import { ordersAtom, ordersSearchDate } from "../store/atoms/orderAtom"
import { savedPaths } from "../store/atoms/pathAtom"
import { OrderType } from "types"


const Init = () => {
    const setRentingItems = useSetRecoilState(rentItemsState)
    const setSideItems = useSetRecoilState(sideItemsState)
    const setDrivers = useSetRecoilState(driversState)
    const setOrders = useSetRecoilState(ordersAtom)
    const setPaths = useSetRecoilState(savedPaths)
    const orderSearchDate = useRecoilValue(ordersSearchDate)

    useEffect(() => {
        if (window.localStorage.getItem("token")) {
            getRentingItemsAPI().then((rentingItems: any) => {
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
            getOrdersAPI(orderSearchDate).then((orders: OrderType[]) => {
                setOrders(orders)
            })
            getPathsAPI(orderSearchDate).then((paths: any) => {
                setPaths(paths)
            })
        }
    }, [orderSearchDate])

    return (
        <div>

        </div>
    )
}

export default Init
