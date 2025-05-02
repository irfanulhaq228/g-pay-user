import React, { useEffect } from "react";
import Header from "../../Components/Header/Header";
import cancel from '../../assets/cancel.gif';
import Footer from "../../Components/Footer/Footer";

const PaymentCancel = () => {
  const containerHeight = window.innerHeight - 66 - 48;
  useEffect(() => {
    window.scroll(0, 0);
    const timer = setTimeout(() => {
      window.location.replace("https://dial4bet.com");
    }, 5000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center px-4" style={{minHeight: `${containerHeight}px`}}>
        {/* Container */}
        <div className="w-full max-w-4xl text-center rounded-lg px-4">
          {/* Cancel Icon */}
          <div className="flex justify-center mb-10">
            <div className="bg-red-500 rounded-full p-2">
              <img
                src={cancel}
                alt="Cancel Icon"
                className="w-24 sm:w-28 h-24 sm:h-28 object-contain"
              />
            </div>
          </div>

          {/* Header Text */}
          <h1 className="text-3xl font-bold font-roboto text-gray-800 mb-6">
            OOPS! Payment Failed
          </h1>
          {/* Description Text */}
          <p className="text-gray-500 font-[600] text-[14px] sm:text-[16px] mb-6 leading-relaxed">
            We couldn't complete your payment. Please double-check your <br />
            payment information and try again.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => window.location.replace("https://dial4bet.com")} className="w-full sm:w-2/5 md:w-1/5 bg-[--main] font-medium text-[15px] h-[40px] text-white rounded-md hover:bg-[--main] focus:outline-none">
              Return to App
            </button>
            <button className="w-full sm:w-2/5 md:w-1/5 bg-[--main] font-medium text-[15px] h-[40px] text-white rounded-md hover:bg-[--main] focus:outline-none">
              Try Again Now
            </button>
          </div>
        </div>
      </div>

<Footer/>
      
    </div>
  );
};

export default PaymentCancel;
