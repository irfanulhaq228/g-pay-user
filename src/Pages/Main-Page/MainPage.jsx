import axios from "axios";
import { Modal } from "antd";
import CryptoJS from "crypto-js";
// import { io } from "socket.io-client";
import { ColorRing } from "react-loader-spinner";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Layout from "../../Layout/Layout";
import CaptureImage from "../../Components/CaptureImage";
import UPIMethod from "../../Components/UPI-Method/UPIMethod";
import CryptoMethod from "../../Components/Crypto-Method/CryptoMethod";
import OrderSummary from "../../Components/OrderSummary/OrderSummary";
import { BACKEND_URL, fn_getBanksByTabApi, fn_getWebInfoApi, fn_uploadTransactionApi } from "../../api/api";


import { TiTick } from "react-icons/ti";
import viaQr from "../../assets/viaQr.svg";
import cancel from "../../assets/cancel.gif";
import { FaRegCopy } from "react-icons/fa6";
import upilogo from "../../assets/upilogo.png";
import banklogo from "../../assets/banklogo.svg";
import usdt from "../../assets/usdt.png"
import attention from "../../assets/attention.gif";
import { FaExclamationCircle } from "react-icons/fa";
import RefreshPage from "../Refresh-Page/RefreshPage";
import cloudupload from "../../assets/cloudupload.svg";
import AnimationTickmarck from "../../assets/AnimationTickmarck.gif";
import ReceiptModal from "../../Components/ReceiptModal/ReceiptModal";
import SuccessModal from "../../Components/SuccessModal/SuccessModal";
import DuplicateTransactionModal from "../../Components/DuplicateTransactionModal/DuplicateTransactionModal";

