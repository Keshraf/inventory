import useGetClients from "@/hooks/useGetClients";
import useGetStocks from "@/hooks/useGetStocks";
import { useAppSelector } from "@/store";
import { cn } from "@/utils/cn";
import { useRef, useState } from "react";

export default function ClientsTable() {
  const checkbox = useRef(null);
  const [checked, setChecked] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const date = useAppSelector((state) => new Date(JSON.parse(state.date)));

  const { data, isError, isLoading } = useGetClients();

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

  const headers = ["Name", "Mobile", "Address"];

  return (
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
                  {!isLoading &&
                    data?.map((stock) => (
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
                          {stock.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {stock.mobile}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {stock.address}
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
  );
}
