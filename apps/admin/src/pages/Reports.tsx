import { useEffect, useMemo, useRef, useState } from "react"
import { getPathsWithOrdersReportAPI, PathWithOrdersReport, getDriversAPI } from "../services/ApiService"
import { useRecoilValue } from "recoil"
import { token } from "../store/atoms/tokenAtom"
import { convertToUTC } from "../utils/UTCdate"

type PresetRange = "today" | "last7" | "thisMonth" | "custom"

const toYYYYMMDDUTC = (d: Date) => {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const startOfToday = () => convertToUTC(new Date())
const endOfToday = () => convertToUTC(new Date())
const startOfMonth = (d: Date) => convertToUTC(new Date(d.getFullYear(), d.getMonth(), 1))
const endOfMonth = (d: Date) => convertToUTC(new Date(d.getFullYear(), d.getMonth()+1, 0))

const Reports = () => {
  const tokenValue = useRecoilValue(token)
  const [range, setRange] = useState<PresetRange>("today")
  const [startDate, setStartDate] = useState<Date>(startOfToday())
  const [endDate, setEndDate] = useState<Date>(endOfToday())
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<PathWithOrdersReport[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<{ driverName: string; orders: PathWithOrdersReport["orders"] } | null>(null)
  const [drivers, setDrivers] = useState<Array<{uid:string; name:string}>>([])
  const [driverFilter, setDriverFilter] = useState<string>("")
  const startInputRef = useRef<HTMLInputElement>(null)
  const endInputRef = useRef<HTMLInputElement>(null)

  const label = useMemo(() => {
    return `${toYYYYMMDDUTC(startDate)} - ${toYYYYMMDDUTC(endDate)}`
  }, [startDate, endDate])

  useEffect(() => {
    if (!tokenValue) return
    setLoading(true)
    setError(null)
    getPathsWithOrdersReportAPI(startDate, endDate).then((resp: any) => {
      setData(resp as PathWithOrdersReport[])
    }).catch(() => setError("Failed to load report")).finally(() => setLoading(false))
  }, [tokenValue, startDate.getTime(), endDate.getTime()])

  useEffect(() => {
    if (!tokenValue) return
    getDriversAPI().then((resp: any) => {
      // resp likely array of drivers with fields { uid, name }
      const list = Array.isArray(resp) ? resp : []
      setDrivers(list)
    }).catch(() => {})
  }, [tokenValue])

  const groupedByDriver = useMemo(() => {
    const filtered = data.filter(r => driverFilter === "" || (r.driverName || "-") === driverFilter)
    // Map of driverName -> Map of orderId -> order, and count of paths
    const driverToOrders = new Map<string, Map<string, any>>()
    const driverPathCounts = new Map<string, number>()
    
    for (const row of filtered) {
      const driverName = row.driverName || '-'
      if (!driverToOrders.has(driverName)) {
        driverToOrders.set(driverName, new Map())
        driverPathCounts.set(driverName, 0)
      }
      const ordersMap = driverToOrders.get(driverName)!
      // Count this path
      driverPathCounts.set(driverName, driverPathCounts.get(driverName)! + 1)
      
      for (const o of row.orders || []) {
        ordersMap.set(o.orderId, { ...o, driverName })
      }
    }
    
    const rows: Array<{ driverName: string; orders: any[]; routeCount: number }> = []
    for (const [driverName, ordersMap] of driverToOrders.entries()) {
      rows.push({ 
        driverName, 
        orders: Array.from(ordersMap.values()),
        routeCount: driverPathCounts.get(driverName) || 0
      })
    }
    return rows.sort((a,b) => a.driverName.localeCompare(b.driverName))
  }, [data, driverFilter])

  const downloadCSV = (filename: string, rows: string[][]) => {
    const escapeCSV = (val: any) => {
      const s = (val ?? "").toString().replace(/"/g, '""')
      return `"${s}"`
    }
    const content = rows.map(r => r.map(escapeCSV).join(',')).join('\n')
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportSelectedToCSV = () => {
    if (!selectedGroup) return
    const headers = ["Order", "Date", "Driver", "Customer", "Phone", "Address", "Items", "Special Instructions"]
    const rows = [headers]
    for (const o of selectedGroup.orders) {
              rows.push([
          o.orderNumber || o.orderId,
          toYYYYMMDDUTC(new Date(o.deliveryDate || new Date())),
          (o as any).driverName || '',
        o.cname,
        o.cphone,
        o.address,
        o.itemsDetail || '',
        o.specialInstructions || ''
      ])
    }
    const nameSuffix = driverFilter ? `_${driverFilter}` : ''
    downloadCSV(`orders_${selectedGroup.driverName}${nameSuffix}.csv`, rows)
  }

  const exportSelectedToPDF = () => {
    if (!selectedGroup) return
    const w = window.open('', '_blank', 'width=1000,height=800')
    if (!w) return
    const styles = `
      <style>
        body { font-family: Arial, sans-serif; padding: 16px; }
        h1 { font-size: 18px; margin: 0 0 8px; }
        p { margin: 0 0 12px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; vertical-align: top; }
        thead { background: #f5f5f5; }
      </style>
    `
    const header = `<h1>Orders</h1><p>Driver: ${selectedGroup.driverName}</p>`
    const rows = selectedGroup.orders.map(o => (
      `<tr>
        <td>${(o.orderNumber || o.orderId) ?? ''}</td>
        <td style="white-space: nowrap;">${toYYYYMMDDUTC(new Date(o.deliveryDate || new Date()))}</td>
        <td>${((o as any).driverName) ?? ''}</td>
        <td>${o.cname ?? ''}</td>
        <td>${o.cphone ?? ''}</td>
        <td>${o.address ?? ''}</td>
        <td>${o.itemsDetail ?? ''}</td>
        <td>${o.specialInstructions ?? ''}</td>
      </tr>`
    )).join('')
    const table = `
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Date</th>
            <th>Driver</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Items</th>
            <th>Special Instructions</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `
    w.document.write(`<!doctype html><html><head><meta charset='utf-8'/>${styles}</head><body>${header}${table}</body></html>`)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 200)
  }

  const onPresetChange = (value: PresetRange) => {
    setRange(value)
    const now = new Date()
    if (value === "today") { setStartDate(startOfToday()); setEndDate(endOfToday()); return }
    if (value === "last7") { const end = endOfToday(); const start = new Date(end); start.setUTCDate(start.getUTCDate() - 6); setStartDate(convertToUTC(start)); setEndDate(end); return }
    if (value === "thisMonth") { setStartDate(startOfMonth(now)); setEndDate(endOfMonth(now)); return }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Reports</h1>
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:flex-nowrap md:items-center md:gap-3">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => onPresetChange("today")} className={`px-2 py-1 rounded border text-sm ${range==="today"?"bg-blue-600 text-white":"bg-white"}`}>Today</button>
          <button onClick={() => onPresetChange("last7")} className={`px-2 py-1 rounded border text-sm ${range==="last7"?"bg-blue-600 text-white":"bg-white"}`}>Last 7 days</button>
          <button onClick={() => onPresetChange("thisMonth")} className={`px-2 py-1 rounded border text-sm ${range==="thisMonth"?"bg-blue-600 text-white":"bg-white"}`}>This month</button>
          <button onClick={() => setRange("custom")} className={`px-2 py-1 rounded border text-sm ${range==="custom"?"bg-blue-600 text-white":"bg-white"}`}>Custom</button>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="border rounded w-36 h-8 flex items-center cursor-pointer"
            role="button"
            onClick={() => {
              const el = startInputRef.current as any
              if (el?.showPicker) el.showPicker(); else startInputRef.current?.focus()
            }}
          >
            <input
              ref={startInputRef}
              type="date"
              value={toYYYYMMDDUTC(startDate)}
              onChange={(e)=>setStartDate(new Date(`${e.target.value}T00:00:00.000Z`))}
              className="px-2 h-8 text-sm rounded w-full outline-none border-0"
              onKeyDown={(e)=>e.preventDefault()}
              onKeyPress={(e)=>e.preventDefault()}
              onPaste={(e)=>e.preventDefault()}
              onDrop={(e)=>e.preventDefault()}
            />
          </div>
          <div
            className="border rounded w-36 h-8 flex items-center cursor-pointer"
            role="button"
            onClick={() => {
              const el = endInputRef.current as any
              if (el?.showPicker) el.showPicker(); else endInputRef.current?.focus()
            }}
          >
            <input
              ref={endInputRef}
              type="date"
              value={toYYYYMMDDUTC(endDate)}
              onChange={(e)=>setEndDate(new Date(`${e.target.value}T00:00:00.000Z`))}
              className="px-2 h-8 text-sm rounded w-full outline-none border-0"
              onKeyDown={(e)=>e.preventDefault()}
              onKeyPress={(e)=>e.preventDefault()}
              onPaste={(e)=>e.preventDefault()}
              onDrop={(e)=>e.preventDefault()}
            />
          </div>
        </div>
        <div>
          <select className="border px-2 h-8 text-sm rounded w-48" value={driverFilter} onChange={(e)=>setDriverFilter(e.target.value)}>
            <option value="">All Drivers</option>
            {drivers.map(d => (
              <option key={d.uid} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="ml-auto text-right text-xs md:text-sm text-gray-600 whitespace-nowrap">{label}</div>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Date Range</th>
              <th className="text-left p-2">Driver</th>
              <th className="text-right p-2">Routes</th>
              <th className="text-right p-2">Orders</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="p-4">Loading...</td></tr>}
            {error && <tr><td colSpan={5} className="p-4 text-red-600">{error}</td></tr>}
            {!loading && !error && groupedByDriver.length===0 && <tr><td colSpan={5} className="p-4">No data</td></tr>}
            {groupedByDriver.map((g) => (
              <tr key={g.driverName} className="border-t">
                <td className="p-2">{toYYYYMMDDUTC(startDate)} - {toYYYYMMDDUTC(endDate)}</td>
                <td className="p-2">{g.driverName}</td>
                <td className="p-2 text-right">{g.routeCount}</td>
                <td className="p-2 text-right">{g.orders.length}</td>
                <td className="p-2 text-right">
                  <button className="px-2 py-1 border rounded" onClick={() => setSelectedGroup(g)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedGroup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-xl max-w-3xl w-full m-4">
            <div className="p-4 border-b flex flex-wrap gap-2 justify-between items-center">
              <div>
                <div className="font-semibold">Orders</div>
                <div className="text-sm text-gray-600">Driver: {selectedGroup.driverName}</div>
                <div className="text-xs text-gray-600">Date Range: {toYYYYMMDDUTC(startDate)} - {toYYYYMMDDUTC(endDate)}</div>
              </div>
              <div className="flex gap-2 ml-auto">
                <button className="px-2 py-1 border rounded" onClick={exportSelectedToCSV}>Export CSV</button>
                <button className="px-2 py-1 border rounded" onClick={exportSelectedToPDF}>Export PDF</button>
                <button className="px-2 py-1 border rounded" onClick={() => setSelectedGroup(null)}>Close</button>
              </div>
            </div>
            <div className="p-4 max-h-[70vh] overflow-auto">
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div className="font-medium">Date Range: {toYYYYMMDDUTC(startDate)} - {toYYYYMMDDUTC(endDate)}</div>
              </div>
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Order</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Driver</th>
                    <th className="text-left p-2">Customer</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">Address</th>
                    <th className="text-left p-2">Items</th>
                    <th className="text-left p-2">Special Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedGroup.orders && selectedGroup.orders.length > 0 ? selectedGroup.orders.map((o) => (
                    <tr key={o.orderId} className="border-t">
                      <td className="p-2">{o.orderNumber || o.orderId}</td>
                      <td className="p-2 whitespace-nowrap">{toYYYYMMDDUTC(new Date(o.deliveryDate || new Date()))}</td>
                      <td className="p-2">{(o as any).driverName || '-'}</td>
                      <td className="p-2">{o.cname}</td>
                      <td className="p-2">{o.cphone}</td>
                      <td className="p-2">{o.address}</td>
                      <td className="p-2">{o.itemsDetail || '-'}</td>
                      <td className="p-2 max-w-[260px] whitespace-pre-wrap break-words">{o.specialInstructions || '-'}</td>
                    </tr>
                  )) : (
                    <tr><td className="p-4" colSpan={8}>No orders</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports

