import React, { useState } from "react";
import { hideScrollBar } from "../../../hooks/hideScrollBar";
import { IoCloseOutline } from "react-icons/io5";
import { useLocations } from "../../../context/LocationsContext";
import { LOCATION_ACTIONS } from "../../../actions/locationActions";

const AddCityModal = ({ showAddCityModal, setShowAddCityModal, country }) => {
  hideScrollBar(showAddCityModal);

  const [cityName, setCityName] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const { addCityForCountry, dispatch } = useLocations();

  const handleAddCityForCountry = async (e) => {
    e.preventDefault();

    try {
      if (cityName.trim() != "" && deliveryPrice) {
        const cityData = {
          cityName,
          deliveryPrice,
          createdAt: new Date(),
        };
        await addCityForCountry(country.id, cityData);
        alert(`${cityName} city added for ${country.countryName} country`);
        setShowAddCityModal(false);
      }
    } catch (error) {
      dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowAddCityModal(!showAddCityModal)}
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 h-screen w-full bg-black/50 backdrop-blur-sm"
      style={{ zIndex: 999 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[205px] rounded-md bg-white flex flex-col items-center gap-4 p-1"
      >
        <div className="flex justify-between items-center w-full">
          <span></span>
          <h3 className="text-lg font-semibold">Add city</h3>
          <button
            title="Close"
            onClick={() => setShowAddCityModal(!showAddCityModal)}
            className="hover:bg-[#969393]/25 rounded-full p-1 transform transition-all ease-in-out duration-100 active:scale-95"
          >
            <IoCloseOutline size={25} />
          </button>
        </div>

        <form className="flex flex-col justify-center items-center gap-2.5">
          <input
            type="text"
            placeholder="City Name"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            required
            className="w-[270px] rounded-md p-2 border border-[#e4e4e5]"
          />

          <input
            type="number"
            placeholder="Delivery Price"
            value={deliveryPrice}
            onChange={(e) => setDeliveryPrice(parseInt(e.target.value))}
            required
            className="w-[270px] rounded-md p-2 border border-[#e4e4e5]"
          />

          <button
            onClick={handleAddCityForCountry}
            className="w-[270px] p-2 bg-blue-700 text-white hover:bg-blue-800 rounded-md transform transition-all ease-in-out duration-100 active:scale-95"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCityModal;
