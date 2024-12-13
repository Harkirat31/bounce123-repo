
import CreateDriver from "../components/Driver/CreateDriver.tsx";
import DriversTable from "../components/Driver/DriversTable.tsx";


const Driver = () => {
  return (
    <>
      <div className="mt-4 pt-4 xl:grid xl:grid-cols-12 xl:ml-10">
        <div className="xl:col-span-8 overflow-scroll m-1">
          <div className="flex items-center flex-col">
            <div className="flex ">
              <p className="text-blue-900 font-bold">Drivers at a glance</p>
            </div>
            <DriversTable></DriversTable>
          </div>
        </div>
        <div className="xl:col-span-4 mx-2 my-4 xl:my-0  xl:ml-2">
          <CreateDriver></CreateDriver>
          
        </div>
      </div>
    </>
  )
}

export default Driver


