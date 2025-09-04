import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../BASE_URL";

const PlanGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [remainingDays, setRemainingDays] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [planName, setPlanName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const token = `Bearer ${localStorage.getItem("chemicalToken")}`;

  const fetchRemainingDays = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}api/package_booking/showRemainingDays`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const data = await response.json();

      const currentPath = location.pathname;

      const isInPaymentPage = currentPath.startsWith("/company/PackagePayment");

      if (data?.success === false && response.status === 404) {
        if (!isInPaymentPage) {
          navigate("/pricing");
        }
        return;
      }

      if (response.status === 200) {
        const days = data?.remainingDays;
        const pName = data?.planName;
        setPlanName(pName);

        if ((days === 0 || days < 0) && !isInPaymentPage) {
          navigate("/pricing");
        } else {
          setRemainingDays(days);
          setShowNotification(true); // Show notification on page load or refresh
          setTimeout(() => setShowNotification(false), 4000); // Hide after 5 seconds
        }
      } else {
        if (!isInPaymentPage) {
          navigate("/pricing");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemainingDays();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <img
          src="https://chembizzstorage.blob.core.windows.net/chembizz-files/loader1.gif"
          alt="Loading..."
          className="w-20 h-20"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {showNotification && remainingDays > 0 && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[35%] z-50">
          <div className="bg-blue-100 border border-blue-300 text-blue-900 px-4 py-3 rounded-xl shadow-md animate-noticeFadeSlide">
            <p className="text-center font-medium">
              ⏳ You have <strong>{remainingDays}</strong> day(s) left in{" "}
              {planName ?? "your plan"}.
            </p>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default PlanGuard;
