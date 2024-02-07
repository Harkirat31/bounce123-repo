import { useEffect } from "react"
import { getDriversAPI, getOrdersAPI, getPathsAPI } from "../services/ApiService"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { driversState } from "../store/atoms/driversAtom"
import { ordersAtom, ordersSearchDate } from "../store/atoms/orderAtom"
import { savedPathsAtom } from "../store/atoms/pathAtom"
import { convertToUTC } from "../utils/UTCdate"
import Loading from "./Loading"
import { loadingState } from "../store/atoms/loadingStateAtom"


const Init = () => {
    const setDrivers = useSetRecoilState(driversState)
    const setOrders = useSetRecoilState(ordersAtom)
    const setPaths = useSetRecoilState(savedPathsAtom)
    const orderSearchDate = useRecoilValue(ordersSearchDate)
    const loading = useRecoilValue(loadingState)

    useEffect(() => {
        if (window.localStorage.getItem("token")) {
            let date = convertToUTC(orderSearchDate)
            getOrdersAPI(date).then((orders: any) => {
                getPathsAPI(date).then((paths: any) => {
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
            {loading && <Loading></Loading>}
        </div>
    )
}

export default Init
