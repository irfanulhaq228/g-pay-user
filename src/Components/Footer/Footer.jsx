import React, { useEffect, useState } from "react";
import visa from "../../assets/visa.jpeg";
import master from "../../assets/master.jpeg";
import rupay from "../../assets/rupay.jpeg";
import paypal from "../../assets/paypal.jpeg";
import { useLocation } from "react-router-dom";

const paymentImages = [visa, master, rupay, paypal];

const Footer = () => {
  const [hideCards, setHideCards] = useState(false);
  const path = useLocation();

  useEffect(() => {
    if (
      path.pathname === "/payment-done" ||
      path.pathname === "/waiting-for-upi-approval" ||
      path.pathname === "/payment-cancel" ||
      path.pathname === "/"
    ) {
      setHideCards(true);
    }
  }, [path]);

  return (
    <div className="w-full flex flex-row items-center justify-center">
      <div
        className={`flex flex-col lg:flex-row gap-2 w-full lg:max-w-[880px] xl:max-w-[1080px] ${
          hideCards && "justify-center py-[5px]"
        }`}
      >
        {/* Payment Images Section */}
        {!hideCards && (
          <div className="w-[90%] mx-auto lg:w-full">
            <div className="w-full flex gap-2 overflow-x-auto lg:overflow-visible lg:justify-start lg:flex-wrap">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[50px] h-[32px] lg:w-[70px] lg:h-[45px] flex items-center justify-center border-2 border-gray-200 p-1"
                >
                  <img
                    src={paymentImages[index % paymentImages.length]}
                    alt={`Payment Method ${index + 1}`}
                    className="w-full h-full object-contain rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Text Section */}
        <div className="flex items-center justify-center text-[18px] lg:text-[22px] font-bold mt-4 lg:mt-0 lg:max-w-[300px] whitespace-nowrap">
          Need help? Contact Us
        </div>
      </div>
    </div>
  );
};

export default Footer;