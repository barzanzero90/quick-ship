import { createContext, useReducer, useEffect, useContext } from "react";
import { AUTHACTIONS } from "../actions/authActions";
import { auth, db } from "../firebase/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const authInitialState = {
  loading: true,
  user: null,
  error: null,
  users: [],
};

function authReducer(state, action) {
  switch (action.type) {
    case AUTHACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case AUTHACTIONS.SET_USER:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };
    case AUTHACTIONS.SET_LOGIN:
    case AUTHACTIONS.SET_SIGN_UP:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };
    case AUTHACTIONS.SET_USERS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    case AUTHACTIONS.SET_LOGOUT:
      return { ...state, loading: false, payload: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, authInitialState);
  const navigate = useNavigate();

  const getUserOnLoad = async () => {
    try {
      auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          const userDoc = doc(db, "users", currentUser.email);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            currentUser = userSnapshot.data();
            dispatch({ type: AUTHACTIONS.SET_USER, payload: currentUser });
          } else {
            dispatch({ type: AUTHACTIONS.SET_USER, payload: null });
          }
        }
      });
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const getUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      onSnapshot(
        query(usersCollection, orderBy("createdAt", "desc")),
        (snapshot) => {
          const users = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch({ type: AUTHACTIONS.SET_USERS, payload: users });
        }
      );
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  useEffect(() => {
    getUserOnLoad();
    getUsers();
  }, []);

  const signUpUser = async (userData) => {
    try {
      dispatch({ type: AUTHACTIONS.SET_LOADING, payload: true });

      const userDoc = doc(db, "users", userData.email);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );

        await setDoc(userDoc, userData);

        dispatch({ type: AUTHACTIONS.SET_USER, payload: userData });

        setTimeout(() => {
          dispatch({ type: AUTHACTIONS.SET_LOADING, payload: false });
        }, 2000);
      } else {
        alert("ئەم بەکارهێنەرە پێشتر هەبووە");
        dispatch({ type: AUTHACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      dispatch({ type: AUTHACTIONS.SET_LOADING, payload: false });
    }
  };

  const loginUser = async (userData) => {
    try {
      dispatch({ type: AUTHACTIONS.SET_LOADING, payload: true });

      const userDoc = doc(db, "users", userData.email);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        await signInWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );

        await updateDoc(userDoc, {
          lastLogin: new Date(),
        });

        dispatch({ type: AUTHACTIONS.SET_USER, payload: userData });

        setTimeout(() => {
          dispatch({ type: AUTHACTIONS.SET_LOADING, payload: false });
        }, 2000);
      } else {
        alert("ئەم بەکارهێنەرە بوونی نییە");
        dispatch({ type: AUTHACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        alert("وشەی نهێنی هەڵەیە");
      } else if (error.code === "auth/invalid-credential") {
        alert("ئیمەیڵ یان وشەی نهێنی هەڵەیە");
      } else {
        alert("هەڵەیەک ڕووی دا");
      }
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      dispatch({ type: AUTHACTIONS.SET_LOADING, payload: false });
    }
  };

  const forgotPassword = async (email) => {
    try {
      const userDoc = doc(db, "users", email);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        await sendPasswordResetEmail(auth, email);
        alert("بەستەری ڕێستکردنەوەی وشەی نهێنی بۆ ئیمەیڵەکەت نێردرا");
      } else {
        alert("ئەم ئیمەیڵە بوونی نییە");
      }
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const createUserProfileWithSocialMediaIfNotExists = async (user) => {
    try {
      dispatch({ type: AUTHACTIONS.SET_LOADING, payload: true });

      const userDoc = doc(db, "users", user.email);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        await setDoc(userDoc, {
          email: user.email,
          fullName: user.displayName,
          phoneNumber: user.phoneNumber,
          userImageURL: user.photoURL,
          userMoney: 0,
          userMoneySpent: 0,
          isAdmin: false,
          createdAt: new Date(),
          lastLogin: new Date(),
        });
        navigate("/");
      } else {
        await updateDoc(userDoc, {
          lastLogin: new Date(),
        });
      }
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_LOADING, payload: false });
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const googleSignIn = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await createUserProfileWithSocialMediaIfNotExists(user);
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const facebookSignIn = async () => {
    try {
      const facebookProvider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      await createUserProfileWithSocialMediaIfNotExists(user);
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const editProfile = async (userData) => {
    try {
      const userDoc = doc(db, "users", userData.email);
      await updateDoc(userDoc, userData);
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message, error.code);
    }
  };

  const deleteUser = async (userEmail) => {
    try {
      // Delete the user document
      const userDoc = doc(db, "users", userEmail);
      await deleteDoc(userDoc);

      // Fetch user orders
      const userOrdersCollection = collection(db, "orders");
      const userOrdersSnapshot = await getDocs(userOrdersCollection);

      // Convert the snapshot to an array of documents
      const userOrders = userOrdersSnapshot.docs.filter(
        (userOrder) => userOrder.data().user.email === userEmail
      );
      // Delete each user order
      userOrders.forEach(async (userOrderDoc) => {
        await deleteDoc(userOrderDoc.ref);
      });

      // Delete user reviews
      const userReviewsCollection = collection(db, "reviews");
      const userReviewsSnapshot = await getDocs(userReviewsCollection);
      const userReviews = userReviewsSnapshot.docs.filter(
        (userReview) => userReview.user.email == userEmail
      );
      userReviews.forEach(async (userReviewDoc) => {
        await deleteDoc(userReviewDoc.ref);
      });

      // Delete user address
      const userAddressCollection = collection(
        db,
        `users/${userEmail}/address`
      );
      const userAddressSnapshot = await getDocs(userAddressCollection);
      userAddressSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Delete user cart
      const userCartCollection = collection(db, `users/${userEmail}/cart`);
      const userCartSnapshot = await getDocs(userCartCollection);
      userCartSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Delete user wishlists
      const userWishListsCollection = collection(
        db,
        `users/${userEmail}/wishLists`
      );
      const userWishListsSnapshot = await getDocs(userWishListsCollection);
      userWishListsSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const logOutUser = async () => {
    try {
      await signOut(auth);
      dispatch({ type: AUTHACTIONS.SET_LOGOUT, payload: null });
      return (window.location.href = "/");
    } catch (error) {
      dispatch({ type: AUTHACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const contextData = {
    state,
    dispatch,
    loading: state.loading,
    user: state.user,
    error: state.error,
    users: state.users,
    signUpUser,
    loginUser,
    forgotPassword,
    googleSignIn,
    facebookSignIn,
    editProfile,
    deleteUser,
    logOutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
