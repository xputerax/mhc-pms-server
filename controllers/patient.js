import appointment from "../models/appointment.js";

const bookAppointment = async (req, res) => {
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

const duePayment = async (req, res) => {
  try {
    const unpaid = await appointment.find({ payment: false });
    if (unpaid.length > 0) {
      return res.status(200).json(unpaid);
    } else {
      return res
        .status(404)
        .json({ error: true, errorMsg: "No payment found due!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const makePayment = async (req, res) => {
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

const myAppointments = async (req, res) => {
  try {
    const appointments = await appointment.find({ payment: true });
    if (appointments.length > 0) {
      return res.status(200).json(appointments);
    } else {
      return res
        .status(404)
        .json({ error: true, errorMsg: "No appointment found!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const cancelAppointment = async (req, res) => {
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

const prescriptions = async (req, res) => {
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

const writeFeedback = async (req, res) => {
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

const deleteFeedback = async (req, res) => {
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
