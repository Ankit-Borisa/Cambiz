const getPincodeDetails = async (req, res) => {
  try {
    let pincode = req.params.pincode;

    if (!pincode || pincode.length !== 6) {
      return res.status(400).json({ success: false, error: "Invalid pincode" });
    }

    let responce = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    let data = await responce.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "internal server error" });
  }
};


module.exports= getPincodeDetails