import useGetOrders from "@/hooks/useGetOrders";
import useGetStocks from "@/hooks/useGetStocks";
import { cn } from "@/utils/cn";
import { useLayoutEffect, useRef, useState } from "react";

const tabs = [
  { name: "Pending", href: "#", current: false },
  { name: "Billed", href: "#", current: false },
  { name: "Shipped", href: "#", current: true },
];

type Tab = "Pending" | "Billed" | "Shipped";

export default function OrdersTable() {
  const checkbox = useRef(null);
  const [checked, setChecked] = useState(false);
  const [currentTab, setCurrentTab] = useState<Tab>("Pending");
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  const allTabs: Tab[] = ["Pending", "Billed", "Shipped"];

  const { data, isError, isLoading } = useGetStocks();

  function toggleAll() {
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

  console.log("Prder", data);

  const headers = [
    "Mill",
    "Quality",
    "Size",
    "Weight",
    "GSM",
    "Sheets",
    "Quantity",
  ];

  return (
    <>
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full sm:rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-black mt-3"
            value={currentTab}
            onChange={(e) => setCurrentTab(e.target.value as Tab)}
          >
            {allTabs.map((tab) => (
              <option key={tab}>{tab}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block my-4">
          <nav className="flex space-x-4" aria-label="Tabs">
            {allTabs.map((tab) => (
              <button
                onClick={() => setCurrentTab(tab)}
                key={tab}
                className={cn(
                  tab === currentTab
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:text-gray-700",
                  "rounded-md px-3 py-2 text-sm font-medium"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/*  */}
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
                    >
                      Bulk edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
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
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr className="border-t border-gray-200">
                      <th
                        colSpan={7}
                        scope="colgroup"
                        className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                      >
                        {"Ketan Saraf"}
                        <span className="ml-1 text-gray-500 font-light">
                          {"- H-20, New Alipore, Kolkata, West Bengal, 700053"}
                        </span>
                      </th>
                      <th
                        colSpan={4}
                        scope="colgroup"
                        className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                      >
                        {"Ketan Saraf"}
                        <span className="ml-1 text-gray-500 font-light">
                          {"- H-20, New Alipore, Kolkata, West Bengal, 700053"}
                        </span>
                      </th>
                    </tr>
                    {!isLoading &&
                      data.map((stock) => (
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
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              value={stock.$id}
                              checked={selectedPeople.includes(stock.$id)}
                              onChange={(e) =>
                                setSelectedPeople((prev) => {
                                  if (prev.includes(stock.$id)) {
                                    return prev.filter((p) => p !== stock.$id);
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
                            {stock.breadth + "X" + stock.length}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {stock.weigth}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {stock.gsm}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {stock.sheets}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {stock.quantity}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              Edit<span className="sr-only">, {stock.$id}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
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
