import axios from "axios";

export let BACKEND_URL = "https://backend.gpay.one";
// export const BACKEND_URL = "http://46.202.166.64:8015";



export const fn_getBanksByTabApi = async (tab) => {

    try {
        const response = await axios.get(`${BACKEND_URL}/bank/user?accountType=${tab}`);
        if (response?.status === 200) {
            if (response?.data?.status === "ok") {
                return { status: true, data: response?.data?.data }
            }
        }
    } catch (error) {
        console.log("fn_getBanksByTabApi ", error);
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message || "Something went wrong" };
        }
        return { status: false, message: "Network error" };
    }
}

export const fn_uploadTransactionApi = async (formData, username) => {
    try {
        formData.append("username", username);
        console.log("username")
        const response = await axios.post(`${BACKEND_URL}/ledger/create`, formData);
        if (response?.status === 200) {
            if (response?.data?.status === "ok") {
                return { status: true, data: response?.data, statusCode: 200 }
            }
        }
    } catch (error) {
        console.log("fn_uploadTransactionApi", error);
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message || "Something went wrong", statusCode: 400 }
        }
        if (error?.status === 401) {
            return { status: false, message: error?.response?.data?.message || "Something went wrong", statusCode: 401 }
        }
        return { status: false, message: "Network error", statusCode: 500 };
    }
}

export const fn_getWebInfoApi = async () => {
    try {
        const website = window.location.origin;
        const response = await axios.post(`${BACKEND_URL}/merchant/web-info`, { website });
        if (response?.status === 200) {
            if (response?.data?.status === "ok") {
                return { status: true, data: response?.data?.data }
            }
        }
    } catch (error) {
        console.log("fn_getBanksByTabApi ", error);
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message || "Something went wrong" }
        }
        return { status: false, message: "Network error" };
    }
}