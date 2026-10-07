import { useEffect, useState } from "react";
import apiRequest from "../utils/apiRequest";

// Admin le haleko content (/officials, /slides, /documents). Load hunjel null
const useHomeContent = (endpoint, params) => {
  const [items, setItems] = useState(null);
  const paramKey = JSON.stringify(params || {});

  useEffect(() => {
    let ignore = false;

    apiRequest
      .get(endpoint, { params: JSON.parse(paramKey) })
      .then(({ data }) => {
        if (!ignore) setItems(data.items || []);
      })
      .catch(() => {
        if (!ignore) setItems([]);
      });

    return () => {
      ignore = true;
    };
  }, [endpoint, paramKey]);

  return items;
};

export default useHomeContent;
