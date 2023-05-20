import { databaseId, databases, stocksCollection } from "@/utils/client";
import useSWR from "swr";

const useGetStocks = () => {
  const fetcher = async () => {
    return await databases
      .listDocuments(databaseId, stocksCollection)
      .then((response) => {
        return response.documents;
      });
  };

  const { data, error, isLoading, isValidating } = useSWR(
    "/api/orders",
    fetcher
  );

  return {
    data,
    isLoading,
    isError: error,
    isValidating,
  };
};

export default useGetStocks;
