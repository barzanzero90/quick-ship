import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SideBar from "../../components/admin/SideBar";
import { IoIosAdd } from "react-icons/io";
import AddCountryModal from "../../components/admin/modals/AddCountryModal";
import { useLocations } from "../../context/LocationsContext";
import { Link } from "react-router-dom";

const LocationsPage = () => {
  const { user } = useAuth();
  const [showAddCountryModal, setShowAddCountryModal] = useState(false);
  const { countries } = useLocations();

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
                    <h2 className="text-2xl font-bold">Locations</h2>

                    <button
                      onClick={() =>
                        setShowAddCountryModal(!showAddCountryModal)
                      }
                      className="flex justify-center items-center gap-0.5 p-2 hover:bg-[#969393]/25 rounded-md transform transition-all ease-in-out duration-100 active:scale-95"
                    >
                      <IoIosAdd size={25} />
                      Add country
                    </button>
                  </header>

                  {showAddCountryModal && (
                    <AddCountryModal
                      showAddCountryModal={showAddCountryModal}
                      setShowAddCountryModal={setShowAddCountryModal}
                    />
                  )}
                </div>

                <div className="flex flex-wrap justify-center items-center gap-4">
                  {countries.map((country, index) => (
                    <Link
                      to={`/admin/country/${country.id}`}
                      key={index}
                      className="border border-[#e4e4e5] p-2 rounded-md hover:mainShadow"
                    >
                      <p>{country.countryName}</p>
                    </Link>
                  ))}
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

export default LocationsPage;
