import { useState, useEffect, useRef, useCallback } from 'react';

export function useApi(requestFn, { immediate = false, onSuccess, onError } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const execute = useCallback(
    async (...args) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const response = await requestFn(...args, { signal: controller.signal });
        setData(response.data);
        if (onSuccess) onSuccess(response.data);
        return response.data;
      } catch (err) {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
        setError(err.response?.data?.message || err.message || 'Une erreur est survenue');
        if (onError) onError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [requestFn, onSuccess, onError]
  );

  const retry = useCallback(() => {
    return execute();
  }, [execute]);

  useEffect(() => {
    if (immediate) execute();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  return { data, loading, error, execute, retry };
}

export default useApi;
