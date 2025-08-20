import {useEffect, useState} from "react";
import productRepository from "../repository/productRepository.js";
const useProductDetails = (id) => {
  const [state, set] = useState({item: null, loading: true, error: null});
  useEffect(() => {
    if (!id) return;
    let active = true;
    productRepository.findDetails(id)
      .then(res => active && set({item: res.data, loading: false, error: null}))
      .catch(err => active && set({item: null, loading: false, error: err}));
    return () => { active = false; };
  }, [id]);
  return state;
};
export default useProductDetails;
