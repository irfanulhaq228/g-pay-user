import axios from "axios";
import { Modal, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import React, { useEffect, useState } from "react";

import CaptureImage from "../CaptureImage";
import { BACKEND_URL, fn_uploadTransactionApi } from "../../api/api";

import { TiTick } from "react-icons/ti";
import { FaRegCopy } from "react-icons/fa6";
import cancel from "../../assets/cancel.gif";
import attention from "../../assets/attention.gif";
import cloudupload from "../../assets/cloudupload.svg";
import AnimationTickmarck from "../../assets/AnimationTickmarck.gif";
import ReceiptModal from '../ReceiptModal/ReceiptModal';
import SuccessModal from '../SuccessModal/SuccessModal';
import DuplicateTransactionModal from '../DuplicateTransactionModal/DuplicateTransactionModal';

function CryptoMethod({ setTransactionId, bank, amount, tax, total, username, type, site, onAmountChange }) {
    const navigate = useNavigate();
    const [utr, setUtr] = useState("");
    const [copyWallet, setCopyWallet] = useState(false);
    const [checkBox, setCheckBox] = useState(false);
    const [imageLoader, setImageLoader] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successData, setSuccessData] = useState({});
    const [isDuplicateModal, setIsDuplicateModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [cryptoAmount, setCryptoAmount] = useState("");
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [receiptData, setReceiptData] = useState({});

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setCryptoAmount(value);
        if (onAmountChange) {
            onAmountChange(value);
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

    const fn_submit = async () => {
        if (!selectedImage) return alert("Upload Transaction Slip");
        if (utr === "") return alert("Enter UTR Number.");
        if (!checkBox) return alert("Verify the Uploaded Receipt Checkbox");
        if(total <= 0){
            return alert("Enter valid amount");
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("image", selectedImage);
            formData.append("utr", utr);
            formData.append("amount", amount);
            formData.append("tax", tax);
            formData.append("total", total);
            formData.append("website", window.location.origin);
            formData.append("bankId", bank?._id);
            if (type && site) {
                formData.append("type", type);
                formData.append("site", site);
            } else {
                formData.append("type", "manual");
            }

            const response = await fn_uploadTransactionApi(formData, username);
            if (response?.status) {
                if (response?.data?.status === "ok") {
                    setTransactionId(response?.data?.data?.trnNo);

                    if (type === "direct") {
                        setSuccessData({
                            transactionId: response?.data?.data?.trnNo,
                            message: encodeURIComponent(
                                `*New Payment Request Received*\n\n*Username:* ${username}\n*Transaction ID:* ${response?.data?.data?.trnNo}\n*Website:* ${site}\n*Amount:* ${amount}\n*UTR:* ${utr}`
                            ),
                            phone: localStorage.getItem("phone"),
                        });
                        setShowSuccessModal(true);
                        setReceiptData({
                            transactionId: response?.data?.data?.trnNo,
                            amount: amount,
                            username: username,
                            site: site,
                            utr: utr,
                            walletId: bank?.iban,
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
                                amount,
                                username,
                                site,
                                utr,
                            },
                        });
                    }
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

    useEffect(() => {
        if (copyWallet) {
            setTimeout(() => setCopyWallet(false), 1000);
        }
    }, [copyWallet]);

    const fn_copyWallet = (text) => {
        if (text) {
            navigator.clipboard
                .writeText(text)
                .then(() => setCopyWallet(true))
                .catch((err) => console.error("Failed to copy text:", err));
        }
    };

    const handleWhatsAppRedirect = () => {
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${localStorage.getItem("phone")}&text=${encodeURIComponent(
            `*New Payment Request Received*\n\n*Username:* ${username}\n*Transaction ID:* ${receiptData.transactionId}\n*Website:* ${site}\n*Amount:* $${amount}\n*Hash ID:* ${utr}`
        )}`;
        window.location.href = whatsappUrl;
    };

    return (
        <>
            <div className="rounded-tr-md rounded-br-md flex flex-col">
                <div className="flex flex-col items-start">
                    <div>
                        {bank?.image ? (
                            <>
                                <p className="text-[17px] sm:text-[23px] font-[700] mb-[1.2rem] text-center sm:text-left">
                                    Scan to Pay
                                </p>
                                <div className="flex sm:flex-row flex-col gap-[30px] items-center sm:items-center w-full">
                                    <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                                        <img
                                            src={`${BACKEND_URL}/${bank?.image}`}
                                            alt="QR Code"
                                            className="w-full sm:w-[150px]"
                                        />
                                    </div>
                                    <div className="mb-2 sm:mb-4 text-center sm:text-left">
                                        {/* <p className="mb-1 flex items-center justify-center sm:justify-start gap-[4px]">
                                            <span className="text-[16px] font-[700]">
                                                Scan and Pay
                                            </span>{" "}
                                            <span className="text-[17px] font-[700] text-[--main] mb-[-2px]">
                                                ${total}
                                            </span>
                                        </p> */}
                                        <p className="text-[15px]">
                                            <span className="font-[500]">Crypto Wallet ID :</span>{" "}
                                            {bank?.iban}
                                            {!copyWallet ? (
                                                <FaRegCopy
                                                    className="inline-block mt-[-2px] ms-[15px] cursor-pointer"
                                                    onClick={() => fn_copyWallet(bank?.iban)}
                                                />
                                            ) : (
                                                <TiTick className="inline-block mt-[-2px] ms-[15px] scale-[1.2] cursor-pointer" />
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4 mt-[15px]">
                                    <Input
                                        prefix="$"
                                        type="number"
                                        min={1}
                                        step={0.01}
                                        placeholder="Enter amount"
                                        className="w-full h-[45px]"
                                        style={{ fontSize: '15px' }}
                                        value={cryptoAmount}
                                        onChange={handleAmountChange}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="mb-4">
                                <p className="mb-1 flex items-center gap-[4px]">
                                    <span className="text-[16px] font-[700]">Pay</span>{" "}
                                    <span className="text-[17px] font-[700] text-[--main] mb-[-2px]">
                                        ₹{total}
                                    </span>
                                </p>
                                <p className="text-[15px]">
                                    <span className="font-[500]">Crypto Wallet ID:</span> {bank?.iban}
                                </p>
                                
                            </div>
                        )}

                        <div className="flex items-center my-[18px]">
                            <img
                                src={attention}
                                alt="Attention Sign"
                                className="w-16 lg:w-[90px] mb-2 sm:mb-0 ml-[-22px]"
                            />
                            <p className="italic text-gray-500 text-[15px] mt-[-8px] sm:mt-0">
                                After transfer the payment in the Crypto Wallet <br /> please
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
                                        colors={["#000000", "#000000", "#000000", "#000000", "#000000"]}
                                    />
                                )}
                            </div>

                            <CaptureImage
                                setUtr={setUtr}
                                setImageLoader={setImageLoader}
                                axios={axios}
                                BACKEND_URL={BACKEND_URL}
                                setSelectedImage={setSelectedImage}
                            />

                            <input
                                type="text"
                                value={utr}
                                onChange={(e) => setUtr(e.target.value)}
                                placeholder="Enter Hash ID"
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

                                    This is autofill Hash ID from Your Uploaded Receipt, verify it.
                                </label>
                            </div>

                            <button
                                onClick={fn_submit}
                                disabled={isSubmitting}
                                className={`w-full ${isSubmitting ? "bg-gray-400" : "bg-[--main]"}
                  font-[500] text-[15px] h-[45px] text-white rounded-md`}
                            >
                                {isSubmitting ? "Processing..." : "Submit Now"}
                            </button>
                        </div>
                    </div>
                </div>
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
                paymentMethod="Crypto"
            />

            {/* Duplicate Transaction Modal */}
            <DuplicateTransactionModal
                isOpen={isDuplicateModal}
                onClose={() => setIsDuplicateModal(false)}
                type="Hash"
            />
        </>
    );
}

export default CryptoMethod;