import appointment from "../models/appointment.js";

const uploadPrescription = async (req, res) => {
  const filter = {
    $and: [
      { pemail: req.body.pemail },
      { demail: req.body.demail },
      { doa: req.body.doa },
    ],
  };
  try {
    const updated = await appointment.findOneAndUpdate(
      filter,
      { prescribed: true },
      { file: req.file.path },
      { new: true }
    );
    if (updated) {
      return res.status(200).json({
        error: false,
        msg: "Prescription uploaded successfully.",
      });
    } else {
      res.status(304).json({
        error: true,
        errorMsg: "Failed to upload!",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

export { uploadPrescription };
