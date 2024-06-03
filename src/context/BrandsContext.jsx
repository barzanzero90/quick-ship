import { createContext, useReducer, useEffect, useContext } from "react";
import { BRANDSACTIONS } from "../actions/brandsActions";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const BrandsContext = createContext();

const brandsInitialState = {
  brands: [],
  error: null,
};

function brandsReducer(state, action) {
  switch (action.type) {
    case BRANDSACTIONS.SET_BRANDS:
      return {
        ...state,
        brands: action.payload,
      };

    case BRANDSACTIONS.SET_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

export function BrandsProvider({ children }) {
  const [state, dispatch] = useReducer(brandsReducer, brandsInitialState);

  const getBrands = async () => {
    try {
      const brandsCollection = collection(db, "brands");
      onSnapshot(
        query(brandsCollection, orderBy("createdAt", "desc")),
        (snapshot) => {
          const brands = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch({ type: BRANDSACTIONS.SET_BRANDS, payload: brands });
        }
      );
    } catch (error) {
      dispatch({ type: BRANDSACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  const addBrand = async (brandData) => {
    try {
      const brandsCollection = collection(db, "brands");
      await addDoc(brandsCollection, brandData);
    } catch (error) {
      dispatch({ type: BRANDSACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const deleteBrand = async (brand) => {
    try {
      const brandDoc = doc(db, "brands", brand.id);
      await deleteDoc(brandDoc, brand.id);
      alert(`${brand.brandSlug} brand deleted successfully`);
    } catch (error) {
      dispatch({ type: BRANDSACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const contextData = {
    brands: state.brands,
    error: state.error,
    addBrand,
    deleteBrand,
    state,
    dispatch,
  };
  return (
    <BrandsContext.Provider value={contextData}>
      {children}
    </BrandsContext.Provider>
  );
}

export function useBrands() {
  return useContext(BrandsContext);
}
