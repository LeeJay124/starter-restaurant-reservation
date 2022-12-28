/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("../reservations/reservations.services");

//List reservations based on date
async function list(req, res,next){
  const {date} = req.query;
  
  //add date to list reservations on specific day
  if(date){
       const data = await service.reservationsByDate(date);
       //const sorted = data.sort((a, b)=> a.reservation_time - b.reservation_time);
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
function bodyHas(propertyName){
  return function(req,res,next){
      const {data = {}} = req.body;
      if(data[propertyName] && data[propertyName] !== ""){
          return next();
      }
      next({
          status: 400, 
          message: `Reservation must include a valid ${propertyName}`
      });
  };
  };
  
  //Check to see if people is valid
function hasValidPeople(req, res,next){
  const {data = {}} = req.body;
  if (data["people"] === 0 || !Number.isInteger(data["people"])) {
    return next({
    status: 400, 
    message: `Reservation must include 1 or more people`
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

//Check for a valid future date
function dateIsFuture(req, res, next){
  const {reservation_date} = req.body;
  const reformat = reservation_date.split('-');
    const reformDate = `${reformat[1]}-${reformat[2]}-${reformat[0]}`;
    const d = new Date(reformDate);
    const dDate = d.toLocaleDateString();
  const today = new Date();
  const todayDate = today.toLocaleDateString();
  if(dDate < todayDate){
    next({
      status: 400, 
      message: `Reservation must include a valid future date`
  });
  }
  
return next();
};
//Combined check if date is valid
 function hasValidDate(req, res,next){
  const {data = {}} = req.body;
  const date = data["reservation_date"];
  const time = data["reservation_time"];
  const formattedDate = new Date(`${date}T${time}`);
  const day = new Date(date).getUTCDay();
  if(isNaN(Date.parse(data["reservation_date"]))){
    return next({
      status: 400, 
      message: `Invalid reservation_date`,
    });
  }
  if(day === 2){
    return next({
      status: 400, 
      message: `Restaurant is closed on Tuesdays`,
    });
  }
  if(formattedDate <= new Date()){
    return next({
      status: 400, 
      message: `Reservation must be in the future`,
    });
  }
  next();
 }


//Combined check if date is valid
function hasValidTime(req, res,next){
  const {data = {}} = req.body;
  const date = data["reservation_date"];
  const time = data["reservation_time"];
  const formattedDate = new Date(`${date}T${time}`);
  const open = "10:30:00";
  const close = "21:30:00";
  const reformat = date.split('-');
  const reformDate = `${reformat[1]}-${reformat[2]}-${reformat[0]}`;
  const d = new Date(reformDate);
const today = new Date();
const now = d.toLocaleTimeString();

  if(isNaN(Date.parse(data["reservation_time"]))){
    return next({
      status: 400, 
      message: `reservation_time is not a time`,
    });
  }
if(reservation_time < open || reservation_time > close){
   return next({
    status: 400, 
    message: `Reservation time must be after 10:30am and before 9:30pm`
});
}
if(formattedDate == today && reservation_time < now){
  return next({
    status: 400, 
    message: `Reservation time must not occur in the past`
});
}
   next();
 }



//Check if date is valid
function validDate(req, res, next){
  const {reservation_date} = req.body;
  const reformat = reservation_date.split('-');
    const reformDate = `${reformat[1]}-${reformat[2]}-${reformat[0]}`;
    const d = new Date(reformDate);
    const valid = Object.prototype.toString.call(d) === "[object Date]";
    console.log(valid);
  if(valid){
    next({
      status: 400, 
      message: `reservation_date is not a date`
  });
  }
  
return next();
};

//Check to see if date is a Tuesday
function dateNotTuesday(req, res,next){
  const {reservation_date} = req.body;
  const reformat = reservation_date.split('-');
  const reformDate = `${reformat[1]}-${reformat[2]}-${reformat[0]}`;
  const d = new Date(reformDate);
  let day = d.getDay();
if(day === 2){
  next({
    status: 400, 
    message: `We are closed on Tuesday`
});
}
return next();
};
//Check to see if time is valid
function validTime(req, res,next){
  const {reservation_time} = req.body;
  regexp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/;

if(regexp.test(reservation_time)){
  next({
    status: 400, 
    message: `Reservation time not valid`
});
}
return next();
};

//Check to see if time during open hours
function timeDuringOpenHours(req, res,next){
  const {reservation_time} = req.body;
  const open = "10:30:00";
  const close = "21:30:00";
if(reservation_time < open || reservation_time > close){
  next({
    status: 400, 
    message: `Reservation time must be after 10:30am and before 9:30pm`
});
}
return next();
};

//Check to see if time before now
function timeBeforeNow(req, res,next){
  const {reservation_time, reservation_date} = req.body;
  const reformat = reservation_date.split('-');
    const reformDate = `${reformat[1]}-${reformat[2]}-${reformat[0]}`;
    const d = new Date(reformDate);
  const today = new Date();
  const now = d.toLocaleTimeString();
if(d == today && reservation_time < now){
  next({
    status: 400, 
    message: `Reservation time must not occur in the past`
});
}
return next();
};

//Create reservations
async function create (req, res){
  const {first_name, last_name, reservation_date, reservation_time, mobile_number, people} = req.body;
  const newReservation = {
      first_name, 
      last_name, 
      reservation_date, 
      reservation_time, 
      mobile_number, 
      people
  };
  await service.create(newReservation);
  res.status(201).json({data: newReservation});
};

//Update existing reservation 
async function update(req, res) {
  const updatedReservation = { ...res.locals.reservation, ...req.body };
  const data = await service.update(updatedReservation);  
  res.status(201).json({ data });
  }

module.exports = {
  list,
  create:[ 
    bodyHas("first_name"),
    bodyHas("last_name"),
    bodyHas("mobile_number"),
    bodyHas("reservation_date"), 
    bodyHas("reservation_time"), 
    hasValidPeople,
    hasValidDate,
    hasValidTime, 
    asyncErrorBoundary(create)],
  read:[
    asyncErrorBoundary(reservationExists), 
    read],
  reservationExists:[
    asyncErrorBoundary(reservationExists)],
  update:[
    bodyHas("first_name"),
    bodyHas("last_name"),
    bodyHas("mobile_number"),
    bodyHas("reservation_date"), 
    bodyHas("reservation_time"), 
    hasValidPeople,
    hasValidDate,
    hasValidTime,  
    asyncErrorBoundary(reservationExists), 
    asyncErrorBoundary(update)],
};
