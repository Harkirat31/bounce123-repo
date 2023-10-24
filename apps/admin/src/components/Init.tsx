import { useSetRecoilState } from "recoil"
import { rentItemsState } from "../store/atoms/rentItemsAtom"
import { sideItemsState } from "../store/atoms/sideItemsAtom"
import { useEffect } from "react"
import { BASE_URL } from "../../config"
import { driversState } from "../store/atoms/driversAtom"
import { ordersAtom, ordersState } from "../store/atoms/orderAtom"

const Init = () => {

    const setRentingItems = useSetRecoilState(rentItemsState)
    const setSideItems = useSetRecoilState(sideItemsState)
    const setDrivers = useSetRecoilState(driversState)
    const setOrders = useSetRecoilState(ordersState)
    const setOrdersMap = useSetRecoilState(ordersAtom)

    useEffect(() => {
        const urlGetRentingItems = `${BASE_URL}/admin/getRentingItems`
        fetch(urlGetRentingItems, {
            method: "GET"
        }).then(result => {
            result.json().then(
                (jsonData) => {
                    console.log(jsonData)
                    setRentingItems({
                        isLoading: false,
                        value: jsonData
                    })
                }
            ).catch((error) => {
                console.log(error)
            })
        }).catch((error) => console.log("error"))

        const urlGetSideItems = `${BASE_URL}/admin/getSideItems`
        fetch(urlGetSideItems, {
            method: "GET"
        }).then(result => {
            result.json().then(
                (jsonData) => {
                    console.log(jsonData)
                    setSideItems({
                        isLoading: false,
                        value: jsonData
                    })
                }
            ).catch((error) => {
                console.log(error)
            })
        }).catch((error) => console.log("error"))

        const urlGetDrivers = `${BASE_URL}/admin/getDrivers`
        fetch(urlGetDrivers, {
            method: "GET"
        }).then(result => {
            result.json().then(
                (jsonData) => {
                    console.log(jsonData)
                    setDrivers({
                        isLoading: false,
                        value: jsonData
                    })
                }
            ).catch((error) => {
                console.log(error)
            })
        }).catch((error) => console.log("error"))


        const urlGetOrders = `${BASE_URL}/admin/getOrders`
        let dateNow = new Date().setUTCHours(0, 0, 0, 0)
        console.log(dateNow)
        fetch(urlGetOrders, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: dateNow })
        }).then(result => {
            result.json().then(
                (jsonData) => {
                    console.log(jsonData)
                    setOrders({
                        isLoading: false,
                        value: jsonData,
                        date: new Date(dateNow)
                    })
                    setOrdersMap(jsonData)
                }
            ).catch((error) => {
                console.log(error)
            })
        }).catch((error) => console.log("error"))



    }, [])

    return (
        <div>

        </div>
    )
}

export default Init
