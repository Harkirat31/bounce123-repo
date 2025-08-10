import { useRecoilState, useSetRecoilState } from "recoil"
import { DriverType } from "types"
import { deleteDriver, getDriversAPI } from "../../services/ApiService"
import { driversState } from "../../store/atoms/driversAtom"
import { loadingState } from "../../store/atoms/loadingStateAtom"
import { useState } from "react"

const DrivingTable = () => {

    // let items: number[] = [1, 2, 3];
    const [drivers, setDrivers] = useRecoilState(driversState)
    const setLoading = useSetRecoilState(loadingState)
    const [driverToDelete, setDriverToDelete] = useState<DriverType | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const onDeleteClick = (driver: DriverType) => {
        setDriverToDelete(driver)
        setShowDeleteConfirm(true)
    }

    const onDeleteConfirm = () => {
        if (!driverToDelete || !driverToDelete.uid) return
        
        setLoading({isLoading:true,value:"Please Wait..."})
        deleteDriver(driverToDelete.uid).then((res: any) => {
            getDriversAPI().then((drivers: any) => {
                setDrivers({
                    isLoading: false,
                    value: drivers
                })
                setLoading({isLoading:false,value:null})
            })
            if (res.isDeleted) {
                alert("Deleted Succesfully")
            }
            else {
                alert("Error")
            }
            setLoading({isLoading:false,value:null})
        }).catch((_) => {
            alert("Error")
            setLoading({isLoading:false,value:null})
        }).finally(() => {
            setShowDeleteConfirm(false)
            setDriverToDelete(null)
        })
    }

    const onDeleteCancel = () => {
        setShowDeleteConfirm(false)
        setDriverToDelete(null)
    }
   
    if (drivers != null && (drivers.value as []).length > 0) {
        return <>
           <div className="mt-4 w-full overflow-scroll rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm text-gray-700">
                    <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                        <tr>
                            <th scope="col" className="px-3 py-3 w-10">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 w-10">
                                Email
                            </th>
                            <th scope="col" className="px-3 py-3 w-10">
                                Contact
                            </th>
                            <th scope="col" className="px-3 py-3 w-10">
                                Vehicle Style
                            </th>

                            <th scope="col" className="px-3 py-3 w-10">
                                <p className="">Delete</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(drivers.value as []).map((driver: DriverType) => {
                            return <>
                                <tr className="bg-white hover:bg-gray-50">
                                    <td className="px-3 py-4">
                                        <p>{driver.name}</p>
                                    </td>

                                    <td className="px-3 py-4">
                                        {driver.email}
                                    </td>
                                    <td className="px-3 py-4">
                                        {driver.phone}
                                    </td>
                                    <td className="px-3 py-4">
                                        {driver.vehicleStyle}
                                    </td>

                                    <td className="px-3 py-4">
                                        <button onClick={() => onDeleteClick(driver)} className="text-red-600 hover:text-red-800 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && driverToDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Driver</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to delete <span className="font-semibold">{driverToDelete.name}</span>? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex justify-center space-x-3 mt-4">
                                <button
                                    onClick={onDeleteCancel}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onDeleteConfirm}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>

    }
    else {
        return <div className="mt-8 w-full">
            <div className="mx-auto max-w-3xl rounded-lg border border-dashed border-gray-300 bg-white py-12 px-6 text-center shadow-sm">
                <h3 className="mt-1 text-base font-semibold text-gray-900">No drivers yet</h3>
                <p className="mt-1 text-sm text-gray-500">Add a driver using the form.</p>
            </div>
        </div>
    }

}

export default DrivingTable