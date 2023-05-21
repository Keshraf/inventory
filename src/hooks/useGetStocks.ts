import { databaseId, databases, stocksCollection } from "@/utils/client";
import { Models, Query } from "appwrite";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

type date = {
  date?: Date;
};

const useGetStocks = (date: string) => {
  const queries = useCallback(
    (d: string) => [
      Query.equal("dateAdded", [d]),
      Query.orderAsc("mill"),
      Query.orderAsc("quality"),
      Query.orderAsc("breadth"),
      Query.orderAsc("length"),
      Query.limit(100),
    ],
    []
  );

  const fetcher = async (url: string, d: string) => {
    const final: Models.Document[] = [];
    let total = 0;
    await databases
      .listDocuments(databaseId, stocksCollection, queries(d))
      .then((response) => {
        total = response.total;
        final.push(...response.documents);
      });

    while (final.length < total) {
      await databases
        .listDocuments(databaseId, stocksCollection, [
          ...queries(d),
          Query.offset(final.length),
        ])
        .then((response) => {
          final.push(...response.documents);
        });
    }

    return final;
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
