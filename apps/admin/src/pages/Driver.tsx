
import CreateDriver from "../components/Driver/CreateDriver.tsx";
import DriversTable from "../components/Driver/DriversTable.tsx";


const Driver = () => {
  return (
    <>
      <div className="mt-4 pt-4 xl:grid xl:grid-cols-12">
        <div className="ml-2 xl:col-span-9 overflow-scroll">
          <div className="flex items-center flex-col">
            <div className="flex">
              <p className="text-blue-900 font-bold">Drivers at a glance</p>
            </div>
            <DriversTable></DriversTable>
          </div>
        </div>
        <div className="mt-10 xl:mt-0 ml-4 xl:col-span-3">
          <CreateDriver></CreateDriver>
        </div>
      </div>
    </>
  )
}

export default Driver


