import { createContext, useReducer, useEffect, useContext } from "react";
import { LOCATION_ACTIONS } from "../actions/locationActions";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const LocationsContext = createContext();

const locationInitialState = {
  loading: true,
  countries: [],
  cities: [],
  address: [],
  error: null,
};

function locationReducer(state, action) {
  switch (action.type) {
    case LOCATION_ACTIONS.SET_LOADING:
      return {
        ...state,
      };

    case LOCATION_ACTIONS.SET_COUNTRIES:
      return {
        ...state,
        loading: false,
        countries: action.payload,
      };

    case LOCATION_ACTIONS.SET_CITIES:
      return {
        ...state,
        loading: false,
        cities: action.payload,
      };

    case LOCATION_ACTIONS.SET_ADDRESS:
      return {
        loading: false,
        address: action.payload,
      };

    case LOCATION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}

export function LocationsProvider({ children }) {
  const [state, dispatch] = useReducer(locationReducer, locationInitialState);

  const addCountry = async (countryData) => {
    try {
      const countriesCollection = collection(db, "countries");
      await addDoc(countriesCollection, countryData);
    } catch (error) {
      dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const getCountries = async () => {
    try {
      const countriesCollection = collection(db, "countries");
      onSnapshot(
        query(countriesCollection, orderBy("createdAt", "desc")),
        (snapshot) => {
          const countries = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch({
            type: LOCATION_ACTIONS.SET_COUNTRIES,
            payload: countries,
          });
        }
      );
    } catch (error) {
      dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  const deleteCountry = async (country) => {
    try {
      const citiesCollection = collection(db, `countries/${country.id}/cities`);
      const citiesSnapshot = await getDocs(citiesCollection);
      citiesSnapshot.forEach(async (city) => {
        await deleteDoc(city.ref);
      });

      const countryDoc = doc(db, "countries", country.id);
      await deleteDoc(countryDoc, country);
      alert(
        `${country.countryName} country and their cities deleted successfully!`
      );
      window.location.href = "/admin/locations";
    } catch (error) {
      dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const addCityForCountry = async (countryId, cityData) => {
    try {
      const citiesCollection = collection(db, `countries/${countryId}/cities`);
      await addDoc(citiesCollection, cityData);
    } catch (error) {
      dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const editCity = async (countryId, cityData, cityId) => {
    try {
      const cityDoc = doc(db, `countries/${countryId}/cities`, cityId);
      await updateDoc(cityDoc, cityData);
    } catch (error) {
      dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const deleteCity = async (countryId, cityId) => {
    try {
      const cityDoc = doc(db, `countries/${countryId}/cities`, cityId);
      await deleteDoc(cityDoc, cityId);
    } catch (error) {
      dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const getCities = async (countryId) => {
    try {
      const citiesCollection = collection(db, `countries/${countryId}/cities`);
      onSnapshot(
        query(citiesCollection, orderBy("createdAt", "desc")),
        (snapshot) => {
          const cities = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // console.log(cities);
          dispatch({ type: LOCATION_ACTIONS.SET_CITIES, payload: cities });
        }
      );
    } catch (error) {
      dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const getUserAddress = async (userEmail) => {
    try {
      const userAddressCollection = collection(
        db,
        `users/${userEmail}/address`
      );
      onSnapshot(
        query(userAddressCollection, orderBy("addedAt", "desc")),
        (snapshot) => {
          const address = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch({ type: LOCATION_ACTIONS.SET_ADDRESS, payload: address });
        }
      );
    } catch (error) {
      dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const addAddress = async (userEmail, addressData) => {
    try {
      const userAddressCollection = collection(
        db,
        `users/${userEmail}/address`
      );
      await addDoc(userAddressCollection, addressData);
    } catch (error) {
      dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const editAddress = async (userEmail, addressId, addressData) => {
    try {
      const userAddressDoc = doc(db, `users/${userEmail}/address`, addressId);
      await updateDoc(userAddressDoc, addressData);
    } catch (error) {
      dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const deleteAddress = async (userEmail, addressId) => {
    try {
      const userAddressDoc = doc(db, `users/${userEmail}/address`, addressId);
      await deleteDoc(userAddressDoc, addressId);
    } catch (error) {
      dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  const contextData = {
    state,
    getCountries,
    dispatch,
    loading: state.loading,
    countries: state.countries,
    error: state.error,
    addCountry,
    deleteCountry,
    addCityForCountry,
    editCity,
    deleteCity,
    getCities,
    cities: state.cities,
    getUserAddress,
    address: state.address,
    addAddress,
    editAddress,
    deleteAddress,
  };
  return (
    <LocationsContext.Provider value={contextData}>
      {children}
    </LocationsContext.Provider>
  );
}

export function useLocations() {
  return useContext(LocationsContext);
}
