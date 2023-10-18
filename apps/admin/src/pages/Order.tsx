
import CreateOrder from "../components/CreateOrder.tsx";
import OrdersTable from "../components/OrdersTable.tsx";

const Order = () => {
  return (
    <>
      <div className="mt-4 pt-4 lg:grid md:grid-cols-12 md:ml-10">
        <div className="md:col-span-8">
          <div className="flex items-center flex-col">
            <div className="flex ">
              <p className="text-blue-900">Drivers at a glance</p>
            </div>
            <OrdersTable></OrdersTable>
          </div>
        </div>
        <div className="md:col-span-4 ">
          <CreateOrder></CreateOrder>
        </div>
      </div>
    </>
  )
}

export default Order


