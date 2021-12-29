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
      { pemail: req.body.pemail },
      { demail: req.body.demail },
      { doa: req.body.doa },
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

export { bookAppointment, duePayment, makePayment };
