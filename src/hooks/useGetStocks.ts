import { databaseId, databases, stocksCollection } from "@/utils/client";
import { Query } from "appwrite";
import { useEffect, useMemo, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

type date = {
  date?: Date;
};

const useGetStocks = (date: string) => {
  const fetcher = async (url: string, d: string) => {
    return await databases
      .listDocuments(databaseId, stocksCollection, [
        Query.equal("dateAdded", [d]),
        Query.orderAsc("mill"),
        Query.orderAsc("quality"),
        Query.orderAsc("breadth"),
        Query.orderAsc("length"),
      ])
      .then((response) => {
        return response.documents;
      });
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["/api/stocks", date],
    ([url, date]) => fetcher(url, date)
  );

  return {
    data,
    isLoading,
    isError: error,
    isValidating,
  };
};

export default useGetStocks;
