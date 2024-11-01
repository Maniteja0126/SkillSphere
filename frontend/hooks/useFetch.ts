import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const useFetch = <T>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<T>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
          { withCredentials: true }
        );
        setData(response.data);
      } catch (err) {
        let errorMessage = "An unexpected error occurred"; 
        if (axios.isAxiosError(err)) {
          errorMessage = err.response?.data?.message || err.message;
        }

        setError(errorMessage);
        router.push(`/error?message=${encodeURIComponent(errorMessage)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, router]); 

  return { data, error, loading };
};

export default useFetch;
