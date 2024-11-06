import React from "react";
import "./paymentsuccess.css";
import { Link, useParams } from "react-router-dom";

const PaymentSuccess = ({ user }) => {
  const params = useParams();
  return (
    <div className="payment-success-page">
      {user && (
        <div className="success-message">
          <div className="checkmark-animation">
            <span className="checkmark">&#10003;</span>
          </div>
          <h2>Payment Successful!</h2>
          <p>Your course subscription has been activated</p>
          <p>Reference No: {params.id}</p>
          <Link to={`/${user._id}/dashboard`} className="goto-btn">
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
