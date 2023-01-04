import React from "react";
import {useHistory} from "react-router-dom";

function ReservationForm ({reservationFormData, handleReservationChange, handleReservationSubmit}){
const history = useHistory();

const validDate = (reservation) =>{
const rDate = reservation.reservation_date;
const rTime = reservation.reservation_time;
  const d = new Date(`${rDate}T${rTime}`);
  const errors = {};
  const tooday = new Date();
  let day = d.getDay();

if(d.getTime() < tooday.getTime()){
        errors.past='Form: Reservation occurs in the past';
}
if(day === 2){
  errors.tuesday = 'Form: We are closed on Tuesday';
}
if(rTime < "10:30"|| rTime > "22:30"){
    errors.hours = 'Form: Reservaiton time is before open or after close';
  }
  if(rTime > "21:30" && rTime < "22:30"){
    errors.close = 'Form: Reservaiton time is after close time';
  }
 return errors;
  
}

const formValidation = (event)=>{
        event.preventDefault();
       const dateErrors = validDate(reservationFormData);
       // Clear all previous errors
  const errorElements = document.querySelectorAll(".errors");

  for (let element of errorElements) {
    element.style.display = "none";
  }
   // Display any new errors
   if(Object.keys(dateErrors).length !== 0){
    const errorDiv = document.querySelector(".errors");
    errorDiv.classList.add("alert");
    errorDiv.classList.add("alert-danger");
    Object.keys(dateErrors).forEach((key) => {
        // Find the specific error element
        const errorElement = document.querySelector(`.errors`);
        errorElement.innerHTML = dateErrors[key];
        errorElement.style.display = "block";
      });
   }
   
else{
        handleReservationSubmit(event);
}
}

    return (
        <div>
         <div className="m-2 errors"></div>

        <form name="Reservations" onSubmit={formValidation}>
        <table className="table table-bordered table-condensed">
          <tbody>
          <tr className="table-dark text-dark"><th colSpan={"3"}>Add/Edit a Reservation</th></tr>
            <tr>
                <td><label htmlFor="first_name">First Name</label><input name="first_name"
                    id="first_name"
                    placeholder="First Name"
                    type="text"
                    onChange={handleReservationChange}
                    value={reservationFormData.first_name} required/></td></tr>
                    <tr>
                <td><label htmlFor="last_name">Last Name</label><input name="last_name"
                    id="last_name"
                    placeholder="Last Name"
                    type="text"
                    onChange={handleReservationChange}
                    value={reservationFormData.last_name} required/></td></tr>
                    <tr>
                <td><label htmlFor="mobile_number">Mobile Number</label><input name="mobile_number"
                    id="mobile_number"
                    placeholder="Mobile Number"
                    type="text"
                    onChange={handleReservationChange}
                    value={reservationFormData.mobile_number} required/></td>
            </tr>
           
           <tr>
                <td><label htmlFor="reservation_date">Date of Reservation</label><input name="reservation_date"
                    id="reservation_date"
                    placeholder="Reservation Date"
                    type="date"
                    onChange={handleReservationChange}
                    value={reservationFormData.reservation_date} required/></td></tr>
                    <tr>
                <td> <label htmlFor="reservation_time">Time of Reservation</label><input name="reservation_time"
                    id="reservation_time"
                    placeholder="Reservation Time"
                    type="time"
                    onChange={handleReservationChange}
                    value={reservationFormData.reservation_time} required/></td></tr>
                    <tr>
                <td><label htmlFor="people"># of People</label><input name="people"
                    id="people"
                    placeholder="# of People"
                    type="number"
                    onChange={handleReservationChange}
                    value={reservationFormData.people} required/></td>
                </tr>
         
                    <tr><td>
                    <button type="submit" className="btn btn-primary mr-3">Submit</button>
                    <button  type="button" onClick={()=> history.goBack()} className="btn btn-danger">Cancel</button>

                    </td></tr>
                    </tbody>
            </table>
        </form>
        </div>
    );
}
export default ReservationForm;