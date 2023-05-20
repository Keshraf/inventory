import { databaseId, databases, ordersCollection } from "@/utils/client";
import { Query } from "appwrite";
import useSWR from "swr";

const useGetOrders = (date: string) => {
  const fetcher = async (url: string, d: string) => {
    return await databases
      .listDocuments(databaseId, ordersCollection, [
        Query.equal("dateAdded", [d]),
      ])
      .then((response) => {
        return response.documents;
      });
  };

  const { data, error, isLoading, isValidating } = useSWR(
    ["/api/orders", date],
    ([url, date]) => fetcher(url, date)
  );

  return {
    data,
    isLoading,
    isError: error,
    isValidating,
  };
};

export default useGetOrders;
