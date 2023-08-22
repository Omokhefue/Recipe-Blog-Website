import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw Error("could not get data. Please try refreshing your page");
          }
          const data = await response.json();
          setIsPending(false);
          setError(null)
          setData(data);
        } catch (error) {
          setIsPending(false);
          setError(error.message);
        }
      };
      fetchData();
    }, 1000);
  }, [url]);

  return { error, isPending, data };
};

export default useFetch;
