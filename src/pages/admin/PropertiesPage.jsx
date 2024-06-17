import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { IoIosAdd } from "react-icons/io";
import SideBar from "../../components/admin/SideBar";
import AddColorModal from "../../components/admin/modals/AddColorModal";
import { useProperties } from "../../context/PropertiesContext";
import { RiDeleteBin4Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import AddAttributeModal from "../../components/admin/modals/AddAttributeModal";
import AttributeModal from "../../components/admin/modals/AttributeModal";

const PropertiesPage = () => {
  const { user } = useAuth();
  const { colors, deleteColor, attributes } = useProperties();
  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [showAddAttributeModal, setShowAddAttributeModal] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [showAttributeModal, setShowAttributeModal] = useState(false);

  const handleSelectAttribute = (selectedAttribute) => {
    setSelectedAttribute(selectedAttribute);
    setShowAttributeModal(true);
  };

  return (
    <>
      {user ? (
        <>
          {user.isAdmin ? (
            <div className="grid grid-cols-4 gap-5 w-full h-screen">
              <SideBar />

              <div className="col-span-3 p-2 w-full">
                <div className="flex flex-col justify-center items-center gap-5 w-full p-3">
                  <header
                    style={{ zIndex: 999 }}
                    className="sticky top-0 right-0 bg-white flex justify-between items-center w-full border-b border-b-[#969393]/25 pb-2"
                  >
                    <h2 className="text-2xl font-bold">Properties</h2>

                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => setShowAddColorModal(!showAddColorModal)}
                        className="flex justify-center items-center gap-0.5 p-2 hover:bg-[#969393]/25 rounded-md transform transition-all ease-in-out duration-100 active:scale-95"
                      >
                        <IoIosAdd size={25} />
                        Add color
                      </button>

                      <button
                        onClick={() =>
                          setShowAddAttributeModal(!showAddAttributeModal)
                        }
                        className="flex justify-center items-center gap-0.5 p-2 hover:bg-[#969393]/25 rounded-md transform transition-all ease-in-out duration-100 active:scale-95"
                      >
                        <IoIosAdd size={25} />
                        Add attribute
                      </button>
                    </div>
                  </header>

                  {showAddColorModal && (
                    <AddColorModal
                      showAddColorModal={showAddColorModal}
                      setShowAddColorModal={setShowAddColorModal}
                    />
                  )}

                  {showAddAttributeModal && (
                    <AddAttributeModal
                      showAddAttributeModal={showAddAttributeModal}
                      setShowAddAttributeModal={setShowAddAttributeModal}
                    />
                  )}

                  <div className="flex flex-col justify-start items-start gap-3 w-full border-b border-b-[#969393]/25 py-2">
                    <h2 className="text-xl font-semibold">
                      Colors ({colors.length})
                    </h2>

                    <div className="flex flex-wrap justify-center items-center gap-5">
                      {colors.map((color, index) => (
                        <div
                          key={index}
                          className="relative flex justify-between items-center p-2 w-[200px] h-20 border border-[#969393]/25 rounded-md"
                        >
                          <p>{color.colorName}</p>
                          <span
                            style={{
                              backgroundColor: `#${color.colorCode}`,
                              width: "100px",
                              height: "30px",
                              padding: "5px",
                              borderRadius: "5px",
                            }}
                          ></span>

                          <button
                            onClick={() => deleteColor(color)}
                            className="absolute top-0 left-0 p-1 rounded-full bg-red-700 text-white hover:bg-red-800 transform transition-all ease-in-out duration-100 active:scale-95"
                          >
                            <RiDeleteBin4Line size={25} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-start items-start gap-3 w-full border-b border-b-[#969393]/25 py-2">
                    <h2 className="text-xl font-semibold">
                      Attributes ({attributes.length})
                    </h2>

                    <div className="flex flex-wrap justify-center items-center gap-5">
                      {attributes.map((attribute, index) => (
                        <button
                          onClick={() => handleSelectAttribute(attribute)}
                          key={index}
                          className="relative flex justify-between items-center p-2 border border-[#969393]/25 rounded-md"
                        >
                          <p>{attribute.attributeName}</p>
                        </button>
                      ))}

                      {showAttributeModal && (
                        <AttributeModal
                          showAttributeModal={showAttributeModal}
                          setShowAttributeModal={setShowAttributeModal}
                          attribute={selectedAttribute}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>404</>
          )}
        </>
      ) : (
        <>Loading...</>
      )}
    </>
  );
};

export default PropertiesPage;
