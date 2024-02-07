import { IoCloseOutline } from "react-icons/io5";
import { useState } from "react";

export type NewMessage = {
  message: string;
  type: string;
};

export function Message(props: NewMessage) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <div
          style={{ height: "420px", width: "370px" }}
          className="z-20 dark:bg-neutral-700 text-xl text-black text-center fixed top-1/2 left-1/2 p-6 bg-white rounded-3xl -translate-x-1/2 -translate-y-1/2"
        >
          <IoCloseOutline
            onClick={handleClose}
            className="cursor-pointer float-right size-7 mb-5"
          />
          <div className="clear-both"></div>

          {props.message}
          <div
            style={{ height: "70%" }}
            className="flex items-center justify-center"
          >
            {props.type === "load" ? (
              <div className="c-loader"></div>
            ) : props.type === "rejected" ? (
              <>
                <div className="circle-border"></div>
                <div className="circle">
                  <div className="error"></div>
                </div>
              </>
            ) : props.type === "successfully" ? (
              <div className="success-animation">
                <svg
                  className="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    className="checkmark__circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className="checkmark__check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </>
  );
}
