const GstData = require("../models/gstData");

const { GST_EMAIL_ID, GST_CLIENT_ID, GST_CLIENT_SECRET } = process.env;

const gstDetails = async (req, res) => {
  try {
    const { gstNo } = req.params;

    const existingGstData = await GstData.findOne({ gstNo });

    if (existingGstData) {
      console.log("sending existing gst data");
      return res.status(200).json({ data: existingGstData ,message: "GST details retrieve successfully from database."});
    }

    const apiResponse  = await fetch(
      `https://api.whitebooks.in/public/search?email=${GST_EMAIL_ID}&gstin=${gstNo}`,
      {
        method: "GET",
        headers: {
          client_id: GST_CLIENT_ID,
          client_secret: GST_CLIENT_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    const response = await apiResponse.json();

    if (!response || response.status_cd === "0" || !response.data) {
      return res
        .status(400)
        .json({ status_cd: "0", message: "GST details not found." });
    }

    let resData = response.data;

    const userAddress = resData.pradr.addr;
    const pinCode = userAddress.pncd;
    const state = userAddress.stcd;
    const city = userAddress.dst;
    const companyName = resData.tradeNam;
    const contactPersonName = resData.lgnm;
    const addressParts = [
      userAddress.bnm,
      userAddress.bno,
      userAddress.st,
      userAddress.loc
    ].filter(Boolean); 
    const address = addressParts.join(", ");

    // Create and save a new GST data entry if not found
    let gstData = new GstData({
      gstNo,
      companyName,
      contactPersonName,
      address,
      city,
      state,
      pinCode,
    });

    await gstData.save();

    console.log("sending new gst data");


    res
      .status(201)
      .json({ data: gstData, message: "GST details retrieve successfully." });
  } catch (error) {
    console.error("gst data save error", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { gstDetails };
