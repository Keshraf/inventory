import SingleEditOrder from "@/components/Modal/SingleEditOrder";
import useGetOrders from "@/hooks/useGetOrders";
import useGetStocks from "@/hooks/useGetStocks";
import { useAppSelector } from "@/store";
import { cn } from "@/utils/cn";
import { useMemo, useRef, useState } from "react";
import BulkEditOrder from "../Modal/BulkEditOrder";
import { databaseId, databases, ordersCollection } from "@/utils/client";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import ScrollToTopButton from "../Buttons/ScrollToTopButton";

type Tab = "Pending" | "Billed" | "Shipped";

export default function OrdersTable() {
  const checkbox = useRef(null);

  const [editModal, setEditModal] = useState(false);
  const [bulkEditModal, setBulkEditModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [singleEditOrder, setSingleEditOrder] = useState({
    id: "",
    orderId: "",
    status: "Pending",
    quantity: 0,
    rate: 0,
  });

  const search = useAppSelector((state) => state.search);
  const date = useAppSelector((state) =>
    new Date(JSON.parse(state.date)).toLocaleDateString("in")
  );

  const { data, isError, isLoading } = useGetStocks(date);
  const {
    data: ordersData,
    isError: isOrdersError,
    isLoading: isOrdersLoading,
  } = useGetOrders(date);

  function toggleAll() {
    if (!isLoading && ordersData) {
      setSelectedPeople((prev) => {
        const allOrders = finalOrderData.map((order) => order.order).flat();
        if (prev.length >= allOrders.length) {
          setChecked(false);
          return [];
        } else {
          setChecked(true);
          return allOrders.map((s) => s.id);
        }
      });
    }
  }

  const finalOrderData = useMemo(() => {
    if (isLoading || isOrdersLoading || !ordersData || !data) return [];

    const finalOrder: any[] = [];

    ordersData.forEach((order) => {
      const filtered = finalOrder.findIndex(
        (o) =>
          o.billingClient === order.billingClient &&
          o.shippingClient === order.shippingClient &&
          o.billingAddress === order.billingAddress &&
          o.shippingAddress === order.shippingAddress
      );

      const stock = data.find((stock) => stock.$id === order.stockId);
      const orderDetails = {
        id: order.$id,
        orderId: order.orderId,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        date: order.dateAdded,
        mill: stock?.mill,
        quality: stock?.quality,
        size: stock?.breadth + " X " + stock?.length,
        weight: stock?.weight,
        gsm: stock?.gsm,
        sheets: stock?.sheets,
        quantity: order.quantity,
        user: order.user,
        rate: order.rate,
      };

      if (filtered !== -1) {
        finalOrder[filtered].order.push(orderDetails);
      } else {
        finalOrder.push({
          billingClient: order.billingClient,
          shippingClient: order.shippingClient,
          billingAddress: order.billingAddress,
          shippingAddress: order.shippingAddress,
          order: [orderDetails],
        });
      }
    });

    return finalOrder.filter((item) => {
      const stockSentence = `${item.billingClient} ${item.shippingClient} 
      ${item.order.reduce((acc: any, order: any) => {
        return acc + order.orderId;
      }, "")}
      `;
      return stockSentence.toLowerCase().includes(search.toLowerCase());
    });
  }, [ordersData, data, isLoading, isOrdersLoading, search]);

  if (isLoading || isOrdersLoading || !ordersData || !data) return <></>;

  const headers = [
    "Order ID",
    "Status",
    "Date",
    "Mill",
    "Quality",
    "Size",
    "Weight",
    "GSM",
    "Sheets",
    "Quantity",
    "Rate",
  ];

  const deleteAll = async () => {
    try {
      for (let i = 0; i < selectedPeople.length; i++) {
        await databases.deleteDocument(
          databaseId,
          ordersCollection,
          selectedPeople[i]
        );
      }
      setSelectedPeople([]);
      setChecked(false);
      mutate(["/api/orders", date]);
      toast.success("Deleted all orders.");
    } catch (error) {
      setSelectedPeople([]);
      setChecked(false);
      toast.error("Unable to delete all orders.");
    }
  };

  return (
    <>
      <SingleEditOrder
        open={editModal}
        setOpen={setEditModal}
        data={singleEditOrder}
      />
      <BulkEditOrder
        open={bulkEditModal}
        setOpen={setBulkEditModal}
        data={selectedPeople}
      />
      <ScrollToTopButton />
      <div className="sm:px-0 lg:px-0">
        <div className="px-4 py-2 mt-3 flow-root bg-white ring-1 ring-gray-300 sm:rounded-lg overflow-hidden">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="relative">
                {selectedPeople.length > 0 && (
                  <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                    <button
                      type="button"
                      className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                      onClick={() => setBulkEditModal(true)}
                    >
                      Bulk edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                      onClick={deleteAll}
                    >
                      Delete all
                    </button>
                    <div className="inline-flex items-center rounded bg-indigo-500 px-2 py-1 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-indigo-300 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white cursor-default">
                      {selectedPeople.length} selected
                    </div>
                  </div>
                )}
                <table className="min-w-full table-fixed divide-y divide-gray-300 bg-white">
                  <thead className="divide-y divide-gray-200">
                    <tr>
                      <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          ref={checkbox}
                          checked={checked}
                          onChange={toggleAll}
                        />
                      </th>
                      {headers.map((header) => (
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          key={header}
                        >
                          {header}
                        </th>
                      ))}
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {finalOrderData.map((order) => {
                      return (
                        <>
                          <tr className="border-t border-gray-200">
                            <th
                              colSpan={6}
                              scope="colgroup"
                              className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-3"
                            >
                              {order.billingClient}
                              <span className="ml-1 text-gray-500 font-light">
                                {`- ${order.billingAddress}`}
                              </span>
                            </th>
                            <th
                              colSpan={7}
                              scope="colgroup"
                              className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-3"
                            >
                              {order.shippingClient}
                              <span className="ml-1 text-gray-500 font-light">
                                {`- ${order.shippingAddress}`}
                              </span>
                            </th>
                          </tr>
                          {order.order.map((stock: any) => {
                            return (
                              <>
                                <tr
                                  key={stock.id}
                                  className={
                                    selectedPeople.includes(stock.id)
                                      ? "bg-gray-50"
                                      : undefined
                                  }
                                >
                                  <td className="relative px-7 sm:w-12 sm:px-6">
                                    {selectedPeople.includes(stock.id) && (
                                      <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                                    )}
                                    <input
                                      type="checkbox"
                                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                      value={stock.id}
                                      checked={selectedPeople.includes(
                                        stock.id
                                      )}
                                      onChange={(e) =>
                                        setSelectedPeople((prev) => {
                                          if (prev.includes(stock.id)) {
                                            return prev.filter(
                                              (p) => p !== stock.id
                                            );
                                          } else {
                                            return [...prev, stock.id];
                                          }
                                        })
                                      }
                                    />
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {stock.orderId}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <span
                                      className={cn(
                                        "inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600",
                                        {
                                          "bg-green-100 text-green-700":
                                            stock.status === "Shipped",
                                          "bg-gray-100 text-gray-600":
                                            stock.status === "Pending",
                                          "bg-blue-100 text-blue-700":
                                            stock.status === "Billed",
                                        }
                                      )}
                                    >
                                      {stock.status}
                                    </span>
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {stock.date}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {stock.mill}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {stock.quality}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {stock.size}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {stock.weight} KG
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {stock.gsm} G
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {stock.sheets} S
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-semibold">
                                    {stock.quantity} PKTS
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    ₹{stock.rate}
                                  </td>
                                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                    <button
                                      className="text-indigo-600 hover:text-indigo-900"
                                      onClick={() => {
                                        setEditModal(true);
                                        setSingleEditOrder({
                                          id: stock.id,
                                          orderId: stock.orderId,
                                          status: stock.status,
                                          quantity: stock.quantity,
                                          rate: stock.rate,
                                        });
                                      }}
                                    >
                                      Edit
                                      <span className="sr-only">
                                        , {stock.$id}
                                      </span>
                                    </button>
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
