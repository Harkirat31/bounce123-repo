import { useSetRecoilState } from "recoil"
import { rentItemsState } from "../store/atoms/rentItemsAtom"
import { sideItemsState } from "../store/atoms/sideItemsAtom"
import { useEffect } from "react"
import { BASE_URL } from "../../config"

const Init = () => {

    const setRentingItems = useSetRecoilState(rentItemsState)
    const setSideItems = useSetRecoilState(sideItemsState)

    useEffect(() => {
        const urlGetRentingItems = `${BASE_URL}/admin/getRentingItems`
        fetch(urlGetRentingItems, {
            method: "GET"
        }).then(result => {
            result.json().then(
                (jsonData) => {
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



    }, [])

    return (
        <div>

        </div>
    )
}

export default Init
