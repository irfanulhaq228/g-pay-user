import React from 'react';
import { Modal } from 'antd';
import cancel from "../../assets/cancel.gif";

function DuplicateTransactionModal({ 
    isOpen, 
    onClose,
    type = 'UTR' // 'UTR' or 'Hash'
}) {
    return (
        <Modal
            title="Duplicate Transaction"
            open={isOpen}
            onOk={onClose}
            onCancel={onClose}
            centered
        >
            <div className="py-4 flex flex-col items-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-500 rounded-full p-2">
                        <img
                            src={cancel}
                            alt="Cancel Icon"
                            className="w-24 sm:w-28 h-24 sm:h-28 object-contain"
                        />
                    </div>
                </div>
                <p className="text-xl font-bold text-gray-800 mb-4">
                    OOPS! Duplicate {type}
                </p>
                <p className="text-red-500 font-medium text-center">
                    This {type} has already been used!
                </p>
                <p className="mt-2 text-gray-500 text-center">
                    Please enter a unique {type} for your transaction.
                </p>
            </div>
        </Modal>
    );
}

export default DuplicateTransactionModal; 