import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { hideScrollBar } from "../../hooks/hideScrollBar";
import { Link } from "react-router-dom";
import { FormatMoney } from "../../utils/FormatMoney";
import { BsStar, BsStarFill } from "react-icons/bs";
import { useReviews } from "../../context/ReviewsContext";
import { REVIEWS_ACTIONS } from "../../actions/reviewsActions";

const EditReviewModal = ({
  showEditReviewModal,
  setShowEditReviewModal,
  selectedReview,
}) => {
  hideScrollBar(showEditReviewModal);

  const [reviewStar, setReviewStar] = useState(selectedReview.reviewStar);
  const [reviewText, setReviewText] = useState(selectedReview.reviewText);
  const characterLimit = 1500;
  const { editReview, dispatch } = useReviews();

  const handleStarSelection = (value) => {
    // If the clicked value is the same as the current value, deselect
    if (value === reviewStar) {
      setReviewStar(0);
    } else {
      setReviewStar(value);
    }
  };

  // Function to render star icons based on selected rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleStarSelection(i)}
          style={{ cursor: "pointer", color: "#FFCD3C" }}
        >
          {i <= reviewStar ? <BsStarFill size={25} /> : <BsStar size={25} />}
        </span>
      );
    }
    return stars;
  };

  const handleEditReview = async () => {
    try {
      if (reviewText.trim() != "" && reviewStar) {
        const reviewData = {
          id: selectedReview.id,
          reviewStar,
          reviewText,
        };

        await editReview(reviewData);
        alert("بەسەرکەوتووی بۆچوونەکەت دەستکاری کرد");
        setShowEditReviewModal(false);
      }
    } catch (error) {
      dispatch({ type: REVIEWS_ACTIONS.SET_ERROR, payload: error.message });
      console.error(error.message);
    }
  };

  return (
    <div
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full h-screen bg-black/50 backdrop-blur-sm"
      onClick={() => setShowEditReviewModal(!showEditReviewModal)}
      style={{ zIndex: 999 }}
    >
      <div
        className="edit-review absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] overflow-y-auto bg-white rounded-md flex flex-col justify-start items-start gap-2 p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center w-full px-2">
          <span></span>
          <h3 className="text-lg font-semibold">دەستکاری کردنی بۆچوون</h3>
          <button
            title="داخستن"
            onClick={() => setShowEditReviewModal(!showEditReviewModal)}
            className="hover:bg-[#969393]/25 rounded-full p-1 active:scale-95 transform transition-all duration-100 ease-in-out"
          >
            <IoCloseOutline size={23} />
          </button>
        </div>

        <div className="m-auto p-4 flex flex-col justify-center items-center gap-4">
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="">
              <Link to={`/product/${selectedReview.productId}`}>
                {" "}
                <img
                  src={selectedReview.productThumbnailImageURL}
                  className="w-[500px] h-[250px] object-cover rounded-md"
                  alt=""
                />
              </Link>
            </div>

            <div className="flex flex-col justify-center items-center gap-3">
              <h3 className="text-lg font-semibold">
                <Link
                  to={`/product/${selectedReview.productId}`}
                  className="hover:underline hover:underline-offset-2"
                >
                  {selectedReview.productName}
                </Link>{" "}
                : ناوی بەرهەم
              </h3>

              {/* <h3 className="text-lg font-semibold">
                {FormatDate(selectedReview.quantity)} : ڕێککەوت
              </h3> */}

              <h3 className="text-lg font-semibold">
                {selectedReview.productQuantity} : دانە
              </h3>

              <h3 className="text-lg font-semibold">
                {FormatMoney(selectedReview.productPrice)} IQD : نرخ
              </h3>
            </div>
          </div>

          <span className="border-r border-r-[#e4e5e5] h-full w-10"></span>

          <div className="flex flex-col justify-center items-center gap-3 p-2 w-full">
            <div className="flex justify-center items-center gap-2">
              {renderStars()}
            </div>

            <div className="relative w-full">
              <textarea
                className="text-lg resize-none w-full h-[150px] p-2 text-right border border-[#e4e4e5] rounded-md"
                placeholder="بۆچوون"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                maxLength={characterLimit}
                required
              ></textarea>

              <p className="absolute bottom-2 left-2">
                {characterLimit}/{reviewText.length}
              </p>
            </div>

            <button
              onClick={handleEditReview}
              className="text-base bg-[#FF6F00] text-black transform transition-all ease-in-out duration-100 hover:text-white active:scale-95 h-10 p-2 rounded-md w-full"
            >
              دەستکاری کردنی بۆچوون
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditReviewModal;
