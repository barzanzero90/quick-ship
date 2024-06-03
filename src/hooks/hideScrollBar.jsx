import { useEffect } from "react";

export const hideScrollBar = (modal) => {
  useEffect(() => {
    if (modal) {
      document.body.classList.add("modal-active");
    } else {
      document.body.classList.remove("modal-active");
    }

    return () => {
      document.body.classList.remove("modal-active");
    };
  }, [modal]);
};
