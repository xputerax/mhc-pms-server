import express from 'express';

import doctorList from "../models/doctorList";
import auth from "../models/auth";
import appointment from "../models/appointment";

const docList = async (req: express.Request, res: express.Response) => {
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

const addNew = async (req: express.Request, res: express.Response) => {
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

const updateFee = async (req: express.Request, res: express.Response) => {
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

const unverified = async (req: express.Request, res: express.Response) => {
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

const verify = async (req: express.Request, res: express.Response) => {
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

const reject = async (req: express.Request, res: express.Response) => {
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

const generateStats = async (req: express.Request, res: express.Response) => {
  try {
    const users = await auth.find({});
    const docList = await doctorList.find({});
    const feedbacks = await appointment.find({ feedback: true });
    if (users.length > 0 && docList.length > 0) {
      const patients = users.filter((user) => user.userType === "patient");
      const doctors = users.filter(
        (user) => user.userType === "doctor" && user.verified
      );
      const staffs = users.filter(
        (user) => user.userType === "staff" && user.verified
      );
      const nop = patients.length;
      const nod = doctors.length;
      const nos = staffs.length;
      let mwd = docList[0].wIds.length;
      docList.forEach((doc) => {
        if (doc.wIds.length > mwd) {
          mwd = doc.wIds.length;
        }
      });
      const dmwds = docList.filter((doc) => doc.wIds.length == mwd);
      let dmwd = "";
      dmwds.forEach((dc) => {
        dmwd = dmwd + dc.docName + ", ";
      });

      let mrd;
      if (feedbacks.length > 0) {
        let mr = feedbacks[0].rating;
        feedbacks.forEach((feedback) => {
          if (feedback.rating > mr) {
            mr = feedback.rating;
          }
        });
        let mrds = feedbacks.filter((feedbck) => feedbck.rating === mr);
        mrd = "";
        mrds.forEach((mrdoc) => {
          mrd = mrd + mrdoc.doctor + ", ";
        });
      }

      return res
        .status(200)
        .json({ mrd: mrd ? mrd : "N/A", nop, nod, nos, dmwd });
    } else {
      return res
        .status(404)
        .json({ error: true, errorMsg: "User List Not Found!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const patientFeedbacks = async (req: express.Request, res: express.Response) => {
  try {
    const feedbacks = await appointment.find({ feedback: true });
    if (feedbacks.length > 0) {
      return res.status(200).json(feedbacks);
    } else {
      return res
        .status(404)
        .json({ error: true, errorMsg: "Unable to load feedbacks!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

export {
  docList,
  addNew,
  updateFee,
  unverified,
  verify,
  reject,
  generateStats,
  patientFeedbacks,
};
