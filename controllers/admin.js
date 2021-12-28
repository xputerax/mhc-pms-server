import doctorList from "../models/doctorList.js";
import auth from "../models/auth.js";

const docList = async (req, res) => {
  try {
    const dlist = await doctorList.find({});
    if (dlist.length > 0) {
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

const unverified = async (req, res) => {
  try {
    const unvUsers = await auth.find({ verified: false });
    if (unvUsers.length > 0) {
      res.status(200).json(unvUsers);
    } else {
      res
        .status(404)
        .json({ error: true, errorMsg: "No Unverified User found!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const verify = async (req, res) => {
  try {
    const filter = { email: req.body.email };
    const verifiedUser = await auth.findOneAndUpdate(
      filter,
      { verified: true },
      { new: true }
    );
    if (verifiedUser) {
      res
        .status(200)
        .json({ error: false, msg: "User Verified successfully!" });
    } else {
      res
        .status(304)
        .json({ error: true, errorMsg: "Failed to verify the user." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const reject = async (req, res) => {
  try {
    const filter = { email: req.body.email };
    auth.deleteOne(filter, (err) => {
      if (err) {
        console.log(err);
        return res
          .status(304)
          .json({ error: true, errorMsg: "Something went wrong!" });
      } else {
        return res.status(200).json({ error: false, msg: "User Rejected!" });
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

export { docList, addNew, updateFee, unverified, verify, reject };
