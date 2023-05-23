import { clientsCollection, databaseId, databases } from "@/utils/client";
import { Models, Query } from "appwrite";
import useSWR from "swr";

const useGetClients = () => {
  const fetcher = async () => {
    const final: Models.Document[] = [];
    let total = 0;
    await databases
      .listDocuments(databaseId, clientsCollection, [Query.limit(100)])
      .then((response) => {
        total = response.total;
        final.push(...response.documents);
      });

    while (final.length < total) {
      await databases
        .listDocuments(databaseId, clientsCollection, [
          Query.limit(100),
          Query.offset(final.length),
        ])
        .then((response) => {
          final.push(...response.documents);
        });
    }

    return final;
  };

  const { data, error, isLoading, isValidating } = useSWR(
    "/api/clients",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data,
    isLoading,
    isError: error,
    isValidating,
  };
};

export default useGetClients;