function MainPage({ setTransactionId }) {

  // const socket = io(`${BACKEND_URL}/payment`);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [bank, setBank] = useState({});
  const site = searchParams.get("site");
  const type = searchParams.get("type");
  const [banks, setBanks] = useState([]);
  const [webInfo, setWebInfo] = useState({});
  const secretKey = "payment-gateway-project";
  const [oneTimeEncryption, setOneTimeEncryption] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [selectedUPIMethod, setSelectedUPIMethod] = useState("viaQR");

  const [originalTax, setOriginalTax] = useState("");
  const [originalTotal, setOriginalTotal] = useState("");
  const [originalAmount, setOriginalAmount] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");

  const [utr, setUtr] = useState("");
  const [checkBox, setCheckBox] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [isDuplicateModal, setIsDuplicateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

  const [cryptoAmount, setCryptoAmount] = useState("");

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState({});

  const decrypt = (encryptedValue) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const amount = searchParams.get("amount");
    const username = searchParams.get("username");
    let processedUsername = username;
    if (username && username.includes("_")) {
      const [, extractedUsername] = username.split("_");
      processedUsername = extractedUsername || username;
    }

    const isValidNumber = (value) => /^\d+(\.\d+)?$/.test(value);
    let decryptedAmount = decrypt(amount);
    let decryptedUsername = decrypt(processedUsername);

    if (!decryptedAmount || !isValidNumber(decryptedAmount)) {
      decryptedAmount = amount;
    }

    if (!decryptedUsername) {
      decryptedUsername = processedUsername;
    }

    if (decryptedAmount && decryptedUsername) {
      if (!oneTimeEncryption) {
        setOriginalAmount(amount);
        setOriginalUsername(processedUsername);
        const encryptedAmount = CryptoJS.AES.encrypt(
          decryptedAmount,
          secretKey
        ).toString();
        const encryptedUsername = processedUsername
          ? CryptoJS.AES.encrypt(processedUsername, secretKey).toString()
          : "";

        const encryptedParams = new URLSearchParams();
        encryptedParams.set("amount", encryptedAmount);
        if (encryptedUsername) {
          encryptedParams.set("username", encryptedUsername);
        }
        if (type && site) {
          navigate(`?${encryptedParams.toString()}&type=direct&site=${site}`, {
            replace: true,
          });
        } else {
          navigate(`?${encryptedParams.toString()}`, { replace: true });
        }
        setOneTimeEncryption(true);
      }
    }
  }, [location.search, navigate, oneTimeEncryption]);

  useEffect(() => {
    window.scroll(0, 0);
    setCheckBox(false);
    fn_getBanks(selectedMethod.toLowerCase());
    fn_getWebInfo();
    fn_getWesbiteDetails();
  }, [selectedMethod]);

  const fn_getBanks = async (tab) => {
    const response = await fn_getBanksByTabApi(tab);
    if (response?.status) {
      setBank(response?.data?.[0] || {});
      setBanks(response?.data || []);
      setSelectedBank(response?.data?.[0] || {});
    } else {
      setBank({});
    }
  };

  const fn_getWebInfo = async () => {
    const response = await fn_getWebInfoApi();
    if (response?.status) {
      setWebInfo(response?.data || {});
    } else {
      setBank({});
    }
  };

  const fn_selectImage = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setImageLoader(true);
    setUtr("");

    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(`${BACKEND_URL}/extract-utr`, formData);
    setImageLoader(false);
    if (response?.status === 200) {
      setUtr(response?.data?.UTR || "");
    } else {
      setUtr(response?.data?.UTR || "");
    }
    return;
  };

  const fn_Banksubmit = async () => {
    if (!selectedImage) {
      alert("Upload Transaction Slip");
      return;
    }
    if (utr === "") {
      alert("Enter UTR Number");
      return;
    }
    if (!checkBox) {
      alert("Verify the Uploaded Receipt Checkbox");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("utr", utr);
      formData.append("amount", originalAmount);
      formData.append("tax", webInfo?.tax || 0);
      formData.append(
        "total",
        (
          (originalAmount / 100) * (webInfo?.tax || 0) +
          parseFloat(originalAmount)
        ).toFixed(1)
      );
      formData.append("website", window.location.origin);
      formData.append("bankId", selectedBank?._id);
      if (type && site) {
        formData.append("type", type);
        formData.append("site", site);
      } else {
        formData.append("type", "manual");
      }

      const response = await fn_uploadTransactionApi(formData, originalUsername);
      if (response?.status) {
        if (response?.data?.status === "ok") {
          setTransactionId(response?.data?.data?.trnNo);
          if (type === "direct") {
            setSuccessData({
              transactionId: response?.data?.data?.trnNo,
              message: encodeURIComponent(
                `*New Payment Request Received*\n\n*Username:* ${originalUsername}\n*Transaction ID:* ${response?.data?.data?.trnNo}\n*Website:* ${site}\n*Amount:* ${originalAmount}\n*UTR:* ${utr}`
              ),
              phone: localStorage.getItem("phone"),
            });
            setShowSuccessModal(true);
            setReceiptData({
              transactionId: response?.data?.data?.trnNo,
              amount: originalAmount,
              username: originalUsername,
              site: site,
              utr: utr,
              bankName: selectedBank?.bankName,
              accountNo: selectedBank?.accountNo,
              ifsc: selectedBank?.iban,
              date: new Date().toLocaleString()
            });
            setTimeout(() => {
              setShowSuccessModal(false);
              setShowReceiptModal(true);
            }, 2000);
          } else {
            navigate("/payment-done", {
              state: {
                transactionId: response?.data?.data?.trnNo,
                amount: originalAmount,
                username: originalUsername,
                site,
                utr,
              },
            });
          }

          setUtr("");
          setSelectedImage({});
        } else if (response?.message?.toLowerCase().includes("unique utr")) {
          setIsDuplicateModal(true);
        } else {
          alert(response?.message || "Something Went Wrong");
        }
      } else if (response?.message?.toLowerCase().includes("unique utr")) {
        setIsDuplicateModal(true);
      } else {
        alert(response?.message || "Something Went Wrong");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fn_getWesbiteDetails = async () => {
    const response = await axios.get(`${BACKEND_URL}/merchant/getWebsite?website=${window.location.origin}`);
    if (response?.data?.status === "ok") {
      localStorage.setItem("web", response?.data?.data?.merchantWebsite);
    }
  };

  const isValidNumber = (value) => /^\d+(\.\d+)?$/.test(value);
  const [copyIban, setCopyIban] = useState(false);
  const [copyAccount, setCopyAccount] = useState(false);
  const [copyBankName, setCopyBankName] = useState(false);
  const [copyHolderName, setCopyHolderName] = useState(false);
  const [copyWallet, setCopyWallet] = useState(false);

  useEffect(() => {
    if (copyBankName) {
      setTimeout(() => setCopyBankName(false), 1000);
    }
    if (copyHolderName) {
      setTimeout(() => setCopyHolderName(false), 1000);
    }
    if (copyAccount) {
      setTimeout(() => setCopyAccount(false), 1000);
    }
    if (copyIban) {
      setTimeout(() => setCopyIban(false), 1000);
    }
    if (copyWallet) {
      setTimeout(() => setCopyWallet(false), 1000);
    }
  }, [copyBankName, copyHolderName, copyAccount, copyIban, copyWallet]);

  const fn_copy = (label, text) => {
    if (label === "copyBankName") {
      navigator.clipboard.writeText(text).then(() => setCopyBankName(true));
    }
    if (label === "copyHolderName") {
      navigator.clipboard.writeText(text).then(() => setCopyHolderName(true));
    }
    if (label === "copyAccount") {
      navigator.clipboard.writeText(text).then(() => setCopyAccount(true));
    }
    if (label === "copyIban") {
      navigator.clipboard.writeText(text).then(() => setCopyIban(true));
    }
    if (label === "copyWallet") {
      navigator.clipboard.writeText(text).then(() => setCopyWallet(true));
    }
  };

  const handleCryptoAmountChange = (amount) => {
    setCryptoAmount(amount);
  };

  const handleWhatsAppRedirect = () => {
    let whatsappUrl = "";
    if (selectedMethod === "Crypto") {
      whatsappUrl = `https://api.whatsapp.com/send?phone=${localStorage.getItem("phone")}&text=${encodeURIComponent(
        `*New Payment Request Received*\n\n*Username:* ${originalUsername}\n*Transaction ID:* ${receiptData.transactionId}\n*Website:* ${site}\n*Amount:* ${originalAmount}\n*Hash ID:* ${utr}`
      )}`;
    } else {
      whatsappUrl = `https://api.whatsapp.com/send?phone=${localStorage.getItem("phone")}&text=${encodeURIComponent(
        `*New Payment Request Received*\n\n*Username:* ${originalUsername}\n*Transaction ID:* ${receiptData.transactionId}\n*Website:* ${site}\n*Amount:* ${originalAmount}\n*UTR:* ${utr}`
      )}`;
    }
    window.location.href = whatsappUrl;
  };

  const renderSidebar = () => {
    switch (selectedMethod) {
      case "UPI":
        return banks?.map((item) => (
          <div
            onClick={() => {
              setSelectedUPIMethod("viaQR");
              setSelectedBank(item);
            }}
            className={`p-2 border-l-[6px] border-b-2 border-gray-300 flex items-center gap-2 cursor-pointer ${selectedBank?._id === item?._id ? "border-l-[--bred] bg-white" : "border-l-gray-300"
              }`}
          >
            <img src={viaQr} alt="Via QR" className="w-8 h-8" />
            <p className="font-bold text-[19px]">UPI</p>
            <span className="text-[13px] font-[500] mt-[1px]">
              ({item?.iban})
            </span>
          </div>
        ));
      case "Bank":
        return banks?.map((item) => (
          <div
            className={`flex gap-1 h-12 cursor-pointer border-l-[6px] border-l-[--bred] text-black border-b-2 border-gray-300 ${selectedBank?._id === item?._id ? "border-l-[--bred] bg-white" : "border-l-gray-300"
              }`}
            onClick={() => setSelectedBank(item)}
          >
            <p className="text-[19px] font-[700] pt-2 ms-3">
              {item?.bankName}
            </p>
          </div>
        ));
      case "Crypto":
        return banks?.map((item) => (
          <div
            onClick={() => setSelectedBank(item)}
            className={`p-2 border-l-[6px] border-b-2 border-gray-300 flex items-center gap-2 cursor-pointer ${selectedBank?._id === item?._id ? "border-l-[--bred] bg-white" : "border-l-gray-300"
              }`}
          >
            {/* <img
              src={`/icons/crypto/${item?.cryptoName?.toLowerCase()}.png`}
              alt={item?.cryptoName}
              className="w-8 h-8"
            /> */}
            {/* <p className="font-bold text-[19px]">{item?.cryptoName}</p> */}
            <p className="font-bold text-[19px]">Crypto
              <span className="text-[13px] font-[500] ml-2 mt-[1px]">
                ({item?.iban?.slice(0, 5)}...{item?.iban?.slice(-5)})
              </span>
            </p>
          </div>
        ));
    }
  };

  const renderPaymentForm = () => {
    if (selectedMethod === "UPI") {
      return (
        <UPIMethod
          setTransactionId={setTransactionId}
          selectedUPIMethod={selectedUPIMethod}
          bank={selectedBank}
          amount={originalAmount}
          tax={webInfo?.tax || 0}
          type={type}
          site={site}
          total={(
            (originalAmount / 100) * (webInfo?.tax || 0) +
            parseFloat(originalAmount)
          ).toFixed(1)}
          username={originalUsername}
        />
      );
    } else if (selectedMethod === "Crypto") {
      return (
        <CryptoMethod
          setTransactionId={setTransactionId}
          bank={selectedBank}
          amount={cryptoAmount}
          tax={webInfo?.tax || 0}
          type={type}
          site={site}
          total={cryptoAmount ? (
            (parseFloat(cryptoAmount) / 100) * (webInfo?.tax || 0) +
            parseFloat(cryptoAmount)
          ).toFixed(1) : ""}
          username={originalUsername}
          onAmountChange={handleCryptoAmountChange}
        />
      );
    } else {
      return (
        <div className="rounded-tr-md rounded-br-md flex flex-col">
          {bank?.image ? (
            <>
              <p className="text-[17px] sm:text-[23px] font-[700] mb-4 text-center sm:text-left">
                Scan to Pay
              </p>
              <img
                src={`${BACKEND_URL}/${bank?.image}`}
                alt="QR Code"
                className="w-[95px] sm:w-[110px] mb-5"
              />
            </>
          ) : null}
          <div className="text-sm sm:text-base font-roboto mt-1">
            <div className="grid grid-cols-2 gap-y-1 text-[17px] sm:text-[23px] font-[700] text-gray-700">
              <span className="text-[16px] font-[700] text-gray-700">
                Bank Name:
              </span>
              <span className="text-[14px] font-[500]">
                {selectedBank?.bankName}
                {!copyBankName ? (
                  <FaRegCopy
                    className="inline-block mt-[-2px] ms-[15px] cursor-pointer"
                    onClick={() =>
                      fn_copy("copyBankName", selectedBank?.bankName)
                    }
                  />
                ) : (
                  <TiTick className="inline-block mt-[-2px] ms-[15px] scale-[1.2] cursor-pointer" />
                )}
              </span>

              <span className="text-[16px] font-[700] text-gray-700">
                Account Holder Name:
              </span>
              <span className="text-[14px] font-[500]">
                {selectedBank?.accountHolderName}
                {!copyHolderName ? (
                  <FaRegCopy
                    className="inline-block mt-[-2px] ms-[15px] cursor-pointer"
                    onClick={() =>
                      fn_copy(
                        "copyHolderName",
                        selectedBank?.accountHolderName
                      )
                    }
                  />
                ) : (
                  <TiTick className="inline-block mt-[-2px] ms-[15px] scale-[1.2] cursor-pointer" />
                )}
              </span>

              <span className="text-[16px] font-[700] text-gray-700">
                Account Number:
              </span>
              <span className="text-[14px] font-[500]">
                {selectedBank?.accountNo}
                {!copyAccount ? (
                  <FaRegCopy
                    className="inline-block mt-[-2px] ms-[15px] cursor-pointer"
                    onClick={() =>
                      fn_copy("copyAccount", selectedBank?.accountNo)
                    }
                  />
                ) : (
                  <TiTick className="inline-block mt-[-2px] ms-[15px] scale-[1.2] cursor-pointer" />
                )}
              </span>

              <span className="text-[16px] font-[700] text-gray-700">
                IFSC:
              </span>
              <span className="text-[14px] font-[500] break-words">
                {selectedBank?.iban}
                {!copyIban ? (
                  <FaRegCopy
                    className="inline-block mt-[-2px] ms-[15px] cursor-pointer"
                    onClick={() => fn_copy("copyIban", selectedBank?.iban)}
                  />
                ) : (
                  <TiTick className="inline-block mt-[-2px] ms-[15px] scale-[1.2] cursor-pointer" />
                )}
              </span>
            </div>
          </div>

          <div
            className={`flex items-center space-x-3 sm:space-x-1 ${selectedBank?.image ? "mb-2" : "mt-1 mb-2"
              }`}
          >
            <img
              src={attention}
              alt="Attention Sign"
              className="w-12 sm:w-16 lg:w-24 -ml-5"
            />
            <p className="italic text-gray-500 -ml-8">
              After transfer the payment in above bank <br /> please
              attach the receipt below.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 sm:items-center">
              <label className="w-[150px]">
                <input
                  type="file"
                  className="cursor-pointer hidden"
                  onChange={(e) => fn_selectImage(e)}
                />
                <div className="px-2 sm:px-3 py-1 sm:py-2 h-[35px] sm:h-[45px] border border-black rounded-md cursor-pointer flex items-center justify-center text-gray-700 w-[120px] sm:w-auto">
                  <img
                    src={cloudupload}
                    alt="Upload"
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                  />
                  <span className="text-gray-400 text-sm sm:text-base font-[400] text-nowrap">
                    Upload File
                  </span>
                </div>
              </label>
              <p className="text-[14px] font-[600]">
                {!selectedImage ? (
                  <span>Attach transaction slip here</span>
                ) : (
                  <span>{selectedImage?.name?.length > 20 ? selectedImage.name.slice(0, 20) + "..." : selectedImage?.name}</span>
                )}
              </p>
              {imageLoader && (
                <ColorRing
                  visible={true}
                  height="45"
                  width="45"
                  ariaLabel="color-ring-loading"
                  wrapperStyle={{}}
                  wrapperClass="color-ring-wrapper"
                  colors={[
                    "#000000",
                    "#000000",
                    "#000000",
                    "#000000",
                    "#000000",
                  ]}
                />
              )}
            </div>

            <CaptureImage setUtr={setUtr} setImageLoader={setImageLoader} axios={axios} BACKEND_URL={BACKEND_URL} setSelectedImage={setSelectedImage} />
            <input
              type="text"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              placeholder="Enter UTR Number"
              className="w-full text-gray-800 font-[400] border border-[--secondary] h-[45px] px-[20px] rounded-md focus:outline-none text-[15px]"
            />
            <div className="flex items-center gap-[7px]">
              <input
                type="checkbox"
                id="check-box"
                onChange={(e) => setCheckBox(e.target.checked)}
              />
              <label
                htmlFor="check-box"
                className="text-[14px] font-[500] cursor-pointer"
              >
                This is autofill UTR from Your Uploaded Receipt,
                verify it.
              </label>
            </div>
            <button
              onClick={fn_Banksubmit}
              disabled={isSubmitting}
              className={`w-full ${isSubmitting ? "bg-gray-400" : "bg-[--main]"
                } font-[500] text-[15px] h-[45px] text-white rounded-md`}
            >
              {isSubmitting ? "Processing..." : "Submit Now"}
            </button>
          </div>
        </div>
      );
    }
  };

  if (!isValidNumber(originalAmount)) {
    return <RefreshPage />;
  };

  return (
    <Layout>
      <div className="w-full max-w-[1200px] mx-auto my-[30px] md:my-[100px] sm:my-[60px] px-4 sm:px-0 md:scale-[0.9]">
        <main className="flex flex-col-reverse lg:flex-row gap-[60px] md:gap-2">
          <div className="w-full lg:w-[70%] max-w-[1000px] bg-white sm:px-6 lg:pe-[40px]">
            {/* Payment method tabs */}
            <div className="flex flex-row mb-8 sm:mb-12">
              <div
                onClick={() => setSelectedMethod("UPI")}
                className={`w-1/2 sm:w-1/2 sm:max-w-[400px] p-3 sm:p-4 ${selectedMethod === "UPI"
                  ? "outline outline-[2px] outline-[--main]"
                  : "outline outline-[1px] outline-r-0 outline-[--secondary]"
                  } flex items-center justify-center cursor-pointer h-18 sm:h-28 lg:h-48 rounded-none lg:rounded-l-[10px]`}
              >
                <img
                  src={upilogo}
                  alt="UPI Logo"
                  className="w-16 h-16 sm:w-32 sm:h-32 lg:w-52 lg:h-52 object-contain"
                />
              </div>
              <div
                onClick={() => setSelectedMethod("Bank")}
                className={`w-1/2 sm:w-1/2 p-3 sm:p-4 ${selectedMethod === "Bank"
                  ? "outline outline-[2px] outline-[--main]"
                  : "outline outline-[1px] outline-r-0 outline-[--secondary]"
                  } flex items-center justify-center cursor-pointer h-18 sm:h-28 lg:h-48`}
              >
                <img
                  src={banklogo}
                  alt="Bank Transfer Logo"
                  className="w-16 h-16 sm:w-32 sm:h-32 lg:w-60 lg:h-60 object-contain"
                />
              </div>

              <div
                onClick={() => setSelectedMethod("Crypto")}
                className={`w-1/2 sm:w-1/2 p-3 sm:p-4 ${selectedMethod === "Crypto"
                  ? "outline outline-[2px] outline-[--main]"
                  : "outline outline-[1px] outline-r-0 outline-[--secondary]"
                  } flex items-center justify-center cursor-pointer h-18 sm:h-28 lg:h-48 rounded-none lg:rounded-r-[10px]`}
              >
                <img
                  src={usdt}
                  alt="Crypto Transfer Logo"
                  className="w-6 h-6 sm:w-12 sm:h-12 lg:w-24 lg:h-24 object-contain"
                />
              </div>

            </div>

            {Object.keys(bank).length > 0 ? (
              <div className="flex flex-col sm:flex-row md:min-h-[700px]">
                {/* Sidebar */}
                <div className="w-full sm:w-1/3 bg-[--grayBg] flex flex-col border-t border-[--secondary]">
                  {renderSidebar()}
                </div>

                {/* Payment Form Section */}
                <div className="w-full sm:w-2/3 border rounded-r-[10px] px-[1.7rem] py-[1.3rem]">
                  {renderPaymentForm()}
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row md:min-h-[700px]">
                <p className="text-center w-full">
                  <FaExclamationCircle className="inline-block text-[22px] mt-[-3px]" />
                  &nbsp;&nbsp;No {selectedMethod === "UPI" ? "UPI" : selectedMethod === "Bank" ? "Bank" : "Crypto"} Account Added
                </p>
              </div>
            )}
          </div>

          {/* Right Section (30%) - Order Summary */}
          <div className="w-full lg:w-[30%] bg-white text-gray-400 sm:px-6 lg:pr-0 lg:ps-6 lg:border-l-2 border-l-2-[--secondary]">
            <OrderSummary
              amount={selectedMethod === "Crypto" ? parseFloat(cryptoAmount || 0) : parseFloat(originalAmount)}
              tax={selectedMethod === "Crypto" ? (cryptoAmount ? parseFloat(webInfo?.tax || 0) : 0) : parseFloat(originalTax)}
              subtotal={selectedMethod === "Crypto" ? (cryptoAmount ? parseFloat(cryptoAmount) : 0) : parseFloat(originalTotal)}
              webInfo={webInfo}
              paymentMethod={selectedMethod}
            />
          </div>
        </main>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        transactionId={successData.transactionId}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceiptModal}
        receiptData={receiptData}
        onWhatsAppRedirect={handleWhatsAppRedirect}
        paymentMethod="Bank"
      />

      {/* Duplicate Transaction Modal */}
      <DuplicateTransactionModal
        isOpen={isDuplicateModal}
        onClose={() => setIsDuplicateModal(false)}
        type="UTR"
      />
    </Layout>
  );
}

export default MainPage;
