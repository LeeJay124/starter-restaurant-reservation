/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("../reservations/reservations.services");
const moment = require("moment");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id", 
  "created_at", 
  "updated_at"
];
const VALID_STATUSES = [
  "booked",
  "seated",
  "finished",
  "cancelled",
];

//List reservations based on date
async function list(req, res,next){
  const {date} = req.query;
  const {mobile_number} = req.query;

  //add mobile number to list reservations for specific mobile number
  if(mobile_number){
    const data = await service.search(mobile_number);
    res.json({data});
}
  //add date to list reservations on specific day
  else if(date){
       const data = await service.reservationsByDate(date);
       res.json({data});
  }else{
   const data = await service.list();
   res.json({data});
  }
  
}
//Check whether the reservation exists
async function reservationExists(req, res,next){
  const {reservationId} = req.params;
  const reservation = await service.read(reservationId);
  if(reservation){
      res.locals.reservation = reservation;
      return next();
  }
  return next({status: 404, message: `Reservation id ${reservationId} does not exist`})

}

//Check to see if the property provided exists in the data
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  if (Object.keys(data).length === 0) {
    return next({
      status: 400,
      message: "data is missing",
    });
  }
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalids fields: ${invalidFields.join(", ")}`,
    });
  }
  next();
}

 //Check if has valid status
 function hasFinishedOrSeatedStatus(req, res, next){
const status = res.locals.reservation.status;
  if (status === "finished") {
    return next({
      status: 400,
      message: `a finished reservation cannot be updated`,
    });
  }
  if (status === "seated") {
    return next({
      status: 400,
      message: `reservation already seated`,
    });
  }
  next();
}
//Check if has valid status
function hasSeatedOrFinishedStatus(req, res, next){
  const {data:{status}={}}=req.body;
    if (status === "finished") {
      return next({
        status: 400,
        message: `a finished reservation cannot be updated`,
      });
    }
    if (status === "seated") {
      return next({
        status: 400,
        message: `reservation already seated`,
      });
    }
    next();
  }
  
//Check if has valid status
function hasValidStatus(req, res, next){
  const {data:{status}={}} = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return next({
      status: 400,
      message: `unknown status`,
    });
  }
  next();
}


//Check to see if people is valid
function hasValidPeople(req, res,next){
  const {data:{people} = {}} = req.body;
  const peopleAsNumber = people;
  if (typeof people != 'number') {
    return next({
    status: 400, 
    message: `people must be a number`
});
  }
  if (peopleAsNumber === 0 ) {
  return next({
  status: 400, 
  message: `people must not equal zero`
});
}
next();
};


//Read reservation based on reservation id provided
async function read(req, res, next){
const {reservationId} = req.params;
const data = await service.read(reservationId);
res.json({data});
}


//Combined check if date is valid
function hasValidDate(req, res, next) {
  const { data: { reservation_date, reservation_time } = {} } = req.body;
  const date = new Date(`${reservation_date}T${reservation_time}`);
  const today = new Date();
  if (today.getTime() > date.getTime()) {
    return next({
      status: 400,
      message: "reservation_date must be a future date",
    });
  }
  if (date.getDay() === 2) {
    return next({
      status: 400,
      message: "Restaurant is closed on Tuesday",
    });
  }
  if (moment(reservation_date, "YYYY-MM-DD", true).isValid()) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_date is not valid",
  });
}

//Combined check if date is valid
function hasValidTime(req, res, next) {
  const { data: { reservation_time } = {} } = req.body;
  
  if (reservation_time < "10:30" || reservation_time > "21:30") {
    return next({
      status: 400,
      message: "reservation_time not during business hours",
    });
  }
  if (moment(reservation_time, "HH:mm", true).isValid()) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_time is not valid",
  });
}
//Create reservations
async function create (req, res){
  const data = await service.create(req.body.data);
  res.status(201).json({data});
};

//Update existing reservation 
async function update(req, res) {
  const {reservationId} = req.params;
  const updatedReservation = {...req.body.data};
  const data = await service.update(reservationId,updatedReservation);  
  res.status(200).json({ data });
  }

  //Update reservation status
async function updateStatus(req, res) {
  const {reservationId} = req.params;
  const {data: {status}} = req.body;
  const data = await service.statusUpdate(reservationId, status);  
  res.status(200).json({ data });
  }

module.exports = {
  list,
  create:[ 
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidPeople,
    hasValidDate,
    hasValidTime, 
    hasSeatedOrFinishedStatus,
    asyncErrorBoundary(create)],
  read:[
    asyncErrorBoundary(reservationExists), 
    read],
  reservationExists:[
    asyncErrorBoundary(reservationExists)],
  update:[
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidPeople,
    hasValidDate,
    hasValidTime,  
    asyncErrorBoundary(reservationExists), 
    asyncErrorBoundary(update)],
    statusUpdate:[
      hasValidStatus,
      asyncErrorBoundary(reservationExists), 
      hasFinishedOrSeatedStatus,
      asyncErrorBoundary(updateStatus)
    ]
};
