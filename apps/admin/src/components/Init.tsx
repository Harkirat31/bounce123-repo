import { useEffect } from "react"
import {  getDistinctDatesOfOrdersAPI, getDriversAPI, getOrdersAPI, getPathsAPI } from "../services/ApiService"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { driversState } from "../store/atoms/driversAtom"
import { ordersAtom, ordersSearchDate } from "../store/atoms/orderAtom"
import { savedPathsAtom } from "../store/atoms/pathAtom"
import { convertToUTC } from "../utils/UTCdate"
import Loading from "./Loading"
import { loadingState } from "../store/atoms/loadingStateAtom"
import { token } from "../store/atoms/tokenAtom"
import { refreshData, refresh } from "../store/atoms/refreshAtom"
import { connectToSocket } from "../services/SocketService"
import { webSocket } from "../store/atoms/webSocket"
import { distinctOrdersDateAtom } from "../store/atoms/distinctOrdersDateAtom"
import toLocalDateOnlyFromUTC from "../utils/LocaleDate"


const Init = () => {
    const setDrivers = useSetRecoilState(driversState)
    const setOrders = useSetRecoilState(ordersAtom)
    const setPaths = useSetRecoilState(savedPathsAtom)
    const orderSearchDate = useRecoilValue(ordersSearchDate)
    const [loading, setLoading] = useRecoilState(loadingState)
    const [tokenValue, setTokenValue] = useRecoilState(token)
    const setRefresh = useSetRecoilState(refresh("d")) //name change in future
    const refreshAllData = useRecoilValue(refreshData)
    const setSocket = useSetRecoilState(webSocket)
    const setDistinctOrdersDate = useSetRecoilState(distinctOrdersDateAtom)


   useEffect(() => {
    if (window.localStorage.getItem("token")) {
        setLoading({ isLoading: true, value: "Loading initial Data...." })
        const date = convertToUTC(orderSearchDate)

        Promise.all([
            getOrdersAPI(date),
            getPathsAPI(date),
            getDriversAPI(),
            getDistinctDatesOfOrdersAPI()
        ])
        .then(([orders, paths, drivers, distinctDates]:any) => {
            if (tokenValue) {
                const ws = connectToSocket(tokenValue)    
                setSocket(ws)
            }

            setDistinctOrdersDate(distinctDates.map(toLocalDateOnlyFromUTC))
            setOrders(orders)
            setPaths(paths)
            setDrivers({ isLoading: false, value: drivers })
            //change name of refresh in future
            setRefresh()
            setLoading({ isLoading: false, value: null })
        })
        .catch((err) => {
            setLoading({ isLoading: false, value: null })
            console.error("Error during initial data load:", err)
            alert("Error fetching data. Please check your internet or try again.")
            setTokenValue(null)
            window.location.assign("/")
        })
    }
}, [orderSearchDate, refreshAllData])


    return (
        <div>
            {loading.isLoading && <Loading></Loading>}
        </div>
    )
}

export default Init
