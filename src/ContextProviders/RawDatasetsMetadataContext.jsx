import { useState, useEffect, createContext, useMemo, useCallback } from 'react';
import { fetchDataFromURL } from "../API/ApiFetch";

export const RawDatasetsMetadataContext = createContext();

const url = 'https://raw.githubusercontent.com/CITIES-Dashboard/datasets/main/datasets_metadata.json';

export function RawDatasetsMetadataProvider({ children }) {
  const [rawDatasetsMetadata, setRawDatasetsMetadata] = useState();

  const fetchMetadata = useCallback(async () => {
    try {
      const jsonData = await fetchDataFromURL(url, 'json');
      setRawDatasetsMetadata(jsonData);
    } catch (error) {
      console.log('Error fetching raw datasets metadata:', error);
    }
  }, []);

  useEffect(() => {
    if (!rawDatasetsMetadata) {
      fetchMetadata();
    }
  }, [rawDatasetsMetadata, fetchMetadata]);

  const providerValue = useMemo(() => rawDatasetsMetadata, [rawDatasetsMetadata]);

  // return context provider
  return (
    <RawDatasetsMetadataContext.Provider value={providerValue}>
      {children}
    </RawDatasetsMetadataContext.Provider>
  );
}
