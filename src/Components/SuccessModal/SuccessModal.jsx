import React from 'react';
import { Modal } from 'antd';
import AnimationTickmarck from "../../assets/AnimationTickmarck.gif";

function SuccessModal({ 
    isOpen, 
    transactionId,
    message = "Preparing your receipt..."
}) {
    return (
        <Modal
            title="Payment Successful"
            open={isOpen}
            footer={null}
            closable={false}
            maskClosable={false}
            centered
        >
            <div className="py-4 flex flex-col items-center">
                <div className="flex justify-center mb-4">
                    <img
                        src={AnimationTickmarck}
                        alt="Success"
                        className="w-24 h-24 object-contain"
                    />
                </div>
                <h2 className="text-xl font-bold text-green-600 mb-2">
                    Payment Submitted Successfully!
                </h2>
                <p className="text-gray-600 mb-2">
                    Transaction ID: {transactionId}
                </p>
                <p className="text-gray-500 text-center">
                    {message}
                </p>
            </div>
        </Modal>
    );
}

export default SuccessModal; 