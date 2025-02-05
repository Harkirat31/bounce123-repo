import { useEffect } from "react"
import { getDriversAPI, getOrdersAPI, getPathsAPI } from "../services/ApiService"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { driversState } from "../store/atoms/driversAtom"
import { ordersAtom, ordersSearchDate } from "../store/atoms/orderAtom"
import { savedPathsAtom } from "../store/atoms/pathAtom"
import { convertToUTC } from "../utils/UTCdate"
import Loading from "./Loading"
import { loadingState } from "../store/atoms/loadingStateAtom"
import { token } from "../store/atoms/tokenAtom"
import { refreshData, refresh } from "../store/atoms/refreshAtom"


const Init = () => {
    const setDrivers = useSetRecoilState(driversState)
    const setOrders = useSetRecoilState(ordersAtom)
    const setPaths = useSetRecoilState(savedPathsAtom)
    const orderSearchDate = useRecoilValue(ordersSearchDate)
    const [loading,setLoading] = useRecoilState(loadingState)
    const [_tokenValue, setTokenValue] = useRecoilState(token)
    const setRefresh = useSetRecoilState(refresh("d"))
    const refreshAllData = useRecoilValue(refreshData)


    useEffect(() => {

        if (window.localStorage.getItem("token")) {
            setLoading(true)
            let date = convertToUTC(orderSearchDate)
            getOrdersAPI(date).then((orders: any) => {
                getPathsAPI(date).then((paths: any) => {
                    getDriversAPI().then(async (drivers: any) => {
                        setOrders(orders)
                        setPaths(paths)
                        setDrivers({
                            isLoading: false,
                            value: drivers
                        })
                        setRefresh()
                        setLoading(false)
                    }).catch((err) => {
                        setLoading(false)
                        alert("Error1 Fetching Data, Please check internet or refresh the page agin")
                    })
                }).catch((err) => {
                    setLoading(false)
                    alert("Error2 Fetching Data, Please check internet or refresh the page agin")
                })
            }).catch((err) => {
                setLoading(false)
                alert("Error Fetching Data, Please check internet or login again")
                setTokenValue(null)
                window.location.assign("/")
            })

        }
    }, [orderSearchDate,refreshAllData])

    return (
        <div>
            {loading && <Loading></Loading>}
        </div>
    )
}

export default Init
