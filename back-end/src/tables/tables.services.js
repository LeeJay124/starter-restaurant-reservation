const knex = require("../db/connection");

//Knex query to list tables
function list() {
    return knex("tables")
    .select("*")
    .from("tables as t")
    .orderBy("t.table_name");
}
//Knex query to read table based on table id provided
function read(table_id){
    return knex
    .select("*")
    .from("tables as t")
    .where({"t.table_id":table_id})
    .first();

}
//Knex query to create table 
function create(table) {
    return knex("tables")
      .insert(table)
      .returning(["capacity", "table_name", "table_id"])
      .then((data) => {
        return {
            capacity: Number(data[0].capacity), 
            table_name: data[0].table_name, 
            table_id: data[0].table_id
        }
      });
  }

//Knex query to add reservation id to table
function update(tableId, reservationId){
    return knex("tables")
    .select("*")
    .where({table_id: tableId})
    .update({reservation_id: reservationId}, ["*"])
    .then((data)=> data[0]);
}

//Knex query to remove reservation id from table
function remove(tableId, reservationId){
    return knex("tables")
    .select("*")
    .where({table_id: tableId})
    .update({reservation_id: reservationId}, ["*"])
    .then((data)=> data[0]);
}

module.exports = {
    list, read, create, update, remove
}