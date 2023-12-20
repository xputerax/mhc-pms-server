import express from 'express';
import appointment from "../models/appointment";

const bookAppointment = async (req: express.Request, res: express.Response) => {
  try {
    const newAppointment = req.body;
    await appointment.create(newAppointment);
    return res.status(201).json({
      error: false,
      msg: "Payment is Due. Confirm your appointment after successful payment.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const duePayment = async (req: express.Request, res: express.Response) => {
  try {
    const unpaid = await appointment.find({ payment: false });
    return res.status(200).json(unpaid);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const makePayment = async (req: express.Request, res: express.Response) => {
  const filter = {
    $and: [
      { patientEmail: req.body.patientEmail },
      { doctorEmail: req.body.doctorEmail },
      { appointmentDate: req.body.appointmentDate },
    ],
  };
  try {
    const updated = await appointment.findOneAndUpdate(
      filter,
      { payment: true },
      { new: true }
    );
    if (updated) {
      return res.status(200).json({
        error: false,
        msg: "Payment Successful. Appointment confirmed.",
      });
    } else {
      res.status(304).json({
        error: true,
        errorMsg: "Payment was not successful. Try again!",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const myAppointments = async (req: express.Request, res: express.Response) => {
  try {
    const appointments = await appointment.find({ payment: true });
    return res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const cancelAppointment = async (req: express.Request, res: express.Response) => {
  const filter = {
    $and: [
      { patientEmail: req.body.patientEmail },
      { doctorEmail: req.body.doctorEmail },
      { appointmentDate: req.body.appointmentDate },
    ],
  };
  try {
    appointment.deleteOne(filter, (err) => {
      if (err) {
        console.log(err);
        return res
          .status(304)
          .json({ error: true, errorMsg: "Something went wrong!" });
      } else {
        return res
          .status(200)
          .json({ error: false, msg: "Appointment Cancelled!" });
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const prescriptions = async (req: express.Request, res: express.Response) => {
  try {
    const prescriptions = await appointment.find({ prescribed: true });
    if (prescriptions.length > 0) {
      return res.status(200).json(prescriptions);
    } else {
      return res
        .status(404)
        .json({ error: true, errorMsg: "No prescription found!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const writeFeedback = async (req: express.Request, res: express.Response) => {
  const { review } = req.body.review;
  const { rating } = req.body.rating;

  // Perform backend validation - ryan
  // check blank and empty feedback
  if (!review || review.trim() === '') {
    return res.status(400).json({
      error: false,
      errorMsg: 'Feedback cannot be empty',
    });
  // Add validation for feedback length
  }else if
   (review.length > 500) {
    return res.status(400).json({
      error: false,
      errorMsg: 'Feedback cannot exceed 500 characters',
    });
  }

  //check rating
  if(!rating) {
    return res.status(400).json({
      error: false,
      errorMsg: 'Rating cannot be empty',
    });
  }
  //????

  const filter = {
    $and: [
      { patientEmail: req.body.patientEmail },
      { doctorEmail: req.body.doctorEmail },
      { appointmentDate: req.body.appointmentDate },
    ],
  };
  const newFeedback = {
    feedback: true,
    review: req.body.review,
    rating: req.body.rating && parseInt(req.body.rating),
  };
  try {
    const updated = await appointment.findOneAndUpdate(filter, newFeedback, {
      new: true,
    });
    if (updated) {
      return res.status(200).json({
        error: false,
        msg: "Feedback updated!",
      });
    } else {
      res.status(304).json({
        error: true,
        errorMsg: "Problem submitting feedback. Try again!",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const deleteFeedback = async (req: express.Request, res: express.Response) => {


  const filter = {
    $and: [
      { patientEmail: req.body.patientEmail },
      { doctorEmail: req.body.doctorEmail },
      { appointmentDate: req.body.appointmentDate },
    ],
  };
  const newFeedback = {
    feedback: false,
    review: "",
    rating: 0,
  };
  try {
    //author apply soft delete records
    //The deleteFeedback function is not actually deleting the feedback data;
    //instead, it's updating the existing feedback data to mark it as deleted.
    //This will cause data redundency in database
    /*
    const updated = await appointment.findOneAndUpdate(filter, newFeedback, {
      new: true,
    });
    if (updated) {
      return res.status(200).json({
        error: false,
        msg: "Feedback Deleted!",
      });
    } else {
      res.status(304).json({
        error: true,
        errorMsg: "Problem deleting feedback. Try again!",
      });
    }
    */


    //true deletion of the feedback data from the database
    const result = await appointment.deleteOne(filter);

    if (result.deletedCount > 0) {
      return res.status(200).json({
        error: false,
        msg: "Feedback Deleted!",
      });
    } else {
      return res.status(404).json({
        error: true,
        errorMsg: "Feedback not found or already deleted.",
      });
    }

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }



};

export {
  bookAppointment,
  duePayment,
  makePayment,
  myAppointments,
  cancelAppointment,
  prescriptions,
  writeFeedback,
  deleteFeedback,
};
