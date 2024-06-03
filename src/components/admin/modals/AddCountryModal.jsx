import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { hideScrollBar } from "../../../hooks/hideScrollBar";
import { useLocations } from "../../../context/LocationsContext";
import { LOCATION_ACTIONS } from "../../../actions/locationActions";

const AddCountryModal = ({ showAddCountryModal, setShowAddCountryModal }) => {
  hideScrollBar(showAddCountryModal);

  const [countryName, setCountryName] = useState("");
  const { addCountry, dispatch } = useLocations();

  const handleAddCountry = async () => {
    try {
      if (countryName.trim() != "") {
        const countryData = {
          countryName,
          createdAt: new Date(),
        };
        await addCountry(countryData);
        alert(`${countryName} country added successfully!`);
        setShowAddCountryModal(false);
      }
    } catch (error) {
      dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowAddCountryModal(!showAddCountryModal)}
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 h-screen w-full bg-black/50 backdrop-blur-sm"
      style={{ zIndex: 999 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[160px] rounded-md bg-white flex flex-col items-center gap-4 p-1"
      >
        <div className="flex justify-between items-center w-full">
          <span></span>
          <h3 className="text-lg font-semibold">Add country</h3>
          <button
            title="Close"
            onClick={() => setShowAddCountryModal(!showAddCountryModal)}
            className="hover:bg-[#969393]/25 rounded-full p-1 transform transition-all ease-in-out duration-100 active:scale-95"
          >
            <IoCloseOutline size={25} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Country Name"
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          required
          className="w-[270px] p-2 rounded-md border border-[#e4e4e5]"
        />

        <button
          onClick={handleAddCountry}
          className="w-[270px] p-2 bg-blue-700 text-white hover:bg-blue-800 rounded-md transform transition-all ease-in-out duration-100 active:scale-95"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddCountryModal;
