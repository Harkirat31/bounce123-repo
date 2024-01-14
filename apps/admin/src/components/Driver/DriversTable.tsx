import { useRecoilState } from "recoil"
import { DriverType } from "types"
import { deleteDriver, getDriversAPI } from "../../services/ApiService"
import { driversState } from "../../store/atoms/driversAtom"

const DrivingTable = () => {

    // let items: number[] = [1, 2, 3];
    const [drivers, setDrivers] = useRecoilState(driversState)

    const onDelete = (ev: any) => {
        let driverId = ev.currentTarget.getAttribute('data-id')
        deleteDriver(driverId).then((res: any) => {
            getDriversAPI().then((drivers: any) => {
                setDrivers({
                    isLoading: false,
                    value: drivers
                })
            })
            if (res.isDeleted) {
                alert("Deleted Succesfully")
            }
            else {
                alert("Error")
            }
        }).catch((_) => {
            alert("Error")
        })

    }
    if (drivers != null && (drivers.value as []).length > 0) {
        return <>
            <div className="mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Contact
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Vehicle Style
                            </th>

                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Delete</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(drivers.value as []).map((driver: DriverType) => {
                            return <>
                                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {driver.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {driver.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {driver.phone}
                                    </td>
                                    <td className="px-6 py-4">
                                        {driver.vehicleStyle}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button data-id={`${driver.uid}`} onClick={onDelete} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </table>
            </div>

        </>

    }
    else {
        return <div className="mt-10  bg-slate-50 shadow-md">
            <p className="p-10">No Driver is created</p>
        </div>
    }

}

export default DrivingTable