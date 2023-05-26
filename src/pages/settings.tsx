import Dropzone from "@/components/Dropzone";
import Layout from "@/components/Layout";
import useGetStocks from "@/hooks/useGetStocks";
import { useAppSelector } from "@/store";
import {
  databaseId,
  deleteFunctionsId,
  functions,
  stocksCollection,
} from "@/utils/client";
import { nanoid } from "nanoid";
import Head from "next/head";
import { toast } from "react-hot-toast";

const SettingsPage = () => {
  const date = useAppSelector((state) =>
    new Date(JSON.parse(state.date)).toLocaleDateString("in")
  );

  const { data, isLoading } = useGetStocks(date);

  const runFn = async (id: string[]) => {
    const promise = functions.createExecution(
      deleteFunctionsId,
      JSON.stringify({
        databaseId,
        collectionId: stocksCollection,
        data: id,
      })
    );

    toast.promise(promise, {
      loading: "Deleting Stocks",
      success: "Stocks Deleted Successfully",
      error: "Error Deleting Stocks",
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

  const deleteHandler = async () => {
    const ids = data?.map((item) => item.$id);

    if (ids) {
      for (let i = 0; i < ids.length; i += 40) {
        await runFn(ids.slice(i, i + 40));
      }
    }
  };

  return (
    <>
      <Head>
        <title>Upload</title>
      </Head>

      <Layout>
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-0">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {`Settings`}
            </h1>
          </div>
        </header>
        <button
          type="button"
          className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 w-44 my-5"
          onClick={isLoading ? () => {} : deleteHandler}
          disabled={isLoading}
        >
          Delete All Stocks
        </button>
      </Layout>
    </>
  );
};

SettingsPage.private = true;

export default SettingsPage;
