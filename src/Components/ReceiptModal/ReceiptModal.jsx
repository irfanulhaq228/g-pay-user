import React from 'react';
import { Modal } from 'antd';

function ReceiptModal({ 
    isOpen, 
    receiptData, 
    onWhatsAppRedirect,
    paymentMethod = 'UPI' // 'UPI', 'Bank', or 'Crypto'
}) {
    const getCurrencySymbol = () => {
        return paymentMethod === 'Crypto' ? '$' : '₹';
    };

    const renderPaymentSpecificFields = () => {
        switch (paymentMethod) {
            case 'Bank':
                return (
                    <>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Bank Name:</span>
                            <span className="font-medium">{receiptData.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Account Number:</span>
                            <span className="font-medium">{receiptData.accountNo}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">IFSC Code:</span>
                            <span className="font-medium">{receiptData.ifsc}</span>
                        </div>
                    </>
                );
            case 'Crypto':
                return (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Wallet ID:</span>
                        <span className="font-medium">{receiptData.walletId}</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Modal
            title="Transaction Receipt"
            open={isOpen}
            footer={null}
            closable={false}
            maskClosable={false}
            centered
            width={400}
        >
            <div className="py-4">
                <div className="border-b pb-4 mb-4">
                    <h3 className="text-lg font-semibold mb-2">Transaction Details</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Transaction ID:</span>
                            <span className="font-medium">{receiptData.transactionId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-medium">{getCurrencySymbol()}{receiptData.amount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Username:</span>
                            <span className="font-medium">{receiptData.username}</span>
                        </div>
                        {renderPaymentSpecificFields()}
                        <div className="flex justify-between">
                            <span className="text-gray-600">{paymentMethod === 'Crypto' ? 'Hash ID' : 'UTR'}:</span>
                            <span className="font-medium">{receiptData.utr}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">{receiptData.date}</span>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <button
                        onClick={onWhatsAppRedirect}
                        className="bg-[--main] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                    >
                        Redirect to WhatsApp
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default ReceiptModal; 