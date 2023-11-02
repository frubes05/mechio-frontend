import axios from 'axios'
 
export const fetcher = url => axios.get(url).then(res => res.data);

export const sendRequest = (url, { arg }) => axios.post(url, arg).then(res => res.data);

export const changeRequest = (url, { arg }) => axios.put(url, arg).then(res => res.data);

export const deleteRequest = (url, { arg }) => axios.delete(arg ? `${url}/${arg}` : url).then(res => res.data);