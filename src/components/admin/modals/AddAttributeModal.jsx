import React, { useState } from "react";
import { hideScrollBar } from "../../../hooks/hideScrollBar";
import { IoCloseOutline } from "react-icons/io5";
import { useProperties } from "../../../context/PropertiesContext";
import { PROPERTIESACTIONS } from "../../../actions/propertiesActions";

const AddAttributeModal = ({
  showAddAttributeModal,
  setShowAddAttributeModal,
}) => {
  hideScrollBar(showAddAttributeModal);
  const [attributeName, setAttributeName] = useState("");
  const { addAttribute, dispatch } = useProperties();

  const handleAddAttribute = async (e) => {
    e.preventDefault();

    try {
      if (attributeName.trim() != "") {
        const attributeData = {
          attributeName,
          subAttributes: [],
          createdAt: new Date(),
        };

        await addAttribute(attributeData);
        alert(`${attributeName} attribute added successfully!`);
        setShowAddAttributeModal(false);
      } else {
        return alert("Enter attribute name");
      }
    } catch (error) {
      dispatch({ type: PROPERTIESACTIONS.SET_ERROR, payload: error.message });
      console.log(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowAddAttributeModal(!showAddAttributeModal)}
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 h-screen w-full bg-black/50 backdrop-blur-sm"
      style={{ zIndex: 999 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] rounded-md bg-white flex flex-col items-center gap-4 p-1"
      >
        <div className="flex justify-between items-center w-full">
          <span></span>
          <h3 className="text-lg font-semibold">Add attribute</h3>
          <button
            title="Close"
            onClick={() => setShowAddAttributeModal(!showAddAttributeModal)}
            className="hover:bg-[#969393]/25 rounded-full p-1 transform transition-all ease-in-out duration-100 active:scale-95"
          >
            <IoCloseOutline size={25} />
          </button>
        </div>

        <form className="flex flex-col justify-center items-center gap-3">
          <input
            type="text"
            placeholder="Attribute Name"
            value={attributeName}
            onChange={(e) => setAttributeName(e.target.value)}
            className="w-[270px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <button
            onClick={handleAddAttribute}
            className="w-[270px] p-2 bg-blue-700 text-white hover:bg-blue-800 rounded-md transform transition-all ease-in-out duration-100 active:scale-95"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAttributeModal;
