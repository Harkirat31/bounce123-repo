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
import { connectToSocket } from "../services/SocketService"
import { webSocket } from "../store/atoms/webSocket"


const Init = () => {
    const setDrivers = useSetRecoilState(driversState)
    const setOrders = useSetRecoilState(ordersAtom)
    const setPaths = useSetRecoilState(savedPathsAtom)
    const orderSearchDate = useRecoilValue(ordersSearchDate)
    const [loading,setLoading] = useRecoilState(loadingState)
    const [tokenValue, setTokenValue] = useRecoilState(token)
    const setRefresh = useSetRecoilState(refresh("d")) //name change in future
    const refreshAllData = useRecoilValue(refreshData)
    const setSocket = useSetRecoilState(webSocket)


    useEffect(() => {

        if (window.localStorage.getItem("token")) {

            setLoading({isLoading:true,value:"Loading initial Data...."})
            let date = convertToUTC(orderSearchDate)
            getOrdersAPI(date).then((orders: any) => {
                getPathsAPI(date).then((paths: any) => {
                    getDriversAPI().then(async (drivers: any) => {
                        if(tokenValue){
                            const ws = connectToSocket(tokenValue!)
                            setSocket(ws)
                        }
                        setOrders(orders)
                        setPaths(paths)
                        setDrivers({
                            isLoading: false,
                            value: drivers
                        })
                        //setRefresh change name in future
                        setRefresh()
                        setLoading({isLoading:false,value:null})
                    }).catch((err) => {
                        setLoading({isLoading:false,value:null})
                        alert("Error Fetching Data, Please check internet or refresh the page again")
                    })
                }).catch((err) => {
                    setLoading({isLoading:false,value:null})
                    alert("Error Fetching Data, Please check internet or refresh the page again")
                })
            }).catch((err) => {
                setLoading({isLoading:false,value:null})
                alert("Error Fetching Data, Please check internet or login again")
                setTokenValue(null)
                window.location.assign("/")
            })

        }
    }, [orderSearchDate,refreshAllData])

    return (
        <div>
            {loading.isLoading && <Loading></Loading>}
        </div>
    )
}

export default Init
