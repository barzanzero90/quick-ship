import React, { useEffect, useRef, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { PiTrash } from "react-icons/pi";
import { useReviews } from "../../context/ReviewsContext";
import EditReviewModal from "./EditReviewModal";

const ReviewActionsModal = ({ setShowReviewActionsModal, selectedReview }) => {
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const { deleteReview } = useReviews();
  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setShowReviewActionsModal(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div
      className="absolute top-10 left-0 bg-white mainShadow p-2 rounded-md flex flex-col justify-end items-end gap-2.5 w-[215px]"
      style={{ zIndex: 999 }}
      ref={menuRef}
    >
      <button
        onClick={() => setShowEditReviewModal(!showEditReviewModal)}
        className="flex flex-row-reverse justify-start items-center gap-2 transform transition-all ease-in-out duration-200 hover:bg-[#969393]/15 active:scale-95 p-1 w-full rounded-md border-b border-b-[#e4e4e5]"
      >
        <BiEdit size={25} />
        <p>دەستکاری کردنی بۆچوون</p>
      </button>

      {showEditReviewModal && (
        <EditReviewModal
          showEditReviewModal={showEditReviewModal}
          setShowEditReviewModal={setShowEditReviewModal}
          selectedReview={selectedReview}
        />
      )}

      <button
        onClick={() => deleteReview(selectedReview.id)}
        className="flex flex-row-reverse justify-start items-center gap-2 transform transition-all ease-in-out duration-200 hover:bg-[#969393]/15 active:scale-95 p-1 w-full rounded-md"
      >
        <PiTrash size={25} />
        <p>سڕینەوەی بۆچوون</p>
      </button>
    </div>
  );
};

export default ReviewActionsModal;
