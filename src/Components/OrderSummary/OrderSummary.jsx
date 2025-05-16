import React from 'react';
import { FaIndianRupeeSign } from 'react-icons/fa6';

function OrderSummary({ amount, tax, subtotal, webInfo, paymentMethod }) {
  const CurrencySymbol = ({ method }) => {
    if (method === "Crypto") {
      return <span className="inline-block mt-[-2px]">$</span>;
    }
    return <FaIndianRupeeSign className="inline-block mt-[-2px]" />;
  };

  return (
    <div className="text-gray-400 lg:px-[22px]">
      <h2 className="sm:text-[21px] font-[700] text-black mb-4">
        Order Summary
      </h2>
      <div className="flex font-[600] justify-between sm:text-sm mb-2">
        <span>Amount:</span>
        <span><CurrencySymbol method={paymentMethod} /> {amount}</span>
      </div>
      <div className="flex font-[600] justify-between sm:text-sm mb-2">
        <span>Charges:</span>
        <span>{webInfo?.tax || 0}% ({(amount/100 * webInfo?.tax || 0).toFixed(1)})</span>
      </div>
      <div className="flex font-[600] justify-between mt-2 sm:text-sm">
        <span>Sub Total:</span>
        <span><CurrencySymbol method={paymentMethod} /> {(amount/100 * (webInfo?.tax || 0) + parseFloat(amount)).toFixed(1)}</span>
      </div>
      <div className="border-b-2 pt-2 sm:pt-5"></div>
      <div className="flex justify-between font-bold text-sm sm:text-base text-black mt-4">
        <span>Total:</span>
        <span className="text-[--main]"><CurrencySymbol method={paymentMethod} /> {(amount/100 * (webInfo?.tax || 0) + parseFloat(amount)).toFixed(1)}</span>
      </div>
    </div>
  );
}

export default OrderSummary;
