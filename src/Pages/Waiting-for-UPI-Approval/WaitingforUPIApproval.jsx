import React, { useEffect } from "react";
import Header from "../../Components/Header/Header";
import Gpay from "../../assets/Gpay.svg";
import Blogs_Payt from "../../assets/Blogs_Payt.svg";
import Footer from "../../Components/Footer/Footer";

const WaitingforUPIApproval = () => {
  const containerHeight = window.innerHeight - 66 - 48;

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center px-4" style={{ minHeight: `${containerHeight + 10}px` }}> {/* Slightly increased minimum height */}
  <div className="h-[420px] p-8 border-l-4 border-t-2 border-t-gray-300 border-r-2 border-r-gray-300 border-b-2 border-b-gray-300 border-[--main] w-full max-w-lg">
    {/* Steps Section */}
    <div className="flex items-start mb-4">
      <div className="w-24 h-20 bg-customteal rounded flex items-center justify-center">
        <img src={Gpay} alt="GPay" className="w-16 h-8" />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="font-semibold text-gray-800">Step 1</h3>
        <p className="text-gray-600 text-sm">
          Go to <span className="text-gray-800 font-bold">Google Pay</span> Mobile app
        </p>
      </div>
    </div>

    {/* Step 2 Section */}
    <div className="flex items-start mb-4">
      <div className="w-24 h-20 bg-customteal rounded flex items-center justify-center">
        <img src={Blogs_Payt} alt="UPI" className="w-20 h-14 mt-8" />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="font-semibold text-gray-800">Step 2</h3>
        <p className="text-gray-600 text-sm">
          Check pending requests and approve payment <br /> by entering <span className="font-bold text-gray-800">UPI PIN</span>
        </p>
      </div>
    </div>

    {/* Transaction Expiry Section */}
    <div className="flex justify-center items-center lg:w-full mt-4">
      <div className="text-nowrap w-[max-content] flex items-center justify-center border-2 border-green-700 mt-10 h-[40px] rounded py-2 px-4 text-green-700 text-[16] font-[600]">
        Transaction expires in <span className="ml-2 text-black">15:00</span>
      </div>
    </div>

    {/* Cancel Button */}
    <button className="w-full font-medium py-2 mt-4 hover:underline">
      Cancel
    </button>

    {/* Payment Option Link - Kept intact */}
    <p className="text-center font-bold text-xs md:mt-6 lg:mt-6 sm:text-sm mb-2 px-2 sm:px-4">
      Can't pay with UPI?{" "}
      <a href="#" className="text-green-600 hover:underline">
        Choose another payment option
      </a>
    </p>
  </div>
</div>

      <Footer/>
    </div>
  );
};

export default WaitingforUPIApproval;
