import { clientsCollection, databaseId, databases } from "@/utils/client";
import { Query } from "appwrite";
import useSWR from "swr";

const useGetClients = () => {
  const fetcher = async () => {
    return await databases
      .listDocuments(databaseId, clientsCollection, [Query.limit(100)])
      .then((response) => {
        return response.documents;
      });
  };

  const { data, error, isLoading, isValidating } = useSWR(
    "/api/clients",
    fetcher
  );

  return {
    data,
    isLoading,
    isError: error,
    isValidating,
  };
};

export default useGetClients;
