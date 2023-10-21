import MapArea from "../components/MapArea"
import RouteCalculatorArea from "../components/RouteCalculatorArea"

const Map = () => {
  return (
    <div className="xl:grid grid-cols-12 h-screen">
      <div className="xl:col-span-9 bg-slate-100">
        <MapArea></MapArea>
      </div>
      <div className="xl:col-span-3 overflow-y-scroll">
        <RouteCalculatorArea></RouteCalculatorArea>
      </div>

    </div>
  )
}

export default Map
