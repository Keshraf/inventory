import { useEffect, useState } from "react";
import Datepicker from "../DatePicker";
import SearchBar from "../SearchBar";
import { useAppDispatch, useAppSelector } from "../../store";
import { setSearch } from "../../store/search";
import { useRouter } from "next/router";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useSWRConfig } from "swr";
import useGetStocks from "@/hooks/useGetStocks";
import exportExcel from "@/utils/excel";

const StocksHeader = () => {
  const search = useAppSelector((state) => state.search);
  const [query, setQuery] = useState<string>(search);
  const dispatch = useAppDispatch();
  const { mutate } = useSWRConfig();
  const date = useAppSelector((state) =>
    new Date(JSON.parse(state.date)).toLocaleDateString("in")
  );

  const { data, isError, isLoading } = useGetStocks(date);

  const router = useRouter();

  useEffect(() => {
    console.log("query", query);
    dispatch(setSearch(query));
  }, [query, dispatch]);

  useEffect(() => {
    const handleRouteChange = () => {
      dispatch(setSearch(""));
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [dispatch, router.events]);

  return (
    <div className="w-full my-3 flex sm:flex-row flex-col gap-2 h-auto">
      <div>
        <Datepicker />
      </div>
      <SearchBar query={query} setQuery={setQuery} />
      <button
        disabled={isLoading || isError}
        type="button"
        className="sm:inline-flex min-h-[50px] hidden items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() =>
          exportExcel({
            data:
              data?.map((item) => ({
                Mill: item.mill,
                Quality: item.quality,
                Breadth: item.breadth,
                Length: item.length,
                Weight: item.weight,
                GSM: item.gsm,
                Sheets: item.sheets,
                Quantity: item.quantity,
                "Date Added": item.dateAdded,
              })) || [],
            fileName: "Stocks",
            sheetName: "Stocks",
          })
        }
      >
        <ArrowDownTrayIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        Export
      </button>
    </div>
  );
};

export default StocksHeader;
