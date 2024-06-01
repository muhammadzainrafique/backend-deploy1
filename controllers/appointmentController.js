const  { createResponse } = require("../utils/helperFunction");

// const Paitent = require("../models/paitentModel");
const Appointment = require("../models/appointmentModel");
const asyncHandler = require("express-async-handler");
const Doctor = require("../models/doctorModel");

const createAppointment = asyncHandler(async (req, res) => {
  const { doctor, paitent, date, time } = req.body;
  if (!doctor || !paitent || !date || !time)
    return createResponse(res, false, 400, "All fields are reqired");
  // verifying doctor
  const user = await Doctor.findById(doctor).lean();
  if (!user || user?.role !== "doctor")
    return createResponse(res, false, 400, "Doctor Not Found");
  const appointment = await Appointment.create({ doctor, paitent, date, time });
  if (!appointment) return createResponse(res, false, 400, "Invalid data");

  createResponse(res, false, 200, "Appointment is Created");
});

const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({}).lean();
  if (!appointments.length)
    return createResponse(res, true, 200, "No Appointment Found Yet.");

  createResponse(res, true, 200, appointments);
});

const getAppointmentOfDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return createResponse(res, 400, false, "Id is requird");
  const appointments = await Appointment.find({ doctor: id })
    .select("-doctor")
    .populate("paitent", "name username ");
  if (!appointments)
    return createResponse(res, false, 400, "Appointemnts not found");
  createResponse(res, true, 200, appointments);
});
const getAppointmentOfPaitent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return createResponse(res, false, 400, "Id is requird");
  const appointments = await Appointment.find({ paitent: id }).populate(
    "doctor",
    "name username"
  );
  if (!appointments)
    return createResponse(res, false, 400, "Appointemnts not found");
  createResponse(res, true, 200, appointments);
});
const getAppointmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return createResponse(res, false, 400, "Id is requried");
  const appointment = await Appointment.findById(id).lean();
  if (!appointment)
    return createResponse(res, false, 400, "Appointment No Found");

  createResponse(res, true, 200, appointment);
});

const updateAppointent = asyncHandler(async (req, res) => {
  const { doctor, date, time } = req.body;
  const { id } = req.params;
  if (!doctor || !id || !date || !time)
    return createResponse(res, false, 400, "All fields are reqired");
  // checking for appointent whether it exist or not
  const appointment = await Appointment.findById(id);
  if (!appointment)
    return createResponse(res, false, 400, "Appointment not Found");
  // verifying doctor
  const user = await Doctor.findById(doctor).lean();
  if (!user || user?.role !== "doctor")
    return createResponse(res, false, 400, "Doctor Not Found");
  appointment.doctor = doctor || appointment.doctor;
  appointment.date = date || appointment.date;
  appointment.time = time || appointment.time;

  await appointment.save();

  createResponse(res, true, 200, appointment);
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(status, id);
  if (!id || !status)
    return createResponse(res, false, 400, "Id and Status is required");
  const appointment = await Appointment.findById(id);
  if (!appointment)
    return createResponse(res, false, 400, "Appointment not Found");
  appointment.status = status;
  await appointment.save();
  createResponse(res, true, 200, appointment);
});

const deleteAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return createResponse(res, false, 400, "Id is required");
  const appointment = await Appointment.findById(id);
  if (!appointment)
    return createResponse(res, false, 400, "Appointment not Found");
  await appointment.delete();
  createResponse(res, true, 200, "Appointment deleted");
});

module.exports = {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentOfDoctor,
  getAppointmentOfPaitent,
  updateAppointent,
  updateAppointmentStatus,
};
