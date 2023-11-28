import { useEffect } from "react"
import { getDriversAPI, getOrdersAPI, getPathsAPI } from "../services/ApiService"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { driversState } from "../store/atoms/driversAtom"
import { ordersAtom, ordersSearchDate } from "../store/atoms/orderAtom"
import { savedPathsAtom } from "../store/atoms/pathAtom"


const Init = () => {
    const setDrivers = useSetRecoilState(driversState)
    const setOrders = useSetRecoilState(ordersAtom)
    const setPaths = useSetRecoilState(savedPathsAtom)
    const orderSearchDate = useRecoilValue(ordersSearchDate)

    useEffect(() => {
        if (window.localStorage.getItem("token")) {
            getOrdersAPI(orderSearchDate).then((orders: any) => {
                getPathsAPI(orderSearchDate).then((paths: any) => {
                    getDriversAPI().then((drivers: any) => {
                        setOrders(orders)
                        setPaths(paths)
                        setDrivers({
                            isLoading: false,
                            value: drivers
                        })
                    }).catch((err) => {
                        alert("Error Fetching Data, Please check internet or refresh the page agin")
                    })
                }).catch((err) => {
                    alert("Error Fetching Data, Please check internet or refresh the page agin")
                })
            }).catch((err) => {
                alert("Error Fetching Data, Please check internet or refresh the page agin")
            })

        }
    }, [orderSearchDate])

    return (
        <div>

        </div>
    )
}

export default Init
