import "./app.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./Pages/Main-Page/MainPage";
import PaymentDone from "./Pages/Payment-Done/PaymentDone";
import PaymentCancel from "./Pages/Payment-Cancel/PaymentCancel";
import WaitingforUPIApproval from "./Pages/Waiting-for-UPI-Approval/WaitingforUPIApproval";
import Information from "./Pages/Information-Page/Information";
import RefreshPage from "./Pages/Refresh-Page/RefreshPage";

function App() {
  const [transactionId, setTransactionId] = useState("");
  const [username, setUsername] = useState("");
  const [site, setSite] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <>
      <Routes>
        <Route path="/" element={<Information savedUsername={setUsername} savedSite={setSite} savedAmount={setAmount} />} />
        <Route
          path="/payment"
          element={<MainPage setTransactionId={setTransactionId} />}
        />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route
          path="/payment-done"
          element={<PaymentDone
            transactionId={transactionId}
            username={username}
            site={site}
            amount={amount}
          />}
        />
        <Route
          path="/waiting-for-upi-approval"
          element={<WaitingforUPIApproval />}
        />
        <Route path="/refresh-page" element={<RefreshPage />} />
      </Routes>
    </>
  );
}

export default App;
