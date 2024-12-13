import MapArea from "../components/Map/MapArea"
import RouteCalculatorArea from "../components/Map/RouteCalculatorArea"
import { useRecoilValue } from "recoil"
import { userAtom } from "../store/atoms/userAtom"


const Map = () => {
  const user = useRecoilValue(userAtom)
  return (
    <div className="xl:grid xl:grid-cols-11 h-full">
      <div className="xl:col-span-8 bg-slate-100">
        {user == null && <p className="h-screen">Map is Loading....</p>}
        {user != null && <MapArea user={user}></MapArea>}
      </div>
      <div className="xl:col-span-3 overflow-y-scroll">
        <RouteCalculatorArea></RouteCalculatorArea>
      </div>
    </div>
  )
}

export default Map
