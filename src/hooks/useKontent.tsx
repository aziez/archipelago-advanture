//gist.githubusercontent.com/aziez/e75e3867e93aa172163f2e7e8cd2aabd/raw/38edd904aeb34960e39e9c6c219513bda05acc89/portfolio-content.json

import useSWR from 'swr';

// GANTI URL INI DENGAN URL RAW GIST KAMU
const CONTENT_URL =
  'https:gist.githubusercontent.com/aziez/e75e3867e93aa172163f2e7e8cd2aabd/raw/38edd904aeb34960e39e9c6c219513bda05acc89/portfolio-content.json';

// Fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useContent = () => {
  const { data, error, isLoading } = useSWR(CONTENT_URL, fetcher, {
    revalidateOnFocus: false, // Gak perlu fetch ulang tiap ganti tab
    revalidateOnReconnect: true,
    refreshInterval: 0, // Set ke 60000 (1 menit) kalau mau auto-update real time
  });

  return {
    content: data,
    isLoading,
    isError: error,
  };
};
