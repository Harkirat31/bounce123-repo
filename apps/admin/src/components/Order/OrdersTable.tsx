import { useMemo, useState } from "react"
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi"
import { useRecoilState, useRecoilValue } from "recoil"
import { getOrder, getOrders } from "../../store/selectors/orderSelector"
import { ordersSearchDate, rowsToBeDeleted } from "../../store/atoms/orderAtom"
import { OrderType } from "types"
import { deleteOrders } from "../../services/ApiService"

const STATUS_OPTIONS = [
    "All",
    "NotAssigned",
    "PathAssigned",
    "SentToDriver",
    "Assigned",
    "OnTheWay",
    "Picked",
    "Returned",
    "Delivered",
]

// Only status filter is enabled per requirement
const BASE_URL = import.meta.env.VITE_BASE_URL as string

type SortKey =
    | "orderNumber"
    | "cname"
    | "address"
    | "cphone"
    | "deliveryDate"
    | "priority"
    | "paymentStatus"
    | "driverName"
    | "currentStatus"

const OrdersTable = () => {
    const allOrders = useRecoilValue(getOrders) as OrderType[]
    const [rows, setRows] = useRecoilState(rowsToBeDeleted)
    const [searchDate, setSearchDate] = useRecoilState(ordersSearchDate)

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("All")
    const [sortBy, setSortBy] = useState<SortKey>("deliveryDate")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(25)

    const [viewOrderId, setViewOrderId] = useState<string | null>(null)
    const [editOrder, setEditOrder] = useState<OrderType | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const filteredSortedOrders = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()
        const filtered = allOrders.filter((order) => {
            const matchesSearch =
                normalizedSearch.length === 0 ||
                [
                    order.orderNumber?.toString() ?? "",
                    order.cname ?? "",
                    order.address ?? "",
                    order.cphone ?? "",
                    order.itemsDetail ?? "",
                    order.specialInstructions ?? "",
                    order.driverName ?? "",
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(normalizedSearch)
            const matchesStatus =
                statusFilter === "All" || order.currentStatus === statusFilter
            return matchesSearch && matchesStatus
        })

        const sorted = [...filtered].sort((a, b) => {
            const dir = sortDir === "asc" ? 1 : -1
            const getVal = (o: OrderType) => {
                switch (sortBy) {
                    case "deliveryDate":
                        return new Date(o.deliveryDate).getTime()
                    case "orderNumber":
                        return String(o.orderNumber ?? "")
                    case "cname":
                        return String(o.cname ?? "")
                    case "address":
                        return String(o.address ?? "")
                    case "cphone":
                        return String(o.cphone ?? "")
                    case "priority":
                        return String(o.priority ?? "")
                    case "paymentStatus":
                        return String(o.paymentStatus ?? "N/A")
                    case "driverName":
                        return String(o.driverName ?? "")
                    case "currentStatus":
                        return String(o.currentStatus ?? "")
                    default:
                        return 0
                }
            }
            const av = getVal(a)
            const bv = getVal(b)
            if (av < bv) return -1 * dir
            if (av > bv) return 1 * dir
            return 0
        })

        return sorted
    }, [allOrders, search, statusFilter, sortBy, sortDir])

    if (!allOrders || allOrders.length === 0) {
        return (
            <div className="mt-10 w-full max-w-2xl bg-white shadow-sm rounded border border-gray-200">
                <p className="p-10 text-gray-500">No orders</p>
            </div>
        )
    }

    const total = filteredSortedOrders.length
    const totalPages = Math.max(1, Math.ceil(total / rowsPerPage))
    const currentPage = Math.min(page, totalPages)
    const startIdx = (currentPage - 1) * rowsPerPage
    const endIdx = startIdx + rowsPerPage
    const pageOrders = filteredSortedOrders.slice(startIdx, endIdx)
    const pageOrderIds = pageOrders.map((o) => o.orderId)

    const selectablePageOrderIds = pageOrders
        .filter((o) => o.currentStatus === "NotAssigned")
        .map((o) => o.orderId)
    const allSelectableChecked =
        selectablePageOrderIds.length > 0 &&
        selectablePageOrderIds.every((id) => rows.has(id))

    const toggleSort = (key: SortKey) => {
        if (sortBy === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"))
        } else {
            setSortBy(key)
            setSortDir("asc")
        }
    }

    const toggleSelectAllOnPage = (checked: boolean) => {
        const next = new Set(rows)
        if (checked) {
            selectablePageOrderIds.forEach((id) => next.add(id))
        } else {
            selectablePageOrderIds.forEach((id) => next.delete(id))
        }
        setRows(next)
    }

    const clearFilters = () => {
        setSearch("")
        setStatusFilter("All")
        setPage(1)
    }

    return (
        <>
            <div className="mt-4 w-full">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                        <div className="relative">
                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setPage(1)
                                }}
                                placeholder="Search orders (name, phone, address, order #)"
                                className="w-72 md:w-80 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                            />
                        </div>
                        <select
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value)
                                setPage(1)
                            }}
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-600 underline hover:text-gray-800"
                        >
                            Clear
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={allSelectableChecked}
                                onChange={(e) => toggleSelectAllOnPage(e.target.checked)}
                            />
                            <span>Select page</span>
                        </label>
                        <DeleteRows />
                    </div>
                </div>

                <div className="mt-3 w-full shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    <div className="max-h-[calc(100vh-280px)] overflow-auto">
                        <table className="w-full table-fixed text-left text-xs md:text-sm text-gray-600">
                            <thead className="sticky top-0 z-10 bg-gray-50 text-[11px] uppercase text-gray-700">
                                <tr>
                                    <SortableHeader label="Ord. #" sortKey="orderNumber" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} className="w-16 md:w-20 px-2 md:px-3 py-2" />
                                    <SortableHeader label="Name" sortKey="cname" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} className="w-28 md:w-36 px-2 md:px-3 py-2" />
                                    <SortableHeader label="Address" sortKey="address" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} className="w-40 md:w-56 px-1 md:px-2 py-2" />
                                    <SortableHeader label="Phone" sortKey="cphone" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} className="w-28 md:w-32 px-1 md:px-2 py-2" />
                                    <SortableHeader label="Date" sortKey="deliveryDate" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} className="w-28 md:w-32 px-1 md:px-2 py-2" />
                                    <SortableHeader label="Priority" sortKey="priority" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} className="w-20 md:w-24 px-1 md:px-2 py-2" />
                                    <th scope="col" className="w-44 md:w-56 px-1 md:px-2 py-2">Items Detail</th>
                                    <th scope="col" className="w-44 md:w-56 px-1 md:px-2 py-2">Instructions</th>
                                    <SortableHeader label="Payment" sortKey="paymentStatus" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} className="w-20 md:w-24 px-1 md:px-2 py-2" />
                                    <SortableHeader label="Assign To" sortKey="driverName" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} className="w-28 md:w-40 px-1 md:px-2 py-2" />
                                    <SortableHeader label="Status" sortKey="currentStatus" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} className="w-24 md:w-32 px-1 md:px-2 py-2" />
                                    <th scope="col" className="w-40 md:w-56 px-1 md:px-2 py-2 text-right pr-2 md:pr-3 sticky right-0 z-20 bg-gray-50 border-l border-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageOrderIds.map((orderId: any) => (
                                    <OrderRow
                                        key={orderId}
                                        orderId={orderId}
                                        onView={(id: string) => setViewOrderId(id)}
                                        onEdit={(o: OrderType) => setEditOrder(o)}
                                        onDelete={async (id: string) => {
                                            if (!confirm("Delete this order?")) return
                                            try {
                                                setDeletingId(id)
                                                await deleteOrders([id])
                                                // trigger refresh
                                                setSearchDate(new Date(searchDate))
                                                const next = new Set(rows)
                                                next.delete(id)
                                                setRows(next)
                                            } finally {
                                                setDeletingId(null)
                                            }
                                        }}
                                        deletingId={deletingId}
                                    />
                                ))}
                            </tbody>
                        </table>
                        {filteredSortedOrders.length === 0 && (
                            <div className="p-6 text-center text-sm text-gray-500">No matching orders. Adjust filters.</div>
                        )}
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                        <div>
                            Showing {startIdx + 1}-{Math.min(endIdx, total)} of {total}
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value))
                                    setPage(1)
                                }}
                            >
                                {[10, 25, 50, 100].map((n) => (
                                    <option key={n} value={n}>
                                        {n} / page
                                    </option>
                                ))}
                            </select>
                            <div className="flex items-center gap-1">
                                <button
                                    className="rounded border border-gray-300 px-2 py-1 disabled:opacity-50"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Prev
                                </button>
                                <span className="px-2">
                                    {currentPage}/{totalPages}
                                </span>
                                <button
                                    className="rounded border border-gray-300 px-2 py-1 disabled:opacity-50"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {viewOrderId && (
                <OrderViewModal
                    order={allOrders.find((o) => o.orderId === viewOrderId) || null}
                    onClose={() => setViewOrderId(null)}
                />
            )}

            {editOrder && (
                <OrderEditModal
                    order={editOrder}
                    onClose={() => setEditOrder(null)}
                    onSubmit={async (payload) => {
                        try {
                            await fetch(`${BASE_URL}/admin/updateOrder`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                                body: JSON.stringify(payload),
                            })
                            alert("Update request sent. Backend pending.")
                        } catch (e) {
                            alert("Failed to send update request")
                        }
                    }}
                />
            )}
        </>
    )
}


