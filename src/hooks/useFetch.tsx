import { useState, useEffect } from 'react';

import axios from 'axios';

interface IFetch {
    url?: string;
    method: 'get' | 'post' | 'put' | 'delete'
    onSuccess: (response: any) => void;
    onError: (response: any) => void;
    onInit: boolean
}

const useFetch = ({url, method, onSuccess, onError, onInit}: IFetch) => {
  const [status, setStatus] = useState<string>('Starting...');
  const [code, setCode] = useState<null | number>(null);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<any>(null);
 
  useEffect(() => {
    if (response) {
        onSuccess(response);
    }
  }, [response])

  useEffect(() => {
    if (error) {
        onError(error);
    }
  }, [error])

  useEffect(() => {
    if (onInit && method === 'get') {
      handleFetch(url);
    }
  }, [onInit])

  const handleFetch = (url: any, payload?: any) => {
    setStatus('Pending');
    axios[method](url, payload)
      .then((res: any) => {
          setCode(res.status)
          setResponse(res.data);
      })
      .then(res => setStatus('Fullfilled'))
      .catch((err: any)=> {
          setError(err);
          setStatus('Pending');
      })
  }  
  return {handleFetch, code, status}
}

export default useFetch