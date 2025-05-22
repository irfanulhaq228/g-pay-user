import axios from "axios";
import Layout from "../../Layout/Layout";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { BACKEND_URL } from "../../api/api";
import { AiOutlineGlobal } from "react-icons/ai";
import frontImage from "../../assets/frontPage.gif";
import { FaIndianRupeeSign } from "react-icons/fa6";
import block from "../../assets/block.png";

const Information = ({ savedUsername, savedSite, savedAmount }) => {

  const navigate = useNavigate();
  const [amount, setAmount] = useState();
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [websiteList, setWebsiteList] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);

  const [websiteLogo, setWebsiteLogo] = useState("");

  const fn_getWesbiteDetails = async () => {
    const response = await axios.get(`${BACKEND_URL}/merchant/getWebsite?website=${window.location.origin}`);
    if (response?.data?.status === "ok") {
      setWebsiteLogo(response?.data?.data?.image);
      localStorage.setItem("phone", response?.data?.data?.phone);
      
      if (response?.data?.data?.block === true) {
        setIsBlocked(true);
        return;
      }
    }
  };

  useEffect(() => {
    fn_getWesbiteDetails();
    fn_getWebsiteList();
  }, []);

  const dummyWebsites = [
    "example.com",
    "mystore.net",
    "shopify.com",
    "ecommerce.org",
    "marketplace.io"
  ];

  const fn_getWebsiteList = async () => {
    const response = await axios.get(`${BACKEND_URL}/website/getAllWebsite/?website=${window.location.origin}`);
    if (response?.data?.status === "ok") {
      setWebsiteList(response?.data?.data);
    }
  }

  const fn_submit = (e) => {
    e.preventDefault();
    if(Number(amount) <= 0){
      return alert("Invalid Amount")
    }
    savedUsername(username);
    savedSite(website);
    savedAmount(amount);
    navigate(`/payment?username=${username}&amount=${amount}&type=direct&site=${website}`);
    // window.location.href = /payment?username=${username}&amount=${amount}&type=direct&site=${website};
  };

  if (isBlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl p-5 text-center rounded-lg">
          <div className="flex justify-center mb-2">
            <div className="w-96 h-96 md:w-[500px] md:h-[500px] flex items-center justify-center">
              <img src={block} alt="Block" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-[43px] font-[700] text-blue-800 mb-4 flex items-center justify-center gap-3">
            <div className="relative w-9 h-9 mt-1">
              <div className="absolute inset-0 border-4 border-red-600 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-0.5 bg-red-600 transform rotate-45"></div>
              </div>
            </div>
            Merchant is Blocked
          </h1>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <form className="flex-1 flex flex-col items-center justify-center px-[15px]" onSubmit={fn_submit}>
        {websiteLogo && websiteLogo !== "" && (
          <div className="w-full flex justify-center">
            <div className="sm:w-[350px] sm:h-[350px] overflow-hidden flex justify-center items-center p-[30px]">
              <img alt="" src={websiteLogo !== "" && `${BACKEND_URL}/${websiteLogo}`} className="object-center w-full" />
            </div>
          </div>
        )}
        <div className="w-full max-w-[408px] border-y border-r border-[#9B9B9B] rounded-full flex">
          <div className="h-[56px] min-h-[56px] w-[56px] min-w-[56px] rounded-full flex justify-center items-center outline outline-[1px] outline-[#9B9B9B]">
            <FaUser className="text-[20px] mt-[1px]" />
          </div>
          <div className="flex-1 rounded-full px-[20px] flex items-center">
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              className="h-[50px] w-full text-center text-[15px] font-[500] focus:outline-none text-black placeholder:text-[#9B9B9B]"
            />
          </div>
        </div>
        <div className="w-full max-w-[408px] border-y border-r border-[#9B9B9B] rounded-full flex mt-[17px]">
          <div className="h-[56px] min-h-[56px] w-[56px] min-w-[56px] rounded-full flex justify-center items-center outline outline-[1px] outline-[#9B9B9B]">
            <AiOutlineGlobal className="text-[22px] mt-[1px]" />
          </div>
          <div className="flex-1 rounded-full px-[20px] flex items-center">
            <select
              required
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="h-[50px] w-full text-center text-[15px] font-[500] focus:outline-none appearance-none bg-transparent cursor-pointer"
            >
              <option value="" disabled selected>Select Website</option>
              {websiteList?.map((site, index) => (
                <option key={index} value={site?.url}>
                  {site?.url}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full max-w-[408px] border-y border-r border-[#9B9B9B] rounded-full flex mt-[17px]">
          <div className="h-[56px] min-h-[56px] w-[56px] min-w-[56px] rounded-full flex justify-center items-center outline outline-[1px] outline-[#9B9B9B]">
            <FaIndianRupeeSign className="text-[22px] mt-[1px]" />
          </div>
          <div className="flex-1 rounded-full px-[20px] flex items-center">
            <input
              required
              step={0.01}
              min={1}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Desired Amount"
              className="h-[50px] w-full text-center text-[15px] font-[500] focus:outline-none placeholder:text-[#9B9B9B]"
            />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-[12px] sm:gap-[5px] w-full max-w-[408px] mt-[10px]">
          <Button setAmount={setAmount} value={500} />
          <Button setAmount={setAmount} value={1000} />
          <Button setAmount={setAmount} value={1500} />
          <Button setAmount={setAmount} value={2000} />
          <Button setAmount={setAmount} value={3000} />
        </div>
        <button type="submit" className="w-full max-w-[408px] bg-[--main] h-[57px] rounded-full mt-[30px] border text-[15px] font-[500] text-white">
          Pay Now
        </button>
      </form>
    </Layout >
  );
};

export default Information;

const Button = ({ value, setAmount }) => {
  return (
    <button
      type="button"
      onClick={() => setAmount(value)}
      className="border border-[#9B9B9B] rounded-full h-[32px] text-[11px] font-[500] transition-all duration-100 active:scale-[0.9]"
    >
      <FaIndianRupeeSign className="inline-block mt-[-2px]" />
      {" "}{value}
    </button>
  );
};