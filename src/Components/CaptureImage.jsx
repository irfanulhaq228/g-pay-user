import { Modal } from 'antd';
import Webcam from 'react-webcam';
import React, { useCallback, useRef, useState } from 'react';

import { IoCamera } from 'react-icons/io5';

const CaptureImage = ({ setUtr, setImageLoader, axios, BACKEND_URL, setSelectedImage }) => {

    const webcamRef = useRef(null);
    const [open, setOpen] = useState(false);

    const fn_openCameraModal = () => {
        setUtr("");
        setOpen(true);
        setImageLoader(false);
        setSelectedImage(null);
    };

    const captureAndUpload = useCallback(async () => {
        if (!webcamRef.current || !webcamRef.current.video) return;

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
            console.error("Screenshot failed!");
            return;
        }

        try {
            const response = await fetch(imageSrc);
            const blob = await response.blob();
            const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });

            setUtr("");
            setImageLoader(true);

            const formData = new FormData();
            formData.append("image", file);

            setOpen(false);

            const apiResponse = await axios.post(`${BACKEND_URL}/extract-utr`, formData);
            console.log("API Response:", apiResponse);

            setImageLoader(false);
            setSelectedImage(file);
            setUtr(apiResponse?.data?.UTR || "");
        } catch (error) {
            console.error("Error uploading image:", error);
            setImageLoader(false);
        }
    }, [setImageLoader, setUtr, setOpen, open]);

    return (
        <>
            {/* <div className="flex sm:hidden px-2 sm:px-3 py-1 sm:py-2 h-[35px] sm:h-[45px] border border-black rounded-md cursor-pointer items-center justify-center text-gray-700 w-full sm:w-auto" onClick={fn_openCameraModal}>
                <IoCamera className="scale-[1.3] me-[10px]" />
                <span className="text-gray-400 text-sm sm:text-base font-[400] text-nowrap">
                    Capture Image
                </span>
            </div> */}
            {/* camera modal */}
            <Modal
                title="Capture Image"
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                centered
                footer={null}
                bodyStyle={{ maxHeight: '480px', height: "90vh" }}
            >
                <div className="flex flex-col w-full h-full items-center">
                    <div className="w-full flex-grow bg-gray-100 rounded-[5px]">
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={"100%"}
                            height={"100%"}
                            forceScreenshotSourceSize
                            videoConstraints={{ facingMode: "environment" }}
                            className="w-full h-full max-w-sm rounded-lg shadow-lg"
                        />
                    </div>
                    <button onClick={captureAndUpload} className="h-[40px] w-full bg-[--main] mt-[10px] font-[500] text-[14px] rounded-[5px]">Capture Image</button>
                </div>
            </Modal>
        </>
    )
}

export default CaptureImage