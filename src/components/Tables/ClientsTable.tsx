import useGetClients from "@/hooks/useGetClients";
import useGetStocks from "@/hooks/useGetStocks";
import { useAppSelector } from "@/store";
import { cn } from "@/utils/cn";
import { useMemo, useRef, useState } from "react";
import ScrollToTopButton from "../Buttons/ScrollToTopButton";
import { clientsCollection, databaseId, databases } from "@/utils/client";
import { mutate } from "swr";
import { toast } from "react-hot-toast";
import SingleEditClient from "../Modal/SingleEditClient";
import {
  removeAllSpecialCharacters,
  removeSpecialCharacters,
} from "@/utils/helper";

type Client = {
  id: string;
  name: string;
  mobile: string;
  address: string[];
};

export default function ClientsTable() {
  const checkbox = useRef(null);
  const [checked, setChecked] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client>({
    id: "",
    name: "",
    mobile: "",
    address: [],
  });
  const date = useAppSelector((state) => new Date(JSON.parse(state.date)));
  const search = useAppSelector((state) => state.search);

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

  function uncheckAll() {
    setChecked(false);
    setSelectedPeople([]);
  }

  const finalClientData = useMemo(() => {
    if (!isLoading && data) {
      return data?.filter((client) => {
        const sentence = removeAllSpecialCharacters(
          `${client.name}`.toLowerCase()
        );
        const finalSearch = removeAllSpecialCharacters(search.toLowerCase());

        if (search.length === 1) {
          return sentence.startsWith(finalSearch.charAt(0));
        }

        return (
          sentence.includes(finalSearch) &&
          sentence.startsWith(finalSearch.charAt(0))
        );
      });
    } else {
      return [];
    }
  }, [search, data, isLoading]);

  const deleteAll = async () => {
    try {
      for (let i = 0; i < selectedPeople.length; i++) {
        await databases.deleteDocument(
          databaseId,
          clientsCollection,
          selectedPeople[i]
        );
      }
      setSelectedPeople([]);
      setChecked(false);
      mutate("/api/clients");
      toast.success("Deleted all selected clients.");
    } catch (error) {
      setSelectedPeople([]);
      setChecked(false);
      toast.error("Unable to delete all clients.");
    }
  };

  const headers = ["Name", "Mobile", "Address"];

  return (
    <>
      <SingleEditClient open={open} setOpen={setOpen} data={editClient} />
      <div className="sm:px-0 lg:px-0">
        <ScrollToTopButton />
        <div className="px-4 py-2 mt-3 flow-root bg-white ring-1 ring-gray-300 sm:rounded-lg overflow-hidden">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="relative">
                {selectedPeople.length > 0 && (
                  <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                    {selectedPeople.length === 1 && (
                      <button
                        type="button"
                        className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        onClick={() => {
                          const stock = finalClientData.find(
                            (s) => s.$id === selectedPeople[0]
                          );
                          if (!stock) return;
                          setEditClient({
                            id: stock.$id,
                            name: stock.name,
                            mobile: stock.mobile,
                            address: stock.address,
                          });
                          setOpen(true);
                        }}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      type="button"
                      className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                      disabled={selectedPeople.length === 0}
                      onClick={deleteAll}
                    >
                      Delete all
                    </button>
                    <div
                      className="inline-flex items-center rounded bg-indigo-500 px-2 py-1 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-indigo-300 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white cursor-pointer"
                      onClick={() => {
                        uncheckAll();
                      }}
                    >
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
                    {finalClientData.map((stock) => (
                      <tr
                        key={stock.$id}
                        className={
                          selectedPeople.includes(stock.$id)
                            ? "bg-gray-50 hover:bg-gray-100"
                            : "hover:bg-gray-50"
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
                          {removeSpecialCharacters(stock.name)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {stock.mobile}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {stock.address.map((a: string) => {
                            return (
                              <p className="my-[1px]" key={a}>
                                {a}
                              </p>
                            );
                          })}
                        </td>
                        <td
                          className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3"
                          onClick={() => {
                            setEditClient({
                              id: stock.$id,
                              name: stock.name,
                              mobile: stock.mobile,
                              address: stock.address,
                            });
                            setOpen(true);
                          }}
                        >
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
