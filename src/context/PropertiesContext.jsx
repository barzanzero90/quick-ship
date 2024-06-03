import { createContext, useReducer, useEffect, useContext } from "react";
import { PROPERTIESACTIONS } from "../actions/propertiesActions";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const PropertiesContext = createContext();

const propertiesIntialState = {
  colors: [],
  error: null,
};

function propertiesReducer(state, action) {
  switch (action.type) {
    case PROPERTIESACTIONS.SET_COLORS:
      return {
        ...state,
        colors: action.payload,
      };

    case PROPERTIESACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}

export function PropertiesProvider({ children }) {
  const [state, dispatch] = useReducer(
    propertiesReducer,
    propertiesIntialState
  );

  const getColors = async () => {
    try {
      const colorsCollection = collection(db, "colors");
      onSnapshot(
        query(colorsCollection, orderBy("createdAt", "desc")),
        (snapshot) => {
          const colors = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch({ type: PROPERTIESACTIONS.SET_COLORS, payload: colors });
        }
      );
    } catch (error) {
      dispatch({ type: PROPERTIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };


  useEffect(() => {
    getColors();
  }, []);

  const addColor = async (colorData) => {
    try {
      const colorsCollection = collection(db, `colors`);
      await addDoc(colorsCollection, colorData);
    } catch (error) {
      dispatch({ type: PROPERTIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const deleteColor = async (color) => {
    try {
      const colorDoc = doc(db, "colors", color.id);
      await deleteDoc(colorDoc, color.id);
      alert(`${color.colorName} color deleted successfully!`);
    } catch (error) {
      dispatch({ type: PROPERTIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const contextData = {
    colors: state.colors,
    attributes: state.attributes,
    error: state.error,
    subAttributes: state.subAttributes,
    addColor,
    deleteColor,
    state,
    dispatch,
  };
  return (
    <PropertiesContext.Provider value={contextData}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  return useContext(PropertiesContext);
}
