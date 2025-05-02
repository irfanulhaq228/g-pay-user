import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../Components/Header/Header";
import AnimationTickmarck from "../../assets/AnimationTickmarck.gif";
import Footer from "../../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const PaymentDone = ({ transactionId, amount, username, site }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerHeight = window.innerHeight - 66 - 48;
  const phone = localStorage.getItem("phone");
  const utr = location.state?.utr || '';

  useEffect(() => {
    setTimeout(() => {
      return window.location.replace(localStorage.getItem('web'));
    }, 5000);
    // if (!amount || amount === "") {

    // } else {
    //   const timer = setTimeout(() => {
    //     const message = encodeURIComponent(`Username: ${username}\nTransaction ID: ${transactionId}\nWebsite: ${site}\nAmount: ${amount}\nUTR: ${utr}`);
    //     const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
    //     window.open(whatsappUrl, "_blank");
    //   }, 5000);
    //   setTimeout(() => {
    //     window.location.href = "/";
    //   }, 7000);

    //   return () => clearTimeout(timer);
    // }
  }, []);

  return (
    <>
      <Header />
      <div
        className="relative flex flex-col items-center justify-center px-4"
        style={{ minHeight: `${containerHeight}px` }}
      >
        <div className="w-full max-w-4xl p-5 text-center rounded-lg">
          <div className="flex justify-center mb-4 mt-[-20px]">
            <div>
              <img
                src={AnimationTickmarck}
                alt="Success Tick Mark"
                className="w-60 h-60 md:w-60 md:h-60 object-contain"
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-4 font-roboto">
            PAYMENT REQUEST SUBMITTED
          </h1>
          <p className="text-md sm:text-lg mb-4 font-roboto">
            Transaction No: {transactionId}
          </p>

          <p className="text-gray-500 mb-4 text-[14px] font-[600] sm:text-[16px]">
            Our team is working on it and soon your balance will be added
            <br className="hidden sm:block" />
            to your wallet.
          </p>

          <button
            onClick={() => {
              const message = encodeURIComponent(`Username: ${username}\nTransaction ID: ${transactionId}\nWebsite: ${site}\nAmount: ${amount}\nUTR: ${utr}`);
              const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
              window.open(whatsappUrl, "_blank");
            }}
            className="w-3/4 md:w-1/4 bg-[--main] font-[500] mt-3 text-[15px] h-[40px] text-white rounded-md hover:bg-[--main] focus:outline-none"
          >
            Return to App
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentDone;