const OrderRow = ({ orderId, onView, onEdit, onDelete, deletingId }: any) => {
    const order = useRecoilValue(getOrder(orderId))
    let date = new Date()
    if (order) {
        date = new Date(order.deliveryDate)
        //date.setDate(date.getUTCDate())

    }
    return <>
        {order &&
            <tr className="bg-white hover:bg-gray-50">
                <td className="px-2 md:px-3 py-2 align-top">
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                </td>
                <td className="px-2 md:px-3 py-2 align-top">
                    <p title={order.cname}>{order.cname}</p>
                </td>
                <td className="px-1 md:px-2 py-2 align-top">
                    <p title={order.address}>{order.address}</p>
                </td>
                <td className="px-1 md:px-2 py-2 align-top">
                    <span className="whitespace-nowrap">{order.cphone}</span>
                </td>
                <td className="px-1 md:px-2 py-2 align-top">
                    {date.toUTCString().slice(0, 16)}
                </td>
                <td className="px-1 md:px-2 py-2 align-top">
                    <PriorityPill priority={order.priority} />
                </td>
                <td className="px-1 md:px-2 py-2 align-top">
                    <p title={order.itemsDetail ?? ""}>{order.itemsDetail}</p>
                </td>
                <td className="px-1 md:px-2 py-2 align-top">
                    <p title={order.specialInstructions ?? ""}>{order.specialInstructions}</p>
                </td>
                <td className="px-1 md:px-2 py-2 align-top">
                    <PaymentBadge status={order.paymentStatus ?? "N/A"} />
                </td>
                <td className="px-1 md:px-2 py-2 align-top">
                    <p title={order.driverName ?? ""}>{order.driverName}</p>
                </td>
                <td className="px-1 md:px-2 py-2 align-top">
                    <StatusBadge status={order.currentStatus} />
                </td>
                <td className="px-1 md:px-2 py-2 align-top text-right pr-2 md:pr-3 sticky right-0 bg-white border-l border-gray-200 w-40 md:w-56 min-w-[10rem] md:min-w-[14rem]">
                    <div className="flex items-center justify-end gap-3 flex-wrap md:flex-nowrap">
                        <div className="inline-flex items-center overflow-hidden rounded-md border border-gray-300 divide-x divide-gray-300 whitespace-nowrap">
                            <button
                                onClick={() => onView(order.orderId)}
                                aria-label="View"
                                title="View"
                                className="px-2 py-1 text-base md:text-lg leading-none text-blue-600 hover:bg-gray-50"
                            >
                                <FiEye />
                            </button>
                            <button
                                onClick={() => onEdit(order)}
                                aria-label="Edit"
                                title="Edit"
                                className="px-2 py-1 text-base md:text-lg leading-none text-indigo-600 hover:bg-gray-50"
                            >
                                <FiEdit2 />
                            </button>
                            {(() => { const canDelete = order.currentStatus === "NotAssigned"; return (
                            <button
                                onClick={() => { if (canDelete) onDelete(order.orderId) }}
                                disabled={!canDelete || deletingId===order.orderId}
                                aria-label="Delete"
                                title={canDelete ? "Delete" : "Only NotAssigned orders can be deleted"}
                                className="px-2 py-1 text-base md:text-lg leading-none text-red-600 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <FiTrash2 />
                            </button> )})()}
                        </div>
                        <span className="hidden md:block h-4 w-px bg-gray-300" />
                        <label className="flex items-center gap-1 text-[11px] md:text-xs text-gray-600 whitespace-nowrap" title="Select for deletion">
                            <ColumnDeleteCheckBox order={order} />
                            <span className="hidden md:inline">Select</span>
                        </label>
                    </div>
                </td>
            </tr>
        }
    </>
}

