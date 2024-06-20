import {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { CATEGORIESACTIONS } from "../actions/categoriesActions";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const CategoriesContext = createContext();

const categoriesInitialState = {
  loading: true,
  error: null,
  categories: [],
  subCategories: [],
};

function categoriesReducer(state, action) {
  switch (action.type) {
    case CATEGORIESACTIONS.SET_LOADING:
      return { ...state };

    case CATEGORIESACTIONS.SET_ERROR:
      return { ...state, payload: action.payload };

    case CATEGORIESACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };

    case CATEGORIESACTIONS.SET_SUB_CATEGORIES:
      return {
        ...state,
        subCategories: action.payload,
      };

    default:
      return state;
  }
}

export function CategoriesProvider({ children }) {
  const [state, dispatch] = useReducer(
    categoriesReducer,
    categoriesInitialState
  );

  const getCategories = async () => {
    try {
      dispatch({ type: CATEGORIESACTIONS.SET_LOADING, payload: true });
      const categoriesCollection = collection(db, "categories");
      onSnapshot(
        query(categoriesCollection, orderBy("createdAt", "desc")),
        (snapshot) => {
          const categories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch({
            type: CATEGORIESACTIONS.SET_CATEGORIES,
            payload: categories,
          });
          dispatch({ type: CATEGORIESACTIONS.SET_LOADING, payload: false });
        }
      );
    } catch (error) {
      dispatch({ type: CATEGORIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const addCategory = async (categoryData) => {
    try {
      const categoriesCollection = collection(db, "categories");
      await addDoc(categoriesCollection, categoryData);
    } catch (error) {
      dispatch({ type: CATEGORIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      // Sub Categories Collection
      const subCategoriesCollection = collection(
        db,
        `categories/${categoryId}/subCategories`
      );
      const subCategoriesSnaoshot = await getDocs(subCategoriesCollection);
      subCategoriesSnaoshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Category Doc
      const categoryDoc = doc(db, "categories", categoryId);
      await deleteDoc(categoryDoc, categoryId);
      alert(`Category deleted successfully!`);
      location.pathname.href = "/admin/categories";
    } catch (error) {
      dispatch({ type: CATEGORIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const addSubCategory = async (categoryId, subCategoryData) => {
    try {
      const subCategoriesCollection = collection(
        db,
        `categories/${categoryId}/subCategories`
      );
      await addDoc(subCategoriesCollection, subCategoryData);
    } catch (error) {
      dispatch({ type: CATEGORIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const getSubCategories = async (categoryId) => {
    try {
      dispatch({ type: CATEGORIESACTIONS.SET_LOADING, payload: true });
      const subCategoriesCollection = collection(
        db,
        `categories/${categoryId}/subCategories`
      );
      onSnapshot(
        query(subCategoriesCollection, orderBy("createdAt", "desc")),
        (snapshot) => {
          const subCategories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch({
            type: CATEGORIESACTIONS.SET_SUB_CATEGORIES,
            payload: subCategories,
          });
          dispatch({ type: CATEGORIESACTIONS.SET_LOADING, payload: false });
        }
      );
    } catch (error) {
      dispatch({ type: CATEGORIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const deleteSubCategory = async (categoryId, subCategoryId) => {
    try {
      const subCategoryDoc = doc(
        db,
        `categories/${categoryId}/subCategories`,
        subCategoryId
      );
      await deleteDoc(subCategoryDoc, subCategoryId);
      alert("Sub category deleted successfully!");
    } catch (error) {
      dispatch({ type: CATEGORIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const contextData = {
    categories: state.categories,
    addCategory,
    deleteCategory,
    addSubCategory,
    getSubCategories,
    subCategories: state.subCategories,
    deleteSubCategory,
    state,
    dispatch,
  };
  return (
    <CategoriesContext.Provider value={contextData}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoriesContext);
}
