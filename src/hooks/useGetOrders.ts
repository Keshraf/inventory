import { databaseId, databases, ordersCollection } from "@/utils/client";
import { Models, Query } from "appwrite";
import useSWR from "swr";

const useGetOrders = (date: string) => {
  const fetcher = async (url: string, d: string) => {
    const final: Models.Document[] = [];
    let total = 0;
    const result = await databases
      .listDocuments(databaseId, ordersCollection, [
        Query.equal("dateAdded", [d]),
        Query.limit(100),
      ])
      .then((response) => {
        final.push(...response.documents);
        total = response.total;
        return response;
      });

    while (final.length < total) {
      const result = await databases
        .listDocuments(databaseId, ordersCollection, [
          Query.equal("dateAdded", [d]),
          Query.limit(100),
          Query.offset(final.length),
        ])
        .then((response) => {
          final.push(...response.documents);
          return response;
        });
    }

    return final;
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