const ColumnDeleteCheckBox = (props: { order: OrderType }) => {
    const [rows, setRows] = useRecoilState(rowsToBeDeleted)
    if (props.order.currentStatus !== "NotAssigned") {
        return <span className="text-xs text-gray-400">NA</span>
    }
    const checked = rows.has(props.order.orderId)
    return (
        <input
            checked={checked}
            onChange={(event) => {
                const next = new Set(rows)
                if (event.target.checked) {
                    next.add(props.order.orderId)
                } else {
                    next.delete(props.order.orderId)
                }
                setRows(next)
            }}
            type="checkbox"
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
    )
}


const DeleteRows = () => {
    const [rows, setRows] = useRecoilState(rowsToBeDeleted)
    const [searchDate, setSearchDate] = useRecoilState(ordersSearchDate)
    const onDeleteHandle = () => {
        deleteOrders([...rows]).then(() => {
            setSearchDate(new Date(searchDate))
            setRows(new Set())
        })
        
    }
    return (
        <button onClick={onDeleteHandle} type="button" className="text-sm text-blue-700 underline disabled:text-gray-400 disabled:no-underline" disabled={rows.size===0}>
            Delete Selected
        </button>
    )
}


export default OrdersTable
 
// UI helpers
const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        NotAssigned: "bg-gray-100 text-gray-800",
        PathAssigned: "bg-indigo-100 text-indigo-800",
        SentToDriver: "bg-blue-100 text-blue-800",
        Assigned: "bg-sky-100 text-sky-800",
        OnTheWay: "bg-yellow-100 text-yellow-800",
        Picked: "bg-amber-100 text-amber-800",
        Returned: "bg-red-100 text-red-800",
        Delivered: "bg-green-100 text-green-800",
    }
    const cls = styles[status] ?? "bg-gray-100 text-gray-800"
    return <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${cls}`}>{status}</span>
}

const PaymentBadge = ({ status }: { status: string }) => {
    const normalized = status || "N/A"
    const styles: Record<string, string> = {
        Paid: "bg-green-100 text-green-800",
        Pending: "bg-yellow-100 text-yellow-800",
        "N/A": "bg-gray-100 text-gray-800",
    }
    const cls = styles[normalized] ?? styles["N/A"]
    return <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${cls}`}>{normalized}</span>
}

