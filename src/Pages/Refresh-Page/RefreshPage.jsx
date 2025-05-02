import React from "react";
import Lottie from "lottie-react";
import goback from "../../assets/goback.jpg";
import { BsExclamationCircleFill } from "react-icons/bs";
import errorMessage from "../../assets/errorMessage.json"

const RefreshPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
     <Lottie animationData={errorMessage} loop={true} className="w-[50px] sm:w-[200px] sm:h-[500px]" />
      <h1 className="text-[22px]  sm:text-[30px] sm:text-2xl md:text-3xl lg:text-[30px] font-bold">
        <BsExclamationCircleFill className="inline-block me-[10px] mt-[-6px]" />
        URL Expired, Try Again
      </h1>
    </div>
  );
};

export default RefreshPage;
