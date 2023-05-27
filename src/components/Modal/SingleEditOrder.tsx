import { useAppSelector } from "@/store";
import { databaseId, databases, ordersCollection } from "@/utils/client";
import { cn } from "@/utils/cn";
import { Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSWRConfig } from "swr";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: {
    id: string;
    orderId: string;
    quantity: number;
    status: string;
    rate: number;
  };
};

const SingleEditOrder = ({ open, setOpen, data }: Props) => {
  const [orderId, setOrderId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [status, setStatus] = useState<string>("");
  const date = useAppSelector((state) =>
    new Date(JSON.parse(state.date)).toLocaleDateString("in")
  );
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (open) {
      setOrderId(data.orderId);
      setQuantity(data.quantity);
      setStatus(data.status.toLowerCase());
      setRate(data.rate);
    }
  }, [open, data]);

  const editOrder = async () => {
    try {
      await databases.updateDocument(databaseId, ordersCollection, data.id, {
        orderId,
        quantity,
        status,
        rate,
      });
      toast.success("Edited Order");
      mutate(["/api/orders", date]);
      setOpen(false);
    } catch (error) {
      toast.error("Error editing order.");
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
                htmlFor="orderId"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Order Id
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
              <label
                htmlFor="quantity"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Quantity
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  placeholder="10"
                />
              </div>
            </div>
            <div className="px-4">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Rate
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="rate"
                  id="rate"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  placeholder="10"
                />
              </div>
            </div>

            <fieldset className="p-4">
              <legend className="text-sm font-semibold leading-6 text-gray-600">
                Status
              </legend>
              <div className="space-y-3">
                <div className="flex items-center gap-x-3">
                  <input
                    id="pending"
                    name="status"
                    type="radio"
                    checked={status === "pending"}
                    onChange={() => setStatus("pending")}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="pending"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {"Pending"}
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="billed"
                    name="status"
                    type="radio"
                    checked={status === "billed"}
                    onChange={() => setStatus("billed")}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="billed"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {"Billed"}
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="shipped"
                    name="status"
                    type="radio"
                    checked={status === "shipped"}
                    onChange={() => setStatus("shipped")}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="shipped"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {"Shipped"}
                  </label>
                </div>
              </div>
            </fieldset>
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

export default SingleEditOrder;
