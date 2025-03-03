import { useRecoilState, useSetRecoilState } from "recoil"
import { DriverType } from "types"
import { deleteDriver, getDriversAPI } from "../../services/ApiService"
import { driversState } from "../../store/atoms/driversAtom"
import { loadingState } from "../../store/atoms/loadingStateAtom"

const DrivingTable = () => {

    // let items: number[] = [1, 2, 3];
    const [drivers, setDrivers] = useRecoilState(driversState)
    const setLoading = useSetRecoilState(loadingState)

    const onDelete = (ev: any) => {
        setLoading({isLoading:true,value:"Please Wait..."})
        let driverId = ev.currentTarget.getAttribute('data-id')
        deleteDriver(driverId).then((res: any) => {
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
        })

    }
   
    if (drivers != null && (drivers.value as []).length > 0) {
        return <>
           <div className="mt-4 w-full overflow-scroll shadow-md sm:rounded-lg">
                <table className="text-sm text-left text-gray-500 w-full ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
                                <tr className=" bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
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