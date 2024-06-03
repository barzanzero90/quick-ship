import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SideBar from "../../components/admin/SideBar";
import { useReviews } from "../../context/ReviewsContext";
import { BsStar, BsStarFill } from "react-icons/bs";
import { FormatDate } from "../../utils/FormatDate";
import { FormatMoney } from "../../utils/FormatMoney";
import { Link } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { PiTrash } from "react-icons/pi";
import EditReviewModal from "../../components/admin/modals/EditReviewModal";

const ReviewsPage = () => {
  const { user } = useAuth();
  const { reviews, deleteReview } = useReviews();
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(0);

  const handleSelectedReview = (selectedReview) => {
    setSelectedReview(selectedReview);
    setShowEditReviewModal(true);
  }

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
                    <h2 className="text-2xl font-bold">
                      Reviews ({reviews.length})
                    </h2>
                  </header>

                  <div className="flex flex-wrap justify-center items-center gap-4">
                    {reviews.map((review, index) => (
                      <div
                        key={index}
                        className="flex flex-col justify-center items-center gap-4 w-[300px] mainShadow rounded-md"
                      >
                        <div className="relative w-full">
                          <img
                            src={review.productThumbnailImageURL}
                            className="w-full h-[200px] object-cover rounded-tr-md rounded-tl-md"
                            alt=""
                          />

                          <div className="absolute top-2 px-2 w-full flex flex-row-reverse justify-between items-center">
                            <button
                              title="Delete review"
                              onClick={() => deleteReview(review.id)}
                              className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 active:scale-95 transform transition-all ease-in-out duration-100"
                            >
                              <PiTrash size={25} />
                            </button>

                            <button
                              title="Edit review"
                              onClick={() => handleSelectedReview(review)}
                              className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 active:scale-95 transform transition-all ease-in-out duration-100"
                            >
                              <BiEdit size={25} />
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

                        <div className="flex justify-between items-center w-full px-2 border-b border-b-[#e4e4e5]">
                          <Link
                            to={`/admin/product/${review.productId}`}
                            className="hover:underline hover:underline-offset-2 active:opacity-75"
                          >
                            <h3 className="text-lg font-semibold">
                              {review.productName}
                            </h3>
                          </Link>

                          <Link
                            to={`/admin/product/${review.productId}`}
                            className="active:opacity-75"
                          >
                            <h3 className="text-lg font-semibold">
                              {FormatMoney(review.productPrice)} IQD
                            </h3>
                          </Link>
                        </div>

                        <div className="flex justify-between items-center w-full px-2">
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

                        <p className="text-center py-1 border-b border-b-[#e4e4e5] w-full">
                          {review.reviewText}
                        </p>

                        <div className="flex justify-start items-center gap-2 w-full px-2">
                          <p>Reviewed by:</p>
                          <Link to={`/admin/customer/${review.user.email}`}>
                            <img
                              src={review.user.userImageURL}
                              className="w-10 h-10 object-cover rounded-full"
                              alt=""
                            />
                          </Link>

                          <Link
                            to={`/admin/customer/${review.user.email}`}
                            className="active:opacity-75"
                          >
                            <strong>{review.user.fullName}</strong>
                          </Link>
                        </div>
                      </div>
                    ))}
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

export default ReviewsPage;
