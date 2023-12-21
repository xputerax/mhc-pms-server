import express from 'express';
import doctorList from "../models/doctorList";
import auth from "../models/auth";
import appointment from "../models/appointment";
import userType from '../utils/userType';

// TODO: response shape
const docList = async (req: express.Request, res: express.Response) => {
  try {
    const dlist = await doctorList.find({});

    return res.status(200).json(dlist);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

interface AddNewDoctorRequest extends express.Request {
  body: {
    docName?: string,
    email?: string,
    degree?: string,
    wdays?: string,
    fee?: string,
    wIds?: string,
  }
}

// TODO: form validation
const addNew = async (req: AddNewDoctorRequest, res: express.Response) => {
  try {
    // const newDoctor = req.body;
    const newDoctor = {
      docName: req.body.docName,
      email: req.body.email,
      degree: req.body.degree,
      wdays: req.body.wdays,
      fee: req.body.fee,
      wIds: req.body.wIds,
    }
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

interface UpdateFeeRequest extends express.Request {
  body: {
    docName?: string,
    fee?: string,
  }
}

const updateFee = async (req: UpdateFeeRequest, res: express.Response) => {
  const filter = { docName: req.body.docName }; // TODO: fucking stupid. filter it by the ID instead of name
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

// TODO: response schema
const unverified = async (req: express.Request, res: express.Response) => {
  try {
    const unvUsers = await auth.find({ verified: false });

    return res.status(200).json(unvUsers);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

interface VerifyUserRequest extends express.Request {
  body: {
    email?: string,
  }
}

const verify = async (req: VerifyUserRequest, res: express.Response) => {
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

interface RejectUserRequest extends express.Request {
  body: {
    email?: string,
  }
}

const reject = async (req: RejectUserRequest, res: express.Response) => {
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

// TODO: can refactor - rename variables
const generateStats = async (req: express.Request, res: express.Response) => {
  try {
    const users = await auth.find({});
    const docList = await doctorList.find({});
    const feedbacks = await appointment.find({ feedback: true });

    if (users.length > 0 && docList.length > 0) {
      const patients = users.filter((user) => user.userType === userType.TYPE_PATIENT);
      const verifiedDoctors = users.filter(
        (user) => user.userType === userType.TYPE_DOCTOR && user.verified
      );
      const verifiedStaffs = users.filter(
        (user) => user.userType === userType.TYPE_STAFF && user.verified
      );
      const patientCount = patients.length;
      const doctorCount = verifiedDoctors.length;
      const staffCount = verifiedStaffs.length;
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
        .json({ mrd: mrd ? mrd : "N/A", nop: patientCount, nod: doctorCount, nos: staffCount, dmwd });
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
    return res.status(200).json(feedbacks);
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
