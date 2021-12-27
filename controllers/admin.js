import doctorList from "../models/doctorList.js";

const docList = async (req, res) => {
  try {
    const dlist = await doctorList.find({});
    if (dlist) {
      return res.status(200).json(dlist);
    } else {
      return res.status(404).json({ error: true, errorMsg: "List not found!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

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
    const updated = await doctorList.findOneAndUpdate(
      filter,
      { fee: newFee },
      { new: true }
    );
    if (updated) {
      return res
        .status(200)
        .json({ error: false, msg: "Fee Updated Successfully." });
    } else {
      res
        .status(304)
        .json({ error: true, errorMsg: "Not able to update the fee." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

export { docList, addNew, updateFee };
