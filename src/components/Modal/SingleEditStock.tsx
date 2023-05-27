import { useAppSelector } from "@/store";
import {
  databaseId,
  databases,
  ordersCollection,
  stocksCollection,
} from "@/utils/client";
import { cn } from "@/utils/cn";
import { Transition } from "@headlessui/react";
import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSWRConfig } from "swr";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: {
    id: string;
    mill: string;
    quality: string;
    breadth: number;
    length: number;
    weight: number;
    gsm: number;
    sheets: number;
    quantity: number;
  };
};

const SingleEditStock = ({ open, setOpen, data }: Props) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [mill, setMill] = useState<string>("");
  const [quality, setQuality] = useState<string>("");
  const [breadth, setBreadth] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [gsm, setGsm] = useState<number>(0);
  const [sheets, setSheets] = useState<number>(0);

  const date = useAppSelector((state) =>
    new Date(JSON.parse(state.date)).toLocaleDateString("in")
  );
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (open) {
      setQuantity(data.quantity);
      setMill(data.mill);
      setQuality(data.quality);
      setBreadth(data.breadth);
      setLength(data.length);
      setWeight(data.weight);
      setGsm(data.gsm);
      setSheets(data.sheets);
    }
  }, [open, data]);

  const inputs = [
    {
      label: "Mill",
      value: mill,
      type: "text",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setMill(e.target.value),
      placeholder: "Mill",
    },
    {
      label: "Quality",
      value: quality,
      type: "text",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setQuality(e.target.value),
      placeholder: "Quality",
    },
    {
      label: "Breadth",
      value: breadth,
      type: "number",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setBreadth(Number(e.target.value)),
      placeholder: "Breadth",
    },
    {
      label: "Length",
      value: length,
      type: "number",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setLength(Number(e.target.value)),
      placeholder: "Length",
    },
    {
      label: "Weight",
      value: weight,
      type: "number",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setWeight(Number(e.target.value)),
      placeholder: "Weight",
    },
    {
      label: "GSM",
      value: gsm,
      type: "number",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setGsm(Number(e.target.value)),
      placeholder: "GSM",
    },
    {
      label: "Sheets",
      value: sheets,
      type: "number",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setSheets(Number(e.target.value)),
      placeholder: "Sheets",
    },
    {
      label: "Quantity",
      value: quantity,
      type: "number",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setQuantity(Number(e.target.value)),
      placeholder: "Quantity",
    },
  ];

  const editOrder = async () => {
    try {
      await databases.updateDocument(databaseId, stocksCollection, data.id, {
        mill,
        quality,
        breadth,
        length,
        weight,
        gsm,
        sheets,
        quantity,
      });
      toast.success("Edited Stock");
      mutate(["/api/stocks", date]);
      setOpen(false);
    } catch (error) {
      toast.error("Error editing stock.");
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
          <div className="w-full sm:w-96 h-screen max-h-screen sm:max-h-screen min-h-[100px] bg-white sm:rounded-lg shadow-lg gap-3 flex flex-col overflow-y-auto py-4">
            <div className="flex flex-row justify-end items-center text-base font-semibold leading-7 text-gray-900 bg-gray-100 px-4 py-2">
              <h2>Edit Stock</h2>
              <span
                className="ml-auto rounded-full"
                onClick={() => setOpen(false)}
              >
                <XMarkIcon className="w-6 h-6 text-gray-600 stroke-2 hover:bg-gray-200 hover:text-gray-800 rounded-md p-1 cursor-pointer" />
              </span>
            </div>
            {inputs.map((input, index) => {
              return (
                <div className="px-4" key={input.label}>
                  <label
                    htmlFor={input.label}
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {input.label}
                  </label>
                  <div className="mt-2">
                    <input
                      type={input.type}
                      name={input.label}
                      id={input.label}
                      value={input.value}
                      onChange={input.onChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      placeholder={input.placeholder}
                    />
                  </div>
                </div>
              );
            })}

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

export default SingleEditStock;
