import { databaseId, databases, ordersCollection } from "@/utils/client";
import useSWR from "swr";

const useGetOrders = () => {
  const fetcher = async () => {
    return await databases
      .listDocuments(databaseId, ordersCollection)
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

export default useGetOrders;
