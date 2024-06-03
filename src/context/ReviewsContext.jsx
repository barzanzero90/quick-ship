import { createContext, useReducer, useEffect, useContext } from "react";
import { REVIEWS_ACTIONS } from "../actions/reviewsActions";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const ReviewsContext = createContext();

const reviewsInitialState = {
  loading: true,
  reviews: [],
  error: null,
};

function reviewsReducer(state, action) {
  switch (action.type) {
    case REVIEWS_ACTIONS.SET_LOADING:
      return { ...state };

    case REVIEWS_ACTIONS.SET_REVIEWS:
      return {
        loading: false,
        reviews: action.payload,
        error: null,
      };

    case REVIEWS_ACTIONS.SET_REVIEWS:
      return {
        loading: false,
        error: action.payload,
        reviews: [],
      };

    default:
      return state;
  }
}

export function ReviewsProvider({ children }) {
  const [state, dispatch] = useReducer(reviewsReducer, reviewsInitialState);

  const getReviews = async () => {
    try {
      const reviewsCollection = collection(db, "reviews");
      onSnapshot(
        query(reviewsCollection, orderBy("createdAt", "desc")),
        (snapshot) => {
          const reviews = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // console.log(reviews);
          dispatch({ type: REVIEWS_ACTIONS.SET_REVIEWS, payload: reviews });
        }
      );
    } catch (error) {
      dispatch({ type: REVIEWS_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  const addReview = async (reviewData) => {
    try {
      const reviewsCollection = collection(db, "reviews");
      await addDoc(reviewsCollection, reviewData);
    } catch (error) {
      dispatch({ type: REVIEWS_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const reviewDoc = doc(db, "reviews", reviewId);
      await deleteDoc(reviewDoc, reviewId);
    } catch (error) {
      dispatch({ type: REVIEWS_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const editReview = async (reviewData) => {
    try {
      const reviewDoc = doc(db, "reviews", reviewData.id);
      await updateDoc(reviewDoc, reviewData);
    } catch (error) {
      dispatch({ type: REVIEWS_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const contextData = {
    state,
    dispatch,
    loading: state.loading,
    reviews: state.reviews,
    error: state.error,
    addReview,
    deleteReview,
    editReview,
  };
  return (
    <ReviewsContext.Provider value={contextData}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewsContext);
}
