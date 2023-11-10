
import CreateDriver from "../components/CreateDriver.tsx";
import DriversTable from "../components/DriversTable.tsx";


const Driver = () => {
  return (
    <>
      <div className="mt-4 pt-4 lg:grid md:grid-cols-12 md:ml-10">
        <div className="md:col-span-8">
          <div className="flex items-center flex-col">
            <div className="flex ">
              <p className="text-blue-900">Drivers at a glance</p>
            </div>
            <DriversTable></DriversTable>
          </div>
        </div>
        <div className="md:col-span-4 ">
          <CreateDriver></CreateDriver>
        </div>
      </div>
    </>
  )
}

export default Driver


