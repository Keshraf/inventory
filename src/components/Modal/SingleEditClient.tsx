import { useAppSelector } from "@/store";
import {
  clientsCollection,
  databaseId,
  databases,
  ordersCollection,
} from "@/utils/client";
import { cn } from "@/utils/cn";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSWRConfig } from "swr";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: {
    id: string;
    name: string;
    mobile: string;
    address: string[];
  };
};

const SingleEditClient = ({ open, setOpen, data }: Props) => {
  const [name, setName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [address, setAddress] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState<string>("");
  const date = useAppSelector((state) =>
    new Date(JSON.parse(state.date)).toLocaleDateString("in")
  );
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (open) {
      setName(data.name);
      setMobile(data.mobile);
      setAddress(data.address);
    }
  }, [open, data]);

  const editOrder = async () => {
    try {
      await databases.updateDocument(databaseId, clientsCollection, data.id, {
        name,
        mobile,
        address,
      });
      toast.success("Edited Client");
      mutate("/api/clients");
      setOpen(false);
    } catch (error) {
      toast.error("Error editing client.");
    }
  };

  return (
    <>
      {open && (
        <section
          className={cn(
            "z-10 fixed top-0 flex flex-col items-center justify-center min-h-screen h-screen w-full min-w-full bg-gray-300 left-0 bg-opacity-50"
          )}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="w-96 h-auto min-h-[100px] bg-white rounded-lg shadow-lg gap-3 flex flex-col overflow-hidden py-4">
            <h2 className="text-base font-semibold leading-7 text-gray-900 bg-gray-100 px-4 py-2">
              Edit Order
            </h2>
            <div className="px-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="px-4">
              <label
                htmlFor="mobile"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Mobile
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="mobile"
                  id="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  placeholder="9831048224"
                />
              </div>
            </div>

            <div className="px-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Address
              </label>
              <ul role="list" className="mt-2 max-w-xl space-y-2 text-gray-600">
                {address.map((address, index) => (
                  <li key={index} className="flex items-center gap-x-3 text-xs">
                    <CheckCircleIcon
                      className=" h-4 w-4 flex items-center text-indigo-600"
                      aria-hidden="true"
                    />
                    <span>{address}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex flex-row gap-x-1">
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  placeholder="Address"
                />
                <button
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => {
                    setAddress([...address, newAddress]);
                    setNewAddress("");
                  }}
                >
                  <PlusIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mx-4"
              onClick={editOrder}
            >
              Confirm Edit
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default SingleEditClient;
