import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useReviews } from "../context/ReviewsContext";
import { Link } from "react-router-dom";
import { FormatMoney } from "../utils/FormatMoney";
import { FormatDate } from "../utils/FormatDate";
import { BsStar, BsStarFill } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { PiTrash } from "react-icons/pi";
import EditReviewModal from "../components/modals/EditReviewModal";

const MyReviewsPage = () => {
  const { user } = useAuth();
  const { reviews, deleteReview } = useReviews();
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const handleSelectedReview = (selectedReview) => {
    setSelectedReview(selectedReview);
    setShowEditReviewModal(true);
  };

  return (
    <>
      {user ? (
        <div className="pt-[30px]">
          <div className="flex flex-col justify-end items-end w-[95%] p-2 rounded-md mainShadow mx-auto">
            <div className="flex flex-row-reverse justify-between items-center w-full px-2 pb-1.5 border-b border-b-[#e4e4e5]">
              <h2 className="text-xl font-semibold">بۆچوونەکانم</h2>
            </div>
            <div className="w-full">
              {reviews.filter((review) => review.user.email == user.email)
                .length == 0 ? (
                <strong className="text-2xl p-2 flex justify-center items-center">
                  هیچ بۆچوونێکت نییە
                </strong>
              ) : (
                <div className="flex flex-wrap justify-end items-start gap-4 p-2">
                  {reviews
                    .filter((review) => review.user.email == user.email)
                    .map((review, index) => (
                      <div key={index} className="">
                        <div className="flex flex-col justify-center items-center gap-4 w-[300px] mainShadow rounded-md">
                          <div className="relative w-full">
                            <img
                              src={review.productThumbnailImageURL}
                              className="w-full h-[200px] object-cover rounded-tr-md rounded-tl-md"
                              alt=""
                            />

                            <div className="absolute top-2 px-2 w-full flex flex-row-reverse justify-between items-center">
                              <button
                                title="دەستکاری کردنی بۆچوون"
                                onClick={() => handleSelectedReview(review)}
                                className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 active:scale-95 transform transition-all ease-in-out duration-100"
                              >
                                <BiEdit size={25} />
                              </button>

                              <button
                                title="سڕینەوەی بۆچوون"
                                onClick={() => deleteReview(review.id)}
                                className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 active:scale-95 transform transition-all ease-in-out duration-100"
                              >
                                <PiTrash size={25} />
                              </button>
                            </div>
                          </div>

                          {showEditReviewModal && (
                            <EditReviewModal
                              showEditReviewModal={showEditReviewModal}
                              setShowEditReviewModal={setShowEditReviewModal}
                              selectedReview={selectedReview}
                            />
                          )}

                          <div className="flex flex-row-reverse justify-between items-center w-full px-2 border-b border-b-[#e4e4e5]">
                            <Link
                              to={`/product/${review.productId}`}
                              className="hover:underline hover:underline-offset-2 active:opacity-75"
                            >
                              <h3 className="text-lg font-semibold">
                                {review.productName}
                              </h3>
                            </Link>

                            <Link
                              to={`/product/${review.productId}`}
                              className="active:opacity-75"
                            >
                              <h3 className="text-lg font-semibold">
                                {FormatMoney(review.productPrice)} IQD
                              </h3>
                            </Link>
                          </div>

                          <div className="flex flex-row-reverse justify-between items-center w-full px-2">
                            <div className="flex justify-center items-center gap-2">
                              {[...Array(5)].map((_, starIndex) => (
                                <React.Fragment key={starIndex}>
                                  {starIndex < review.reviewStar ? (
                                    <BsStarFill size={25} color="#FFCD3C" />
                                  ) : (
                                    <BsStar size={25} color="#FFCD3C" />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>

                            <p className="text-[#969393]">
                              {FormatDate(review.createdAt)}
                            </p>
                          </div>

                          <p className="text-center py-1">
                            {review.reviewText}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>Loading...</>
      )}
    </>
  );
};

export default MyReviewsPage;
