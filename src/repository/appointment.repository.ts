import appointment from "../models/appointment"

const fetchForPatient = async (patientEmail: string) => {
    return appointment.find({
        payment: true,
        patientEmail: patientEmail,
    })
}

const fetchForDoctor = (doctorEmail: string) => {
    return appointment.find({
        payment: true,
        doctorEmail: doctorEmail,
    })
}

const fetchAll = async () => {
    return appointment.find({
        payment: true,
    })
}

export default {
    fetchForPatient,
    fetchForDoctor,
    fetchAll,
}