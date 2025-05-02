import React, { useState } from "react";
import backgroundImage from "../../assets/background.jpg";

const Information = () => {
  const [siteURL, setSiteURL] = useState("");
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const fn_submit = (e) => {
    e.preventDefault();
    window.location.href = `/payment?username=${username}&amount=${amount}&type=direct&site=${siteURL}`;
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="bg-white/90 p-6 rounded-lg max-w-md shadow-md backdrop-blur-sm relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-[28px] font-semibold text-gray-800">
            Direct Payment
          </h2>
          <p className="text-gray-600 mt-2">
            Please fill in the details below for Direct Payment.
          </p>
        </div>
        <form className="space-y-4" onSubmit={fn_submit}>
          <div>
            <label
              htmlFor="siteURL"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Website URL:
            </label>
            <input
              type="text"
              value={siteURL}
              onChange={(e) => setSiteURL(e.target.value)}
              name="siteURL"
              placeholder="Enter Website URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              placeholder="Username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Amount:
            </label>
            <input
              type="number"
              step="0.01"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              name="amount"
              placeholder="Amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Information;
