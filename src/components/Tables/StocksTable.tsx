import useGetOrders from "@/hooks/useGetOrders";
import useGetStocks from "@/hooks/useGetStocks";
import { useAppSelector } from "@/store";
import { cn } from "@/utils/cn";
import { useMemo, useRef, useState } from "react";
import SingleEditStock from "../Modal/SingleEditStock";
import ConfirmOrderModal from "../Modal/ConfirmOrderModal";
import {
  databaseId,
  databases,
  functions,
  functionsId,
  stocksCollection,
} from "@/utils/client";
import ScrollToTopButton from "../Buttons/ScrollToTopButton";
import { toast } from "react-hot-toast";
import { mutate } from "swr";

type OrderDetails = {
  id: string;
  quantity: number;
  rate: number;
};

export default function StocksTable() {
  const checkbox = useRef(null);

  const [checked, setChecked] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);
  const [editStock, setEditStock] = useState<any>(null);
  const [orderMode, setOrderMode] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);

  const search = useAppSelector((state) => state.search);
  const date = useAppSelector((state) =>
    new Date(JSON.parse(state.date)).toLocaleDateString("in")
  );

  const { data, isError, isLoading } = useGetStocks(date);

  const {
    data: orderData,
    isError: isOrderError,
    isLoading: isOrderLoading,
  } = useGetOrders(date);

  const reduced = useMemo(
    () =>
      data
        ?.map((stock) => {
          const orderQuantity = orderData
            ?.filter((order) => order.stockId === stock.$id)
            .reduce((acc, order) => {
              return acc + order.quantity;
            }, 0);

          return {
            ...stock,
            quantity: stock.quantity - (orderQuantity || 0),
            mill: stock.mill,
            quality: stock.quality,
            breadth: stock.breadth,
            length: stock.length,
            weight: stock.weight,
            gsm: stock.gsm,
            sheets: stock.sheets,
            stockQuantity: stock.quantity,
          };
        })
        .filter((item) => {
          const stockSentence = `${item.mill} ${item.quality} ${item.breadth} X ${item.length} ${item.mill} ${item.quality} ${item.breadth}X${item.length} ${item.weight}KG ${item.gsm}G ${item.sheets} S`;
          return stockSentence.toLowerCase().includes(search.toLowerCase());
        }),
    [data, orderData, search]
  );

  function toggleAll() {
    if (!isLoading && data) {
      setSelectedPeople((prev) => {
        if (prev.length === data.length) {
          setChecked(false);
          return [];
        } else {
          setChecked(true);
          return data.map((s) => s.$id);
        }
      });
    }
  }

  if (isLoading || isOrderLoading || !data || !orderData) {
    return <></>;
  }

  const headers = [
    "Mill",
    "Quality",
    "Size",
    "Weight",
    "GSM",
    "Sheets",
    "Quantity",
  ];

  const orderModeHandler = (mode: boolean) => {
    setOrderMode(!mode);

    if (!mode && reduced) {
      setOrderDetails(
        reduced.map((stock) => {
          return {
            id: stock.$id,
            quantity: 0,
            rate: 0,
          };
        })
      );
    } else {
      setOrderDetails([]);
    }
  };

  const changeOrderQuantity = (id: string, quantity: number) => {
    setOrderDetails((prev) => {
      return prev.map((order) => {
        if (order.id === id) {
          return {
            ...order,
            quantity,
          };
        } else {
          return order;
        }
      });
    });
  };

  const changeOrderRate = (id: string, rate: number) => {
    setOrderDetails((prev) => {
      return prev.map((order) => {
        if (order.id === id) {
          return {
            ...order,
            rate,
          };
        } else {
          return order;
        }
      });
    });
  };

  const confirmOrder = async () => {
    setOpenOrder(true);
  };

  const deleteHandler = async () => {
    try {
      for (let i = 0; i < selectedPeople.length; i++) {
        if (i > 20) continue;
        await databases.deleteDocument(
          databaseId,
          stocksCollection,
          selectedPeople[i]
        );
      }
      setSelectedPeople([]);
      setChecked(false);
      mutate(["/api/stocks", date]);
      toast.success("Deleted all selected stocks.");
    } catch (error) {
      setSelectedPeople([]);
      setChecked(false);
      toast.error("Unable to delete all orders.");
    }
  };

  return (
    <>
      <ConfirmOrderModal
        data={orderDetails.filter((order) => order.quantity > 0)}
        open={openOrder}
        setOpen={setOpenOrder}
      />
      <ScrollToTopButton />
      <SingleEditStock open={open} setOpen={setOpen} data={editStock} />
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
                      onClick={() => orderModeHandler(orderMode)}
                    >
                      {orderMode ? "Cancel" : "Order"}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                      onClick={deleteHandler}
                    >
                      Delete all
                    </button>
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
                      {orderMode && (
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          key={"rate"}
                        >
                          {"Rate"}
                        </th>
                      )}
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {!isLoading &&
                      reduced?.map((stock) => {
                        if (orderMode && !selectedPeople.includes(stock.$id))
                          return null;

                        return (
                          <tr
                            key={stock.$id}
                            className={
                              selectedPeople.includes(stock.$id)
                                ? "bg-gray-50"
                                : undefined
                            }
                          >
                            <td className="relative px-7 sm:w-12 sm:px-6">
                              {selectedPeople.includes(stock.$id) && (
                                <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                              )}
                              <input
                                tabIndex={orderMode ? -1 : 0}
                                type="checkbox"
                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                value={stock.$id}
                                checked={selectedPeople.includes(stock.$id)}
                                onChange={(e) =>
                                  setSelectedPeople((prev) => {
                                    if (prev.includes(stock.$id)) {
                                      return prev.filter(
                                        (p) => p !== stock.$id
                                      );
                                    } else {
                                      return [...prev, stock.$id];
                                    }
                                  })
                                }
                              />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {stock.mill}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {stock.quality}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {stock.breadth + " X " + stock.length}
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
                            {orderMode ? (
                              <>
                                <td className="whitespace-nowrap min-w-32 w-56 px-3 py-2 text-sm text-gray-500 flex flex-row justify-between items-center align-middle ">
                                  <input
                                    type="number"
                                    className="block min-w-[80%] rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={
                                      orderDetails.find(
                                        (s) => s.id === stock.$id
                                      )?.quantity
                                    }
                                    max={stock.quantity}
                                    min={0}
                                    onChange={(e) => {
                                      if (
                                        Number(e.target.value) > stock.quantity
                                      ) {
                                        e.target.value =
                                          stock.quantity.toString();
                                        changeOrderQuantity(
                                          stock.$id,
                                          stock.quantity
                                        );
                                      } else {
                                        changeOrderQuantity(
                                          stock.$id,
                                          Number(e.target.value)
                                        );
                                      }
                                    }}
                                    onBlur={(e) => {
                                      if (
                                        Number(e.target.value) < 0 ||
                                        !e.target.value ||
                                        e.target.value === ""
                                      ) {
                                        e.target.value = "0";
                                        changeOrderQuantity(stock.$id, 0);
                                      }
                                    }}
                                  />
                                  <div>
                                    <p className="text-xs text-black">MAX</p>
                                    <p className="text-indigo-500">
                                      {stock.quantity}
                                    </p>
                                  </div>
                                </td>

                                <td className="whitespace-nowrap min-w-32 w-40 px-3 text-sm text-gray-500">
                                  <input
                                    type="number"
                                    className="block min-w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={
                                      orderDetails.find(
                                        (s) => s.id === stock.$id
                                      )?.rate
                                    }
                                    min={0}
                                    onChange={(e) => {
                                      changeOrderRate(
                                        stock.$id,
                                        Number(e.target.value)
                                      );
                                    }}
                                    onBlur={(e) => {
                                      if (
                                        Number(e.target.value) < 0 ||
                                        !e.target.value ||
                                        e.target.value === ""
                                      ) {
                                        e.target.value = "0";
                                        changeOrderRate(stock.$id, 0);
                                      }
                                    }}
                                  />
                                </td>
                              </>
                            ) : (
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {stock.quantity} PKTS
                              </td>
                            )}

                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                              <button
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={() => {
                                  setEditStock({ ...stock, id: stock.$id });
                                  setOpen(true);
                                }}
                                tabIndex={orderMode ? -1 : 0}
                              >
                                Edit
                                <span className="sr-only">, {stock.$id}</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {orderMode && (
          <button
            type="button"
            className="sm:rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full mt-2"
            onClick={confirmOrder}
          >
            Confirm Order
          </button>
        )}
      </div>
    </>
  );
}
