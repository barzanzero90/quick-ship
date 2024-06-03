import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useBrands } from "../../../context/BrandsContext";
import { BRANDSACTIONS } from "../../../actions/brandsActions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase/firebaseConfig";
import { hideScrollBar } from "../../../hooks/hideScrollBar";

const AddBrandModal = ({ showAddBrandModal, setShowAddBrandModal }) => {
  const { addBrand, dispatch } = useBrands();
  const [brandImage, setBrandImage] = useState(null);
  const [brandName, setBrandName] = useState("");
  const [brandSlug, setBrandSlug] = useState("");

  hideScrollBar(showAddBrandModal);

  const handleUploadBrandImage = async () => {
    try {
      const storageRef = ref(storage, `${brandImage.name}`);
      await uploadBytes(storageRef, brandImage);
      const brandImageURL = await getDownloadURL(storageRef);
      return brandImageURL;
    } catch (error) {}
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();

    try {
      if (brandName.trim() == "") {
        return alert("Please write brand name");
      } else if (brandSlug.trim() == "") {
        return alert("Please write brand slug");
      } else {
        let brandImageURL = null;
        if (brandImage) {
          brandImageURL = await handleUploadBrandImage();
        }

        const brandData = {
          brandImageURL,
          brandName,
          brandSlug,
          createdAt: new Date(),
        };

        await addBrand(brandData);
        alert("Brand added successfully!");
        setShowAddBrandModal(false);
      }
    } catch (error) {
      dispatch({ type: BRANDSACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowAddBrandModal(!showAddBrandModal)}
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 h-screen w-full bg-black/50 backdrop-blur-sm"
      style={{ zIndex: 999 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[270px] rounded-md bg-white flex flex-col items-center gap-4 p-1"
      >
        <div className="flex justify-between items-center w-full">
          <span></span>
          <h3 className="text-lg font-semibold">Add brand</h3>
          <button
            title="Close"
            onClick={() => setShowAddBrandModal(!showAddBrandModal)}
            className="hover:bg-[#969393]/25 rounded-full p-1 transform transition-all ease-in-out duration-100 active:scale-95"
          >
            <IoCloseOutline size={25} />
          </button>
        </div>

        <form className="flex flex-col justify-center items-center gap-3">
          <input
            type="FILE"
            placeholder="Brand Image"
            accept="images/*"
            onChange={(e) => setBrandImage(e.target.files[0])}
            className="w-[270px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <input
            type="text"
            placeholder="Brand Name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-[270px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <input
            type="text"
            placeholder="Brand Slug"
            value={brandSlug}
            onChange={(e) => setBrandSlug(e.target.value)}
            className="w-[270px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <button
            onClick={handleAddBrand}
            className="w-[270px] p-2 bg-blue-700 text-white hover:bg-blue-800 rounded-md transform transition-all ease-in-out duration-100 active:scale-95"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBrandModal;
