import { createContext, useReducer, useEffect, useContext } from "react";
import { PROPERTIESACTIONS } from "../actions/propertiesActions";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const PropertiesContext = createContext();

const propertiesIntialState = {
  attributes: [],
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

    case PROPERTIESACTIONS.SET_ATTRIBUTES:
      return {
        ...state,
        attributes: action.payload,
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

  const getAttributes = async () => {
    try {
      const attributesCollection = collection(db, "attributes");
      onSnapshot(
        query(attributesCollection, orderBy("createdAt", "desc")),
        (snapshot) => {
          const attributes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch({
            type: PROPERTIESACTIONS.SET_ATTRIBUTES,
            payload: attributes,
          });
        }
      );
    } catch (error) {
      dispatch({ type: PROPERTIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  useEffect(() => {
    getColors();
    getAttributes();
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

  const addAttribute = async (attributeData) => {
    try {
      const attributesCollection = collection(db, "attributes");
      await addDoc(attributesCollection, attributeData);
    } catch (error) {
      dispatch({ type: PROPERTIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

 /*  const addSubAttribute = async (subAttributeData) => {
    try {
      const subAttributesCollection = collection(db, "sub-attributes");
      await addDoc(subAttributesCollection, subAttributeData);
    } catch (error) {
      dispatch({ type: PROPERTIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  }; */

  const addSubAttribute = async (attributeId, subAttributeData) => {
    try {
      const subAttributesCollection = doc(db, "attributes", attributeId);
      await updateDoc(subAttributesCollection, {
        subAttributes: arrayUnion(subAttributeData),
      });
    } catch (error) {
      dispatch({ type: PROPERTIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const deleteAttribute = async (attribute) => {
    try {
      const attributeDoc = doc(db, "attributes", attribute.id);

      // Delete sub attributes
      const subAttributesCollection = collection(
        db,
        `attributes/${attribute.id}/sub-attributes`
      );
      const subAttributesSnapshot = await getDocs(subAttributesCollection);
      subAttributesSnapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      await deleteDoc(attributeDoc, attribute.id);
      alert(`${attribute.attributeName} attribute deleted successfully!`);
    } catch (error) {
      dispatch({ type: PROPERTIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const deleteSubAttribute = async (subAttribute) => {
    try {
      const subAttributeDoc = doc(db, "sub-attributes", subAttribute.id);
      await deleteDoc(subAttributeDoc, subAttribute);
      alert(
        `${subAttribute.subAttributeName} sub attribute deleted successfully!`
      );
    } catch (error) {
      dispatch({ type: PROPERTIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const contextData = {
    colors: state.colors,
    attributes: state.attributes,
    error: state.error,
    addColor,
    deleteColor,
    state,
    dispatch,
    addAttribute,
    addSubAttribute,
    deleteAttribute,
    deleteSubAttribute,
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
