import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLocations } from "../../context/LocationsContext";
import { IoIosArrowBack } from "react-icons/io";
import AddCityModal from "../../components/admin/modals/AddCityModal";
import { FormatMoney } from "../../utils/FormatMoney";
import { BiEdit } from "react-icons/bi";
import { PiTrash } from "react-icons/pi";
import EditCityModal from "../../components/admin/modals/EditCityModal";

const CountryPage = () => {
  const { countryId } = useParams();
  const { user } = useAuth();
  const { countries, deleteCountry, getCities, cities, deleteCity } =
    useLocations();
  const [country, setCountry] = useState(null);
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [showEditCityModal, setShowEditCityModal] = useState(false);

  const getCountry = () => {
    const foundCountry = countries.find((country) => country.id == countryId);
    setCountry(foundCountry);
  };

  useEffect(() => {
    getCountry();
  }, [countries, countryId]);

  useEffect(() => {
    if (country) {
      getCities(country.id);
    }
  }, [country]);

  return (
    <>
      {user ? (
        <>
          {user.isAdmin ? (
            <>
              {country ? (
                <div className="flex flex-col justify-center items-center gap-10">
                  <header
                    className="sticky top-0 left-0 w-full h-12 mainShadow flex justify-between items-center px-2"
                    style={{ zIndex: 3 }}
                  >
                    <button
                      title="Back"
                      onClick={() => history.back()}
                      className="hover:bg-[#969393]/15 rounded-full p-1 active:scale-95 transform transition-all ease-in-out duration-100"
                    >
                      <IoIosArrowBack size={25} />
                    </button>

                    <h3 className="text-lg font-semibold">
                      {country.countryName}
                    </h3>

                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => setShowAddCityModal(!showAddCityModal)}
                        className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 active:scale-95 transform transition-all ease-in-out duration-100"
                      >
                        Add city
                      </button>

                      <button
                        onClick={() => deleteCountry(country)}
                        className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 active:scale-95 transform transition-all ease-in-out duration-100"
                      >
                        Delete country
                      </button>
                    </div>
                  </header>

                  {showAddCityModal && (
                    <AddCityModal
                      showAddCityModal={showAddCityModal}
                      setShowAddCityModal={setShowAddCityModal}
                      country={country}
                    />
                  )}

                  <div className="flex flex-wrap justify-center items-center gap-4">
                    {cities.map((city, index) => (
                      <div
                        key={index}
                        className="flex flex-col justify-start items-start gap-2.5 border border-[#e4e4e5] rounded-md p-2"
                      >
                        <div className="w-full flex justify-between items-center px-1">
                          <button
                            title="Edit city"
                            onClick={() =>
                              setShowEditCityModal(!showEditCityModal)
                            }
                            className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 active:scale-95 transform transition-all ease-in-out duration-100"
                          >
                            <BiEdit size={25} />
                          </button>

                          <button
                            title="Delete city"
                            onClick={() => deleteCity(country.id, city.id)}
                            className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 active:scale-95 transform transition-all ease-in-out duration-100"
                          >
                            <PiTrash size={25} />
                          </button>
                        </div>

                        {showEditCityModal && (
                          <EditCityModal
                            showEditCityModal={showEditCityModal}
                            setShowEditCityModal={setShowEditCityModal}
                            countryId={country.id}
                            city={city}
                          />
                        )}

                        <div className="flex flex-col justify-start items-start gap-2 rounded-md">
                          <p>City Name: {city.cityName}</p>

                          <p>
                            Delivery Price: {FormatMoney(city.deliveryPrice)}{" "}
                            IQD
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>Country not found</>
              )}
            </>
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

export default CountryPage;
