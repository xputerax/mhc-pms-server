import express from 'express';
import appointment, { Appointment } from "../models/appointment";
import { AuthenticatedRequest } from './baseRequest';
import userType from '../utils/userType';
import appointmentRepository from '../repository/appointment.repository';

interface BookAppointmentRequest extends express.Request {
  body: {
    patient?: string,
    doctor?: string,
    pemail?: string,
    demail?: string,
    date?: string,
    doa?: string,
  }
}

// TODO: form validation before creating document
// TODO: wtf is doa?
const bookAppointment = async (req: BookAppointmentRequest, res: express.Response) => {
  try {
    const newAppointment = {
      patient: req.body.patient,
      doctor: req.body.doctor,
      pemail: req.body.pemail,
      demail: req.body.demail,
      date: req.body.date,
      doa: req.body.doa,
    }
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

interface MakePaymentRequest extends express.Request {
  body: {
    patientEmail?: string,
    doctorEmail?: string,
    appointmentDate?: string,
  }
}

// TODO: form validation
const makePayment = async (req: MakePaymentRequest, res: express.Response) => {
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

const myAppointments = async (req: AuthenticatedRequest, res: express.Response) => {
  let appointments: Appointment[] = [];

  if (req.user.userType == userType.TYPE_DOCTOR) {
    appointments = await appointmentRepository.fetchForDoctor(req.user.email)
  } else if (req.user.userType == userType.TYPE_PATIENT) {
    appointments = await appointmentRepository.fetchForPatient(req.user.email);
  } else if (req.user.userType == userType.TYPE_STAFF) {
    appointments = await appointmentRepository.fetchAll();
  } else {
    console.log(`invalid user type received in endpoint myAppointments`)
    console.log(req.user)
    return res.json({
      error: true,
      errorMsg: `invalid user type`
    })
  }

  try {
    return res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

interface CancelAppointmentRequest extends express.Request {
  body: {
    patientEmail?: string,
    doctorEmail?: string,
    appointmentDate?: string,
  }
}

const cancelAppointment = async (req: CancelAppointmentRequest, res: express.Response) => {
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

// TODO: response schema
const prescriptions = async (req: express.Request, res: express.Response) => {
  try {
    const prescriptions = await appointment.find({ prescribed: true });
    return res.status(200).json(prescriptions);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

interface WriteFeedbackRequest extends express.Request {
  body: {
    review?: string,
    rating?: string,
    patientEmail?: string,
    doctorEmail?: string,
    appointmentDate?: string,
  }
}

const writeFeedback = async (req: WriteFeedbackRequest, res: express.Response) => {
  const { review, rating } = req.body;

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

interface DeleteFeedbackRequest extends express.Request {
  body: {
    patientEmail?: string,
    doctorEmail?: string,
    appointmentDate?: string,
  }
}

const deleteFeedback = async (req: DeleteFeedbackRequest, res: express.Response) => {


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
    }

    return res.status(404).json({
      error: true,
      errorMsg: "Feedback not found or already deleted.",
    });
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
