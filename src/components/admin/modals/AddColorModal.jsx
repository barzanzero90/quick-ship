import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useProperties } from "../../../context/PropertiesContext";
import { PROPERTIESACTIONS } from "../../../actions/propertiesActions";
import { hideScrollBar } from "../../../hooks/hideScrollBar";

const AddColorModal = ({ showAddColorModal, setShowAddColorModal }) => {
  const { addColor, dispatch } = useProperties();
  const [colorName, setColorName] = useState("");
  const [colorCode, setColorCode] = useState("");

  hideScrollBar(showAddColorModal);

  const handleAddColor = async (e) => {
    e.preventDefault();

    try {
      if (colorName.trim() == "") {
        return alert("Please write color name");
      } else if (colorCode.trim() == "") {
        return alert("Please write color code");
      } else {
        const colorData = {
          colorName,
          colorCode,
          createdAt: new Date(),
        };

        await addColor(colorData);
        alert(`${colorName} color added successfully!`);
        setShowAddColorModal(false);
      }
    } catch (error) {
      dispatch({ type: PROPERTIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowAddColorModal(!showAddColorModal)}
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 h-screen w-full bg-black/50 backdrop-blur-sm"
      style={{ zIndex: 999 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[210px] rounded-md bg-white flex flex-col items-center gap-4 p-1"
      >
        <div className="flex justify-between items-center w-full">
          <span></span>
          <h3 className="text-lg font-semibold">Add color</h3>
          <button
            title="Close"
            onClick={() => setShowAddColorModal(!showAddColorModal)}
            className="hover:bg-[#969393]/25 rounded-full p-1 transform transition-all ease-in-out duration-100 active:scale-95"
          >
            <IoCloseOutline size={25} />
          </button>
        </div>

        <form className="flex flex-col justify-center items-center gap-3">
          <input
            type="text"
            placeholder="Color Name"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            className="w-[270px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <input
            type="text"
            placeholder="Color Code"
            value={colorCode}
            onChange={(e) => setColorCode(e.target.value)}
            className="w-[270px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <button
            onClick={handleAddColor}
            className="w-[270px] p-2 bg-blue-700 text-white hover:bg-blue-800 rounded-md transform transition-all ease-in-out duration-100 active:scale-95"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddColorModal;
