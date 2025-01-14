/**
 * List handler for table resources
 */

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("../tables/tables.services");
const hasProperties = require("../errors/hasProperties");
const reservationService = require("../reservations/reservations.services");

const hasRequiredProperties = hasProperties(
  "table_name",
  "capacity",
);
const VALID_PROPERTIES = [
    "table_name",
    "capacity",
  "reservation_id"
];
const hasSeatRequiredProperties = hasProperties(
  "reservation_id"
);

//List tables 
async function list(req, res,next){
     const data = await service.list();
     res.json({data});
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

//Cheeck if the capacity and table name meet requirements
  function validTable(req, res, next) {
    const { data :{table_name, capacity}= {}} = req.body;
    const capacityAsNumber = Number(capacity);
    if (!Number.isInteger(capacity)) {
        return next({
            status: 400,
            message: "capacity must be a number",
          });
    }
    if (capacityAsNumber < 1) {
      return next({
          status: 400,
          message: "capacity must be at least 1",
        });
  }
    if (table_name.length < 2) {
        return next({
            status: 400,
            message: "table_name must be at least 2 characters",
          });
    }
    next();
}
function hasData(req, res, next) {
  const { data } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: "data is missing",
    });
  }
  next();
}
//Check the capacity and table occupancy
async function validSeating(req, res, next) {
  const { data :{reservation_id}= {}} = req.body;
  const tableCapacity = Number(res.locals.table.capacity); 
  const peopleAsNumber = Number(res.locals.reservation.people);
  if (peopleAsNumber > tableCapacity) {
      return next({
          status: 400,
          message: "capacity insufficient for this table",
        });
  }

  if (res.locals.reservation.status === "seated") {
    return next({
        status: 400,
        message: "reservation already seated",
      });
}
  next();
}

//Check whether the reservation exists
async function reservationExists(req, res,next){
  const {data: {reservation_id}} = req.body;
  const reservation = await reservationService.read(reservation_id);
  if(reservation){
      res.locals.reservation = reservation;
      return next();
  }
  return next({status: 404, message: `Reservation id ${reservation_id} does not exist`})

}

//Check table occupancy
async function validNotOccupied(req, res, next) {
  const {reservation_id} = res.locals.table;
  if (reservation_id ==null) {
      return next({
        status: 400,
        message: "Table is not occupied",
      });
  }
  next();
}
//Check table occupancy
async function validOccupied(req, res, next) {
  const {reservation_id} = res.locals.table;
  if (reservation_id) {
      return next({
        status: 400,
        message: "occupied",
      });
  }
  next();
}


  //Create tables
async function create (req, res){
    const data = await service.create(req.body.data);
    res.status(201).json({data});
  };

//Update existing table with reservation 
async function update(req, res) {
  const {data: {reservation_id}} = req.body;
  const {tableId} = req.params;
  const reservationStatus = "seated";
  await reservationService.statusUpdate(reservation_id, reservationStatus);
  const data = await service.update(tableId, reservation_id);  
  res.status(200).json({ data });
  }

  //Check whether the table exists
async function tableExists(req, res,next){
  const {tableId} = req.params;
  const table = await service.read(tableId);
  if(table){
      res.locals.table = table;
      return next();
  }
  return next({status: 404, message: `Table id ${tableId} does not exist`})

}

//Finish existing table and set reservation status to finished
async function remove(req, res) {
  const {tableId} = req.params;
  const reservationStatus = "finished";
  const reservation_id = null;
  const reservationId = res.locals.table.reservation_id;
  await reservationService.statusUpdate(reservationId, reservationStatus);
  const data = await service.remove(tableId, reservation_id);  
  res.status(200).json({ data });
  }


module.exports= {
list, 
create:[
    hasRequiredProperties,
hasOnlyValidProperties,
validTable,
asyncErrorBoundary(create)
], 
update: [
  hasData,
  hasSeatRequiredProperties,
  reservationExists,
  tableExists,
  validOccupied,
  validSeating,
  asyncErrorBoundary(update)
], 
remove: [
  tableExists,
  validNotOccupied, 
  asyncErrorBoundary(remove)
]
}