import { databaseId, databases, stocksCollection } from "@/utils/client";
import { Models } from "appwrite";
import { useEffect, useMemo, useState } from "react";

type Status = {
  isError: boolean;
  isLoading: boolean;
  data: Models.Document[];
};

const useGetStocks = () => {
  const [status, setStatus] = useState<Status>({
    isError: false,
    isLoading: true,
    data: [],
  });

  const memoizedPromise = useMemo(() => {
    return databases.listDocuments(databaseId, stocksCollection);
  }, []); // Empty dependency array ensures the promise is memoized only once

  useEffect(() => {
    memoizedPromise
      .then((response) => {
        setStatus({
          isLoading: false,
          isError: false,
          data: response.documents,
        });
      })
      .catch((error) => {
        setStatus({
          isLoading: false,
          isError: true,
          data: [],
        });
      });
  }, [memoizedPromise]);

  return status;
};

export default useGetStocks;
