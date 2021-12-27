import doctorList from "../models/doctorList.js";

const addNew = async (req, res) => {
  try {
    const newDoctor = req.body;
    await doctorList.create(newDoctor);
    return res
      .status(201)
      .json({ error: false, msg: "Successfully added to the list." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const updateFee = async (req, res) => {
  const filter = { docName: req.body.docName };
  const newFee = parseInt(req.body.fee);
  try {
    await doctorList.findOneAndUpdate(filter, { fee: newFee });
    return res
      .status(200)
      .json({ error: false, msg: "Fee Updated Successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

export { addNew, updateFee };
