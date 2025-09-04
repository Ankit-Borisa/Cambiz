import React, { useContext, useEffect, useRef, useState } from "react";

// photos
// import banner from "../images/myprofile.png";
import banner from "../images/new-bg-profile.png";
import newBanner from "../images/newBanner.png";
import PersonalDetails from "./PersonalDetails";
import OtherDetails from "./OtherDetails";
import BillingAddress from "./BillingAddress";
import BankDetail from "./BankDetail";
import PackageDetails from "./PackageDetails";
import Sign from "./Sign";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loader from "../images/loading.png";
import { BASE_URL } from "../BASE_URL";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faCircleXmark,
  faCircleCheck,
  faCloudArrowUp,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { ProfileUpdateContext } from "../context/ProfileUpdateContect";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function getInitials(companyName) {
  if (!companyName) return "";
  const firstCharacter = companyName?.charAt(0) || "";
  const secondCharacter = companyName?.charAt(1) || "";
  return `${firstCharacter}${secondCharacter}`;
}

const Myprofile = () => {
  const navigate = useNavigate();

  const { setUpdateProfile } = useContext(ProfileUpdateContext);

  const [activeLink, setActiveLink] = useState("details");

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handlePAckageShow = () => {
    navigate("/company/packages");
  };

  const [profile, setProfile] = useState("");

  const [other, setOther] = useState("");
  const [data, setData] = useState("");

  const fetchUserData = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
    const res = await fetch(`${BASE_URL}company/cominfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();
    setProfile(data.companyDetails?.[0]);
    setOther(data?.companyDetails?.[0]?.other_info?.[0]);
  };

  const fetchAddressData = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
    const res = await fetch(`${BASE_URL}api/Billing_address/getall`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();
  };

  const fetchStampData = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
    const res = await fetch(`${BASE_URL}api/stamp/stamp`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();
    setData(data);
  };

  // useEffect(() => {
  //   fetchUserData();
  //   fetchAddressData();
  //   fetchStampData();
  // }, []);

  useEffect(() => {
    fetchUserData();
    fetchAddressData();
    fetchStampData();
  }, [activeLink]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleBillingAddressModal = () => {
    setIsOpen(!isOpen);
  };

  const [isOpen1, setIsOpen1] = useState(false);

  const toggleBillingAddressModal1 = () => {
    setIsOpen1(!isOpen1);
  };

  const [isOpen2, setIsOpen2] = useState(false);

  const toggleProfileUpdate1 = () => {
    setIsOpen2(true);
    setUpdateProfile(true);
  };

  const [loading3, setLoading3] = useState(false);

  const otherDetailsRef = useRef(null);

  const returnValue = (loading) => {
    setLoading3(loading);
  };

  const handleSaveChanges = () => {
    if (otherDetailsRef.current) {
      otherDetailsRef.current.handleSubmit();
    }
  };

  const [loading4, setLoading4] = useState(false);

  const logoRef = useRef(null);

  const logoReturnValue = (loading) => {
    setLoading4(loading);
  };

  const handleLogoSave = () => {
    if (logoRef.current) {
      logoRef.current.handleSubmit();
    }
  };

  const [membershipPlan, setMembershipPlan] = useState([]);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}api/membership_plan/display`
        );

        setMembershipPlan(response.data.data);
      } catch (error) {}
    };
    fetchCategoryList();
  }, []);

  const renderDetailComponent = () => {
    switch (activeLink) {
      case "details":
        return <PersonalDetails isOpen2={isOpen2} profile={profile} />;
      case "other":
        return (
          <OtherDetails
            ref={otherDetailsRef}
            returnValue={returnValue}
            other={other}
          />
        );
      case "billing":
        return (
          <BillingAddress
            isOpen={isOpen}
            toggleBillingAddressModal={toggleBillingAddressModal}
          />
        );
      case "bank":
        return (
          <BankDetail
            isOpen1={isOpen1}
            toggleBillingAddressModal1={toggleBillingAddressModal1}
          />
        );
      case "package":
        return <PackageDetails membershipPlan={membershipPlan} />;
      case "sign":
        return (
          <Sign ref={logoRef} logoReturnValue={logoReturnValue} data={data} />
        );
      default:
        return null;
    }
  };

  const companyInitials = getInitials(profile?.company_name);

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUploadImage, setSelectedUploadImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openPermissionModal, setOpenPermissionModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a URL for the selected image to display
      setSelectedUploadImage(file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl); // Store the selected image URL
      setIsEditing(true); // Show the check and cross icons
    }
  };

  const handleConfirm = () => {
    setOpenPermissionModal(true);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Revert to the original logo or company initials
    setSelectedImage(null);
    setIsEditing(false); // Hide the check and cross icons
  };

  const submitImage = async () => {
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("logo", selectedUploadImage);

    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;

    try {
      const response = other
        ? await axios.put(
            `${BASE_URL}api/companyotherinfo/updates/${other._id}`,
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token,
              },
            }
          )
        : await axios.post(
            `${BASE_URL}api/companyotherinfo/a`,
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token,
              },
            }
          );

      if (response.status === 200) {
        setLoading(false);
        setOpenPermissionModal(false);
        toast.success("Photo Updated Successfully!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });
        setTimeout(() => {}, 1000);
      } else {
        setOpenPermissionModal(false);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setOpenPermissionModal(false);
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    }
  };

  // code for add banner

  function centerAspectCrop(mediaWidth, mediaHeight) {
    // For banner-style images, try to use full width
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90, // Use full width
          height: (130 * 100) / 1006, // Calculate height percentage based on target ratio
        },
        1006 / 130, // Target aspect ratio
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  const [selectedBanner, setSelectedBanner] = useState(null);
  const [tempBanner, setTempBanner] = useState(null); // New state for temporary image
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 90,
    height: (130 * 100) / 1006,
    x: 0,
    y: 0,
  });
  const bannerInputRef = useRef(null);
  const imgRef = useRef(null);

  const handleBannerSelect = () => {
    bannerInputRef.current.click();
  };

  const handleBannerFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Create a temporary image to check dimensions
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;

          // If image is already close to banner proportions, use it directly
          if (Math.abs(aspectRatio - 1006 / 130) < 0.2) {
            setSelectedBanner(reader.result);
            setShowCropper(false);
          } else {
            setTempBanner(reader.result);
            setShowCropper(true);
            setCrop(undefined);
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerAspectCrop(width, height);
    setCrop(initialCrop);
  };

  const handleCropComplete = async (crop) => {
    if (!imgRef.current || !crop?.width || !crop?.height) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");

    // Set banner dimensions
    canvas.width = 1006;
    canvas.height = 130;

    const ctx = canvas.getContext("2d");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const sourceX = (crop.x * image.naturalWidth) / 100;
    const sourceY = (crop.y * image.naturalHeight) / 100;
    const sourceWidth = (crop.width * image.naturalWidth) / 100;
    const sourceHeight = (crop.height * image.naturalHeight) / 100;

    // Clear canvas and set quality settings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const base64Image = canvas.toDataURL("image/jpeg", 0.95);
    // now we have to upload the image to server .

    // Convert Base64 to Blob
    const blob = await fetch(base64Image).then((res) => res.blob());

    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;

    const formData = new FormData();
    formData.append("banner", blob, "banner.jpg");

    axios
      .patch(`${BASE_URL}api/companyotherinfo/updateCompanyBanner`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      })
      .then((res) => {
        setSelectedBanner(base64Image);
        setTempBanner(null);
        setShowCropper(false);
        // console.log("responce data ", res.data);
      })
      .catch((err) => {
        console.log("responce error", err);
      });

   
  };


  return (
    <>
      <div className="mx-5 ">
        <div>
          <div className="hidden sm:block">
            {/* banner section  */}
            {/* <img src={banner} alt="" /> */}

            <div className="relative">
              <img
                src={selectedBanner || other?.banner || newBanner}
                alt="Banner"
                className="w-full   object-cover mx-auto"
              />

              <div
                className="absolute cursor-pointer top-4 right-4 w-[30px] h-[30px] z-1 bg-blue-800 flex justify-center items-center rounded-md"
                onClick={handleBannerSelect}
              >
                <FontAwesomeIcon
                  icon={faPencil}
                  className="text-white text-sm"
                />
              </div>

              <input
                type="file"
                ref={bannerInputRef}
                onChange={handleBannerFileChange}
                style={{ display: "none" }}
                accept="image/*"
              />
            </div>
          </div>

          {/* Image Cropper Modal */}
          {showCropper && tempBanner && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg max-w-[95%] max-h-[90%] overflow-auto">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  aspect={1006 / 135}
                  locked={false}
                  ruleOfThirds={true}
                  style={{ width: "100%" }}
                >
                  <img
                    ref={imgRef}
                    src={tempBanner}
                    alt="Crop"
                    onLoad={onImageLoad}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "70vh",
                      objectFit: "contain",
                    }}
                  />
                </ReactCrop>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    onClick={() => handleCropComplete(crop)}
                  >
                    Apply
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    onClick={() => {
                      setShowCropper(false);
                      setTempBanner(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-[0px] sm:mt-[-60px] ml-0 sm:ml-5 relative">
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div className="relative">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="h-[100px] sm:h-[160px] w-[100px] sm:w-[170px] border-[5px] border-black-200 rounded-md"
                    />
                  ) : other?.logo ? (
                    <img
                      src={other?.logo}
                      alt="Company Logo"
                      className="h-[100px] sm:h-[160px] w-[100px] sm:w-[170px] border-[5px] border-black-200 rounded-md"
                    />
                  ) : (
                    <div className="flex justify-center items-center font-bold h-[100px] sm:h-[160px] w-[100px] sm:w-[170px] border-[3px] bg-gray-100 shadow-sm border-gray-200 rounded-md">
                      <p className="text-[40px]">
                        {companyInitials?.toUpperCase()}
                      </p>
                    </div>
                  )}

                  <div
                    className="absolute cursor-pointer top-0 right-0 w-[30px] h-[30px] z-1 bg-blue-800 flex justify-center items-center"
                    onClick={handleImageSelect}
                  >
                    <FontAwesomeIcon
                      icon={faPencil}
                      className="text-white text-sm"
                    />
                  </div>

                  {isEditing && (
                    <div className="absolute bottom-[-5px] w-full z-1 flex justify-center items-center gap-3">
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="text-green-500 text-2xl cursor-pointer"
                        onClick={handleConfirm}
                      />
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        className="text-red-500 text-2xl cursor-pointer"
                        onClick={handleCancel}
                      />
                    </div>
                  )}

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }} // Hide the input
                    accept="image/*" // Optional: restrict to image files only
                  />
                </div>
                <div className="pt-0 sm:pt-[60px]">
                  <div className="flex flex-col pt-3">
                    <h2 className="text-xl sm:text-3xl font-bold">
                      {profile?.company_name}
                    </h2>
                    <p className="text-sm sm:text-lg font-medium">
                      {profile._id}
                    </p>
                    <ul className="">
                      <li className="text-sm sm:text-lg">
                        MemberShip : {profile?.membership_status}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex flex-wrap gap-3 md:gap-7 mt-7">
            <span
              className={`hidden sm:inline cursor-pointer text-[#0A122A]/[.6] font-semibold pb-2 ${
                activeLink === "details" && "border-b-2 border-black text-black"
              }`}
              onClick={() => handleLinkClick("details")}
            >
              Company Details
            </span>
            <span
              className={`hidden sm:inline hidden sm:inline cursor-pointer text-[#0A122A]/[.6] font-semibold pb-2 ${
                activeLink === "other" && "border-b-2 border-black text-black"
              }`}
              onClick={() => handleLinkClick("other")}
            >
              Other Details
            </span>

            <span
              className={`hidden sm:inline cursor-pointer text-[#0A122A]/[.6] font-semibold pb-2 ${
                activeLink === "billing" && "border-b-2 border-black text-black"
              }`}
              onClick={() => handleLinkClick("billing")}
            >
              Other Address
            </span>
            <span
              className={`hidden sm:inline cursor-pointer text-[#0A122A]/[.6] font-semibold pb-2 ${
                activeLink === "bank" && "border-b-2 border-black text-black"
              }`}
              onClick={() => handleLinkClick("bank")}
            >
              Bank Details
            </span>
            <span
              className={`hidden sm:inline cursor-pointer text-[#0A122A]/[.6] font-semibold pb-2 ${
                activeLink === "package" && "border-b-2 border-black text-black"
              }`}
              onClick={() => handleLinkClick("package")}
            >
              Package Details
            </span>
            <span
              className={`hidden sm:inline cursor-pointer text-[#0A122A]/[.6] font-semibold pb-2 ${
                activeLink === "sign" && "border-b-2 border-black text-black"
              }`}
              onClick={() => handleLinkClick("sign")}
            >
              Stamp & Sign
            </span>

            <div className="md:hidden mt-7 w-full">
              <select
                className="w-full bg-transparent border-2 rounded-lg py-2 px-3"
                onChange={(e) => handleLinkClick(e.target.value)}
                value={activeLink}
              >
                <option value="details">Company Details</option>
                <option value="other">Other Details</option>
                <option value="billing">Other Address</option>
                <option value="bank">Bank Details</option>
                <option value="package">Package Details</option>
                <option value="sign">Stamp & Sign</option>
              </select>
            </div>

            {/* Buttons */}
            {activeLink === "bank" && (
              <button
                onClick={() => toggleBillingAddressModal1()}
                className="ms-auto bg-darkBlue text-white text-sm font-medium px-4 py-2 rounded-lg w-full md:w-[200px]"
              >
                Add Bank Details
              </button>
            )}
            {activeLink === "other" && (
              <>
                {loading3 ? (
                  <button className="ms-auto bg-darkBlue text-white text-sm font-medium px-4 py-2 rounded-lg w-full md:w-[200px]">
                    <img
                      src={loader}
                      alt="Loading..."
                      className="h-[18px] animate-spin"
                    />
                  </button>
                ) : (
                  <button
                    className="ms-auto bg-darkBlue text-white text-sm font-medium px-4 py-2 rounded-lg w-full md:w-[200px]"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </button>
                )}
              </>
            )}
            {activeLink === "billing" && (
              <button
                onClick={() => toggleBillingAddressModal()}
                className="ms-auto bg-darkBlue text-white text-sm font-medium px-4 py-2 rounded-lg w-full md:w-[200px]"
              >
                Add Address
              </button>
            )}
            {activeLink === "package" && (
              <button
                onClick={handlePAckageShow}
                className="ms-auto bg-darkBlue text-white text-sm font-medium px-4 py-2 rounded-lg w-full md:w-[200px]"
              >
                Browse Packages
              </button>
            )}
            {activeLink === "details" && (
              <button
                className="ms-auto bg-darkBlue text-white text-sm font-medium px-4 py-2 rounded-lg w-full md:w-[200px]"
                onClick={toggleProfileUpdate1}
              >
                Update
              </button>
            )}
            {activeLink === "sign" && (
              <>
                {loading4 ? (
                  <button className="ms-auto bg-darkBlue text-white text-sm font-medium px-4 py-2 rounded-lg w-full md:w-[200px]">
                    <img
                      src={loader}
                      alt="Loading..."
                      className="h-[18px] animate-spin"
                    />
                  </button>
                ) : (
                  <button
                    className="ms-auto bg-darkBlue text-white text-sm font-medium px-4 py-2 rounded-lg w-full md:w-[200px]"
                    onClick={handleLogoSave}
                  >
                    Save Changes
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {openPermissionModal && (
          <div
            class="relative z-10"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="fixed inset-0 z-10 w-screen flex items-center justify-center">
              <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-md p-4">
                <div class="bg-white py-3">
                  <div class="flex flex-col items-center">
                    <FontAwesomeIcon
                      icon={faCloudArrowUp}
                      className="text-5xl"
                    />
                    <h3 className="font-semibold text-2xl mt-4 text-center">
                      Are you sure you want to upload?
                    </h3>
                  </div>
                </div>
                <div class="bg-white mx-8 py-3">
                  {loading ? (
                    <button
                      type="button"
                      class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%] mb-3"
                    >
                      <img
                        src={loader}
                        className="h-[18px] animate-spin"
                        alt=""
                      />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={submitImage}
                        type="button"
                        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-3 text-sm font-medium shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%] mb-3"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setOpenPermissionModal(false)}
                        type="button"
                        class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]"
                      >
                        No
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border border-t-black "></div>
        <div className="relative">{renderDetailComponent()}</div>
      </div>
    </>
  );
};

export default Myprofile;
