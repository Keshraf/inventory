import { StockArrSchema } from "@/types/stock";
import { cn } from "@/utils/cn";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { read, utils, type WorkBook } from "xlsx";
import {
  functions,
  functionsId,
  databaseId,
  stocksCollection,
  clientsCollection,
  clientFunctionsId,
} from "@/utils/client";
import { nanoid } from "nanoid";

interface DataItem {
  name: string;
  quantity: number;
  packets: number;
}

type StockData = {
  mill: string;
  quality: string;
  quantity: number;
  breadth: number;
  length: number | null;
  gsm: number;
  sheets: number;
  weight: number;
};

interface ClientItem {
  sr: string;
  name: string;
  address: string;
  contact: string;
  mobile: string;
  phone: string;
  email: string;
  pin: string;
  pan: string;
  gst: string;
}

type ClientData = {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  gst?: string;
};

type Client = {
  name: string;
  address?: string;
  mobile?: string;
};

const Dropzone = () => {
  const [value, setValue] = useState<File | null>(null);

  const runFn = async (data: StockData[]) => {
    const promise = functions.createExecution(
      functionsId,
      JSON.stringify({
        databaseId,
        collectionId: stocksCollection,
        date: new Date().toLocaleDateString("in"),
        data: data.map((item) => ({
          ...item,
          id: nanoid(),
        })),
      })
    );

    toast.promise(promise, {
      loading: "Adding Stocks",
      success: "Stocks Added Successfully",
      error: "Error Adding Stocks",
    });

    await promise
      .then((res) => {
        return {
          success: true,
          data: res,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          success: false,
          error: err,
        };
      });
  };

  const runFnClient = async (data: Client[]) => {
    const promise = functions.createExecution(
      clientFunctionsId,
      JSON.stringify({
        databaseId,
        collectionId: clientsCollection,
        data: data.map((item) => ({
          ...item,
          id: nanoid(),
        })),
      })
    );

    toast.promise(promise, {
      loading: "Adding Clients",
      success: "Clients Added Successfully",
      error: "Error Adding Clients",
    });

    await promise
      .then((res) => {
        return {
          success: true,
          data: res,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          success: false,
          error: err,
        };
      });
  };

  function getSpecs(str: string) {
    const splitStr = str.split(" ");
    let mill: string = "";
    let qualityName: string = "";
    let breadth: number = 0;
    let length: number = 0;
    let weight: number = 0;
    let gsm: number = 0;
    let sheets: number = 0;
    let bundle: number = 0;

    splitStr.forEach((val, index) => {
      // First is always Mill
      if (index === 0) {
        mill = val;
      }
      // Dissects the KG String
      else if (val.includes("KG") && val.includes("-")) {
        // Splits size & KG
        const s = val.split("-");
        if (s.length > 0 && s[0]) {
          if (s[0].includes("X")) {
            // Splits the SIZE str
            const size = s[0].split("X");
            // Gets breadth & length
            if (size.length === 2 && size[0] && size[1]) {
              breadth = Number(size[0]);
              length = Number(size[1]);
            }
            // Just gets the Breadth
            else if (size[0]) {
              breadth = Number(size[0]);
            }
          }
        }

        // Gets the KG
        if (s[1]) {
          weight = Number(s[1].substring(0, s[1].length - 2));
        }
      } else if (
        (val.includes("G") && index === splitStr.length - 2) ||
        index === splitStr.length - 3
      ) {
        gsm = Number(val.substring(0, val.length - 1));
      } else if (
        (val.includes("S") && index === splitStr.length - 1) ||
        index === splitStr.length - 2
      ) {
        sheets = Number(val.substring(0, val.length - 1));
      } else if (val.includes("B") && index === splitStr.length - 1) {
        bundle = Number(val.substring(3, val.length - 1));
      } else {
        qualityName = qualityName.concat(val, " ");
      }
    });

    return {
      gsm,
      sheets,
      breadth,
      length,
      weight,
      quality: qualityName.trim(),
      mill,
    };
  }

  const uploadStocksHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!value) {
      return;
    }
    console.log(e);
    const f = await value.arrayBuffer();
    const wb: WorkBook = read(f);

    const data = utils
      // @ts-ignore
      .sheet_to_json<DataItem>(wb.Sheets[wb.SheetNames[0]], {
        header: ["name", "quantity", "packets"],
      });

    const slicedData = data.slice(13, data.length - 1);
    console.log("Response", slicedData);

    const formattedData = slicedData.map((item: DataItem, index) => {
      const specs = getSpecs(item.name);

      return {
        ...specs,
        quantity: item.packets,
        invoice: "001",
        rate: 0,
      };
    });

    console.log("Response", formattedData);

    const results = StockArrSchema.safeParse(formattedData);

    console.log("Results", results);

    if (!results.success) {
      const issues = results.error.issues;
      issues.forEach((issue) => {
        toast.error(`Check value in row ${Number(issue.path[0]) + 14}`, {
          duration: 10000,
        });
      });
      return;
    }

    // divide an array into arrays of array of size 10
    const chunk = (arr: StockData[], size: number) => {
      return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
      );
    };

    const chunkedArr = chunk(results.data, 50);

    console.log("Chunked", chunkedArr);

    for (let index = 0; index < chunkedArr.length; index++) {
      await runFn(chunkedArr[index])
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const clientUploadhandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!value) {
      return;
    }
    console.log(e);
    const f = await value.arrayBuffer();
    const wb: WorkBook = read(f);

    const data = utils
      // @ts-ignore
      .sheet_to_json<ClientItem>(wb.Sheets[wb.SheetNames[0]], {
        header: [
          "sr",
          "name",
          "address",
          "contact",
          "mobile",
          "phone",
          "email",
          "pin",
          "pan",
          "gst",
        ],
      });

    console.log("Raw", data);

    const slicedData: ClientData[] = data.slice(2).map((item) => {
      const {
        sr,
        address,
        name,
        contact,
        mobile,
        phone,
        email,
        pin,
        pan,
        gst,
      } = item;

      let no = "";

      if (mobile && mobile.length >= 10) {
        if (mobile.includes("+91")) {
          no = mobile.substring(3);
        } else if (phone.includes("+91 ")) {
          no = phone.substring(4);
        } else if (mobile.length === 10) {
          no = mobile;
        } else {
          no = "";
        }
      }

      if (no === "") {
        if (phone && phone.length >= 10) {
          if (phone.includes("+91")) {
            no = phone.substring(3);
          } else if (phone.includes("+91 ")) {
            no = phone.substring(4);
          } else if (phone.length === 10) {
            no = phone;
          } else {
            no = "";
          }
        }
      }

      return {
        name,
        address,
        mobile: no,
      };
    });

    console.log("Response", slicedData);

    const chunk = (arr: ClientData[], size: number) => {
      return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
      );
    };

    const chunkedArr = chunk(slicedData, 50);

    console.log("Chunked", chunkedArr);

    for (let index = 0; index < chunkedArr.length; index++) {
      await runFnClient(chunkedArr[index])
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  console.log(value);

  return (
    <>
      <div className="flex items-center justify-center w-full h-auto my-4">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              aria-hidden="true"
              className={cn("w-10 h-10 mb-3 text-gray-400", {
                "text-indigo-500": value,
              })}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>

            {value ? (
              <div className="w-full flex justify-center items-center flex-row gap-2 text-indigo-700 my-2">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading..
              </div>
            ) : (
              <p className="mb-2 text-sm text-gray-500 ">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
            )}

            <p className="text-xs text-gray-500 ">
              {value?.name || "Excel to Upload"}
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            accept=".xls,.xlsx"
            className="hidden"
            onChange={(e) => {
              setValue(e.target.files?.[0] || null);
            }}
          />
        </label>
      </div>
      <div>
        {value && (
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full"
            onClick={uploadStocksHandler}
          >
            Confirm Upload
          </button>
        )}
      </div>
    </>
  );
};

export default Dropzone;
