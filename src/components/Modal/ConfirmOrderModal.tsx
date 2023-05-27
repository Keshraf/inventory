import useGetClients from "@/hooks/useGetClients";
import { useAppSelector } from "@/store";
import {
  databaseId,
  databases,
  ordersCollection,
  stocksCollection,
} from "@/utils/client";
import { cn } from "@/utils/cn";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Autocomplete } from "@mantine/core";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import Asterisk from "../UI/Asterisk";

type OrderDetails = {
  id: string;
  quantity: number;
  rate: number;
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: OrderDetails[];
};

const ConfirmOrderModal = ({ open, setOpen, data }: Props) => {
  const [orderId, setOrderId] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [clientAddress, setClientAddress] = useState<string>("");
  const [shippingClientName, setShippingClientName] = useState<string>("");
  const [shippingClientAddress, setShippingClientAddress] =
    useState<string>("");
  const date = useAppSelector((state) =>
    new Date(JSON.parse(state.date)).toLocaleDateString("in")
  );
  const user = useAppSelector((state) => state.user.name);
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const {
    data: clients,
    isLoading: clientsLoading,
    isError: clientsError,
  } = useGetClients();

  useEffect(() => {
    const year = Number(new Date().getFullYear().toString().slice(-2));
    const code =
      new Date().toLocaleTimeString().split(":").slice(0, 2).join(":") +
      "/" +
      date.split("/").slice(0, 2).join("-");
    setClientName("");
    setClientAddress("");
    setShippingClientName("");
    setShippingClientAddress("");
    setOrderId(`BE/${code}/${year}-${year + 1}/${user.split(" ")[0]}`);
  }, [open, user, date]);

  const confirmOrder = async () => {
    if (orderId.length === 0) {
      toast.error("Order Id cannot be empty");
      return;
    }
    if (clientName.length === 0) {
      toast.error("Client Name cannot be empty");
      return;
    }
    /* if (clientAddress.length === 0) {
      toast.error("Client Address cannot be empty");
      return;
    } */
    if (shippingClientName.length === 0) {
      toast.error("Shipping Client Name cannot be empty");
      return;
    }
    /* if (shippingClientAddress.length === 0) {
      toast.error("Shipping Client Address cannot be empty");
      return;
    } */

    try {
      for (let index = 0; index < data.length; index++) {
        await databases.createDocument(databaseId, ordersCollection, nanoid(), {
          stockId: data[index].id,
          orderId,
          billingClient: clientName,
          billingAddress: clientAddress,
          shippingClient: shippingClientName,
          shippingAddress: shippingClientAddress,
          quantity: data[index].quantity,
          dateAdded: date,
          rate: data[index].rate,
          user,
        });
      }

      toast.success("Ordered Stocks");
      mutate(["/api/stocks", date]);
      setOpen(false);
      router.push("/orders");
    } catch (error) {
      toast.error("Error ordering stocks.");
    }
  };

  const getClientNames = useMemo((): string[] => {
    if (clients) {
      return clients.map((client) => client.name);
    } else {
      return [];
    }
  }, [clients]);

  const getClientAddress = useCallback(
    (name: string): string[] => {
      if (clients) {
        const found = clients.find((client) => client.name === name);
        if (found) {
          return found.address;
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    [clients]
  );

  if (clientsLoading && !clients) return <></>;

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
          <div className="w-full sm:w-96 h-auto max-h-screen sm:max-h-[1000px] min-h-[100px] bg-white sm:rounded-lg shadow-lg gap-3 flex flex-col overflow-y-auto py-4">
            <div className="flex flex-row justify-end items-center text-base font-semibold leading-7 text-gray-900 bg-gray-100 px-4 py-2">
              <h2>Place Order</h2>
              <span className="ml-auto" onClick={() => setOpen(false)}>
                <XMarkIcon className="w-6 h-6 text-gray-600 stroke-2 hover:bg-gray-200 hover:text-gray-800 rounded-md p-1 cursor-pointer" />
              </span>
            </div>
            <div className="px-4">
              <label
                htmlFor="orderId"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {"Order Id"}
                <Asterisk />
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="orderId"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  placeholder="BE/1234/23-24"
                />
              </div>
            </div>
            <div className="px-4">
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                {"Client Name"}
                <Asterisk />
              </label>
              <Autocomplete
                id="clientName"
                value={clientName}
                limit={50}
                maxDropdownHeight={300}
                onChange={(value) => setClientName(value)}
                styles={{
                  input: {
                    border: "none",
                  },
                }}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 overflow-clip p-1"
                placeholder="Pick one"
                data={getClientNames}
              />
            </div>
            <div className="px-4">
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                {"Shipping Client Name"}
                <Asterisk />
              </label>
              <Autocomplete
                id="shippingClientName"
                value={shippingClientName}
                limit={50}
                maxDropdownHeight={300}
                onChange={(value) => setShippingClientName(value)}
                styles={{
                  input: {
                    border: "none",
                  },
                }}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 overflow-clip p-1"
                placeholder="Pick one"
                data={getClientNames}
              />
            </div>
            <div className="px-4">
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                {"Client Address"}
              </label>
              <Autocomplete
                id="clientAddress"
                value={clientAddress}
                onChange={(value) => setClientAddress(value)}
                limit={50}
                maxDropdownHeight={300}
                styles={{
                  input: {
                    border: "none",
                  },
                }}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 overflow-clip p-1"
                placeholder="Pick one"
                data={getClientAddress(clientName)}
              />
            </div>
            <div className="px-4">
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                {"Shipping Client Address"}
              </label>
              <Autocomplete
                id="shippingClientAddress"
                value={shippingClientAddress}
                limit={50}
                maxDropdownHeight={300}
                onChange={(value) => setShippingClientAddress(value)}
                styles={{
                  input: {
                    border: "none",
                  },
                }}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 overflow-clip p-1"
                placeholder="Pick one"
                data={getClientAddress(shippingClientName)}
              />
            </div>

            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mx-4"
              onClick={confirmOrder}
            >
              Confirm Order
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default ConfirmOrderModal;
