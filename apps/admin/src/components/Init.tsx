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
import { refresh } from "../store/atoms/refreshAtom"


const Init = () => {
    const setDrivers = useSetRecoilState(driversState)
    const setOrders = useSetRecoilState(ordersAtom)
    const setPaths = useSetRecoilState(savedPathsAtom)
    const orderSearchDate = useRecoilValue(ordersSearchDate)
    const loading = useRecoilValue(loadingState)
    const [_tokenValue, setTokenValue] = useRecoilState(token)
    const setRefresh = useSetRecoilState(refresh("d"))

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
                        setRefresh()
                        
                    }).catch((err) => {
                        alert("Error1 Fetching Data, Please check internet or refresh the page agin")
                    })
                }).catch((err) => {
                    alert("Error2 Fetching Data, Please check internet or refresh the page agin")
                })
            }).catch((err) => {
                console.log(err)
                alert("Error Fetching Data, Please check internet or login again")
                setTokenValue(null)
                window.location.assign("/")
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