const PriorityPill = ({ priority }: { priority: string }) => {
    const styles: Record<string, string> = {
        High: "bg-red-100 text-red-800",
        Medium: "bg-orange-100 text-orange-800",
        Low: "bg-gray-100 text-gray-800",
    }
    const text = priority || "-"
    const cls = styles[text] ?? "bg-gray-100 text-gray-800"
    return <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${cls}`}>{text}</span>
}

type SortableHeaderProps = {
    label: string
    sortKey: SortKey
    sortBy: SortKey
    sortDir: "asc" | "desc"
    onSort: (key: SortKey) => void
    className?: string
}

const SortableHeader = ({ label, sortKey, sortBy, sortDir, onSort, className = "" }: SortableHeaderProps) => {
    const active = sortBy === sortKey
    return (
        <th scope="col" className={`${className} select-none`}>
            <button
                type="button"
                onClick={() => onSort(sortKey)}
                className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-gray-700 hover:text-gray-900"
            >
                <span>{label}</span>
                {active && <span>{sortDir === "asc" ? "▲" : "▼"}</span>}
            </button>
        </th>
    )
}

const Field = ({ label, value }: { label: string; value: any }) => (
    <div>
        <div className="font-medium text-gray-500">{label}</div>
        <div className="break-words">{value ?? "-"}</div>
    </div>
)

// Simple view modal (shows all fields)
const OrderViewModal = ({ order, onClose }: { order: OrderType | null, onClose: () => void }) => {
    if (!order) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[90vw] max-w-3xl rounded bg-white p-4 shadow">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Order #{order.orderNumber}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                    <Field label="Order #" value={order.orderNumber} />
                    <Field label="Date" value={new Date(order.deliveryDate).toUTCString().slice(0,16)} />
                    <Field label="Name" value={order.cname} />
                    <Field label="Phone" value={order.cphone} />
                    <div className="col-span-2">
                        <Field label="Address" value={order.address} />
                    </div>
                    <Field label="Priority" value={order.priority} />
                    <Field label="Payment Status" value={order.paymentStatus ?? "N/A"} />
                    <div className="col-span-2">
                        <Field label="Items Detail" value={order.itemsDetail ?? "-"} />
                    </div>
                    <div className="col-span-2">
                        <Field label="Instructions" value={order.specialInstructions ?? "-"} />
                    </div>
                    <Field label="Assign To" value={order.driverName ?? "-"} />
                    <Field label="Status" value={order.currentStatus} />
                </div>
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="rounded border border-gray-300 px-3 py-1 text-sm">Close</button>
                </div>
            </div>
        </div>
    )
}

// Simple edit modal shell (sends request only)
const OrderEditModal = ({ order, onClose, onSubmit }: { order: OrderType, onClose: () => void, onSubmit: (payload: Partial<OrderType>) => Promise<void> }) => {
    if (!order) return null
    const handleSubmit = async () => {
        await onSubmit({ orderId: order.orderId })
        onClose()
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[90vw] max-w-md rounded bg-white p-4 shadow">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Edit Order #{order.orderNumber}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <p className="text-sm text-gray-600 mb-3">This will only send an update request. Backend implementation is pending.</p>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="rounded border border-gray-300 px-3 py-1 text-sm">Cancel</button>
                    <button onClick={handleSubmit} className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">Send Request</button>
                </div>
            </div>
        </div>
    )
}