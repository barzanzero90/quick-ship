import React, { useEffect, useState } from "react";
import { hideScrollBar } from "../../../hooks/hideScrollBar";
import { IoCloseOutline } from "react-icons/io5";
import { useProperties } from "../../../context/PropertiesContext";
import { PROPERTIESACTIONS } from "../../../actions/propertiesActions";
import { RiDeleteBin4Line } from "react-icons/ri";

const AttributeModal = ({
  showAttributeModal,
  setShowAttributeModal,
  attribute,
}) => {
  hideScrollBar(showAttributeModal);
  const {
    getSubAttributes,
    subAttributes,
    deleteAttribute,
    addSubAttribute,
    deleteSubAttribute,
    dispatch,
  } = useProperties();
  const [showAddSubAttributeModal, setShowAddSubAttributeModal] =
    useState(false);
  const [subAttributeName, setSubAttributeName] = useState("");

  const handleAddSubAttribute = async (e) => {
    e.preventDefault();

    try {
      if (subAttributeName.trim() != "") {
        await addSubAttribute(attribute.id, subAttributeName);
        alert(
          `${subAttributeName} sub attribute added for ${attribute.attributeName} attribute successfully!`
        );
        setSubAttributeName("");
      } else {
        return alert("Enter sub attribute name");
      }
    } catch (error) {
      dispatch({ type: PROPERTIESACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowAttributeModal(!showAttributeModal)}
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 h-screen w-full bg-black/50 backdrop-blur-sm"
      style={{ zIndex: 999 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[600px] rounded-md bg-white flex flex-col items-center gap-4 p-1"
      >
        {!showAddSubAttributeModal ? (
          <>
            <div className="flex justify-between items-center w-full">
              <button
                title="Close"
                onClick={() => setShowAttributeModal(!showAttributeModal)}
                className="hover:bg-[#969393]/25 rounded-full p-1 transform transition-all ease-in-out duration-100 active:scale-95"
              >
                <IoCloseOutline size={25} />
              </button>

              <h3 className="text-lg font-semibold">
                {attribute.attributeName} attribute
              </h3>

              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() =>
                    setShowAddSubAttributeModal(!showAddSubAttributeModal)
                  }
                  className="text-center border border-[#969393]/25 gap-0.5 p-2 hover:bg-[#969393]/25 rounded-md transform transition-all ease-in-out duration-100 active:scale-95"
                >
                  Add sub attribute
                </button>

                <button
                  onClick={() => {
                    deleteAttribute(attribute);
                    setShowAttributeModal(false);
                  }}
                  className="text-center border border-[#969393]/25 gap-0.5 p-2 hover:bg-[#969393]/25 rounded-md transform transition-all ease-in-out duration-100 active:scale-95"
                >
                  Delete attribute
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-start items-start gap-3 p-2">
              {attribute.subAttributes.map((subAttribute, index) => (
                <div
                  key={index}
                  className="relative flex justify-center items-center w-[125px] p-2 border border-[#969393]/50 rounded-md"
                >
                  <div className="absolute top-0 left-0 p-1">
                    <button
                      title="Delete"
                      onClick={() => deleteSubAttribute(subAttribute)}
                      className="p-1 rounded-full bg-red-700 text-white hover:bg-red-800 transform transition-all ease-in-out duration-100 active:scale-95"
                    >
                      <RiDeleteBin4Line size={20} />
                    </button>
                  </div>

                  <p>{subAttribute}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center w-full">
              <span></span>
              <h3 className="text-lg font-semibold">
                Add sub attribute for {attribute.attributeName} attribute
              </h3>

              <button
                title="Close"
                onClick={() =>
                  setShowAddSubAttributeModal(!showAddSubAttributeModal)
                }
                className="hover:bg-[#969393]/25 rounded-full p-1 transform transition-all ease-in-out duration-100 active:scale-95"
              >
                <IoCloseOutline size={25} />
              </button>
            </div>

            <form className="flex flex-col justify-center items-center gap-3">
              <input
                type="text"
                placeholder="Sub Attribute Name"
                value={subAttributeName}
                onChange={(e) => setSubAttributeName(e.target.value)}
                className="w-[270px] p-2 border border-[#e4e4e5] rounded-md"
              />

              <button
                onClick={handleAddSubAttribute}
                className="w-[270px] p-2 bg-blue-700 text-white hover:bg-blue-800 rounded-md transform transition-all ease-in-out duration-100 active:scale-95"
              >
                Add
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AttributeModal;
