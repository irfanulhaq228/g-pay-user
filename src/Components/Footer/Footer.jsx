import React, { useEffect, useState } from "react";
import visa from "../../assets/visa.jpeg";
import master from "../../assets/master.jpeg";
import rupay from "../../assets/rupay.jpeg";
import paypal from "../../assets/paypal.jpeg";
import { useLocation } from "react-router-dom";
import { Modal, Input, Button } from "antd"; // Added imports for Ant Design components
import { fn_sendFeedbackApi } from "../../api/api";

const paymentImages = [visa, master, rupay, paypal];

import AnimationTickmarck from "../../assets/AnimationTickmarck.gif";

const Footer = () => {
  const [hideCards, setHideCards] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [name, setName] = useState(""); // State for name input
  const [message, setMessage] = useState(""); // State for message input
  const [phone, setPhone] = useState(""); // State for phone input
  const [email, setEmail] = useState(""); // State for email input
  const [errors, setErrors] = useState({ name: "", message: "", phone: "" }); // Updated state for validation errors
  const path = useLocation();

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null); // State for API response

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

  const handleCancel = () => {
    setIsModalOpen(false);
    setName(""); // Reset name
    setMessage(""); // Reset message
    setPhone(""); // Reset phone
    setEmail(""); // Reset email
    setErrors({ name: "", message: "", phone: "" }); // Reset errors
  };

  const validateInputs = () => {
    let isValid = true;
    const newErrors = { name: "", message: "", phone: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    if (!message.trim()) {
      newErrors.message = "Message is required.";
      isValid = false;
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      setLoading(true);
      const response = await fn_sendFeedbackApi({
        feedbackMessage: message,
        feedbackSender: name,
        userPhoneNumber: phone,
        userEmail: email || "",
      });
      setResponse(response);
      if (response?.status) {
        setLoading(false);
        setTimeout(() => {
          setIsModalOpen(false);
          setName("");
          setMessage("");
          setPhone("");
          setEmail("");
          setErrors({ name: "", message: "", phone: "" });
          setResponse(null);
        }, 5000);
      } else {
        setLoading(false);
        setErrors({ name: "", message: "", phone: "" });
        alert(response?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="w-full flex flex-row items-center justify-center">
      <div
        className={`flex flex-col lg:flex-row gap-2 w-full lg:max-w-[880px] xl:max-w-[1080px] ${hideCards && "justify-center py-[5px]"
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
        <div className="flex items-center justify-center text-[18px] gap-[6px] lg:text-[22px] font-bold mt-4 lg:mt-0 lg:max-w-[300px] whitespace-nowrap">
          <span>Need help?</span>
          <span
            className="hover:underline cursor-pointer"
            onClick={() => setIsModalOpen(true)} // Open modal on click
          >
            Contact Us
          </span>
        </div>
      </div>

      {/* Ant Design Modal */}
      <Modal
        title="Contact Us"
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={
          !response?.status && [
            <Button key="cancel" onClick={handleCancel} style={{ borderColor: "#e05aa2", color: "#e05aa2" }}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleSubmit} style={{ background: "#e05aa2", borderColor: "#e05aa2" }} loading={loading}>
              Submit
            </Button>,
          ]
        }
      >
        {response?.status ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <img src={AnimationTickmarck} alt="Success" className="w-40 h-40 min-h-40 min-w-40 object-contain" />
            <span className="text-xl font-bold text-green-600 mt-2">Feedback Sent!</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Input
              required
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ borderColor: errors.name ? "red" : "#d9d9d9" }}
            />
            <Input
              required
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ borderColor: errors.phone ? "red" : "#d9d9d9" }}
            />
            <Input
              placeholder="Enter your email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderColor: "#d9d9d9" }}
            />
            <Input.TextArea
              required
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              style={{ borderColor: errors.message ? "red" : "#d9d9d9" }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Footer;