import { useRecoilValue } from "recoil"
import { SideItemType } from "types"
import { getSideItems } from "../../store/selectors/sideItemsSelector"

const SideItemsTable = () => {

    // let items: number[] = [1, 2, 3];
    const sideItems = useRecoilValue(getSideItems)
    if (sideItems != null && (sideItems as []).length > 0) {
        return <>
            <div className="mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Product title
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Capacity
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(sideItems as []).map((item: SideItemType) => {
                            return <>
                                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {item.title}
                                    </th>
                                    <td className="px-6 py-4">
                                        {item.capacity}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
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
        return <div className="mt-10 w-full bg-slate-50 shadow-md">
            <p className="p-10">No Renting Item is created</p>
        </div>
    }

}

export default SideItemsTable