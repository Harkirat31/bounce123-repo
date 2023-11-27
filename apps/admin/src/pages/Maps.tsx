import { useEffect } from "react"
import MapArea from "../components/MapArea"
import RouteCalculatorArea from "../components/RouteCalculatorArea"
import { getUserAPI } from "../services/ApiService"
import { useRecoilState } from "recoil"
import { userAtom } from "../store/atoms/userAtom"


const Map = () => {
  const [user, setUser] = useRecoilState(userAtom)
  useEffect(() => {
    getUserAPI().then((user: any) => {
      setUser(user)
    })

  }, [])
  return (
    <div className="xl:grid grid-cols-11 h-screen">
      <div className="xl:col-span-8 bg-slate-100">
        {user == null && <p>Map is Loading....</p>}
        {user != null && <MapArea user={user}></MapArea>}
      </div>
      <div className="xl:col-span-3 overflow-y-scroll">
        <RouteCalculatorArea></RouteCalculatorArea>
      </div>

    </div>
  )
}

export default Map
