import { createContext, useReducer, useEffect, useContext } from "react";
import { PRODUCTSACTIONS } from "../actions/productsActions";
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

const ProductsContext = createContext();

const productsInitialState = {
  loading: true,
  products: [],
  error: null,
  wishLists: [],
  cart: [],
};

function productsReducer(state, action) {
  switch (action.type) {
    case PRODUCTSACTIONS.SET_LOADING:
      return {
        ...state,
      };

    case PRODUCTSACTIONS.SET_PRODUCTS:
      return {
        ...state,
        loading: false,
        products: action.payload,
      };

    case PRODUCTSACTIONS.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case PRODUCTSACTIONS.SET_WISH_LIST:
      return {
        ...state,
        loading: false,
        wishLists: action.payload,
      };

    case PRODUCTSACTIONS.SET_CART:
      return {
        ...state,
        loading: false,
        cart: action.payload,
      };

    default:
      return state;
  }
}

export function ProductsProvider({ children }) {
  const [state, dispatch] = useReducer(productsReducer, productsInitialState);

  const getProducts = async () => {
    try {
      const productsCollection = collection(db, "products");
      onSnapshot(
        query(productsCollection, orderBy("createdAt", "desc")),
        (snapshot) => {
          const products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch({ type: PRODUCTSACTIONS.SET_PRODUCTS, payload: products });
        }
      );
    } catch (error) {
      dispatch({ type: PRODUCTSACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const addProduct = async (productData) => {
    try {
      const productsCollection = collection(db, "products");
      await addDoc(productsCollection, productData);
    } catch (error) {
      dispatch({ type: PRODUCTSACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const deleteProduct = async (product) => {
    try {
      const productDoc = doc(db, "products", product.id);
      await deleteDoc(productDoc, product.id);
      alert(`${product.productName} product deleted successfully`);
      return (window.location.href = "/admin/products");
    } catch (error) {
      dispatch({ type: PRODUCTSACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const toggleWishList = async (user, product) => {
    try {
      const userWishListsCollection = collection(
        db,
        `users/${user.email}/wishLists`
      );
      const wishListsSnapshot = await getDocs(userWishListsCollection);
      const isExists = wishListsSnapshot.docs.find(
        (doc) => doc.data().product.id == product.id
      );

      if (isExists) {
        await deleteDoc(doc(userWishListsCollection, isExists.id));
        console.log("PRODUCT DELETED");
      } else {
        await addDoc(userWishListsCollection, {
          product,
          addedAt: new Date(),
        });
        console.log("PRODUCT ADDED");
      }
    } catch (error) {
      dispatch({ type: PRODUCTSACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const addToCart = async (user, cartData) => {
    try {
      const userCartCollection = collection(db, `users/${user.email}/cart`);
      await addDoc(userCartCollection, cartData);
      alert("ئەم بەرهەمە بەسەرکەوتووی زیادکرا بۆ لیستی سەبەتەی کڕین");
    } catch (error) {
      dispatch({ type: PRODUCTSACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const deleteProductFromCart = async (userEmail, cartId) => {
    try {
      const productDoc = doc(db, `users/${userEmail}/cart`, cartId);
      await deleteDoc(productDoc);
      alert("ئەم بەرهەمە لەسەبەتەی کڕینەکەت سڕایەوە");
    } catch (error) {
      dispatch({ type: PRODUCTSACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const getUserWishLists = async (user) => {
    try {
      const wishListsCollection = collection(
        db,
        `users/${user.email}/wishLists`
      );
      onSnapshot(
        query(wishListsCollection, orderBy("addedAt", "desc")),
        (snapshot) => {
          const wishLists = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch({ type: PRODUCTSACTIONS.SET_WISH_LIST, payload: wishLists });
        }
      );
    } catch (error) {
      dispatch({ type: PRODUCTSACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const getUserCart = async (user) => {
    try {
      const cartCollection = collection(db, `users/${user.email}/cart`);
      onSnapshot(
        query(cartCollection, orderBy("addedAt", "desc")),
        (snapshot) => {
          const cart = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch({ type: PRODUCTSACTIONS.SET_CART, payload: cart });
        }
      );
    } catch (error) {
      dispatch({ type: PRODUCTSACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const contextData = {
    loading: state.loading,
    products: state.products,
    error: state.error,
    addProduct,
    deleteProduct,
    toggleWishList,
    addToCart,
    deleteProductFromCart,
    getUserWishLists,
    getUserCart,
    wishLists: state.wishLists,
    cart: state.cart,
    state,
    dispatch,
  };
  return (
    <ProductsContext.Provider value={contextData}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
