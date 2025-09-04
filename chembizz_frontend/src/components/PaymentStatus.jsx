import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../BASE_URL";

const PaymentStatus = () => {
  const { merchantTransactionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(null);

  useEffect(() => {
    if (merchantTransactionId) {
      fetchPaymentStatus();
    }
  }, [merchantTransactionId]);

  const fetchPaymentStatus = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
      const res = await fetch(
        `${BASE_URL}api/transaction/payment_status?merchantTransactionId=${merchantTransactionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const data = await res.json();

      let code = data?.code;

      code === "PAYMENT_SUCCESS" ? setIsSuccess(true) : setIsSuccess(false);

      // console.log("dataaaa", data);

      // setIsSuccess(data?.success ?? false);
    } catch (err) {
      console.error("Error while checking payment status", err);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <img
          src="https://chembizzstorage.blob.core.windows.net/chembizz-files/loader1.gif"
          alt="Loading..."
          className="w-20 h-20"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
        {isSuccess ? (
          <>
            <div className="text-green-500 text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful
            </h2>
            <p className="text-gray-600 mb-6">
              Your transaction was completed successfully.
            </p>
          </>
        ) : (
          <>
            <div className="text-red-500 text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">
              Something went wrong. Please try again or contact support.
            </p>
          </>
        )}

        <button
          onClick={() => navigate("/company/home")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentStatus;
