import React, {useState} from "react";
import { useHistory} from "react-router-dom";
import { createReservation,  } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

function CreateReservation (){
const history = useHistory();
const [reservationsError, setReservationsError] = useState(null);

  const handleReservationCreate = async (reservation) => {
    const reservationFormatted={
      "first_name":reservation.first_name, 
        "last_name":reservation.last_name,
        "mobile_number":reservation.mobile_number, 
        "reservation_date": reservation.reservation_date, 
        "reservation_time": reservation.reservation_time, 
        "people": Number(reservation.people), 
        "status": reservation.status
  }
      

        const abortController = new AbortController();
try{
  const newReservation = await createReservation(reservationFormatted, abortController.signal);
  const date = new Date(newReservation.reservation_date);
  const dashboardDate = date.toISOString().split('T')[0];
  history.push(`/dashboard?date=${dashboardDate}`);
}
   catch(error){
      setReservationsError(error)
   }          
    
  return () => abortController.abort();
};

    const initialReservationFormData = {
        
        first_name:``, 
        last_name:``,
        mobile_number:``, 
        reservation_date: ``, 
        reservation_time: ``, 
        people: 0, 
        status: `booked`
      };
      const [reservationFormData, setReservationFormData]=useState({...initialReservationFormData});
      const handleReservationChange = ({target})=>{
        setReservationFormData({
          ...reservationFormData, 
          [target.name]:target.value,
        });   
      };
      const handleReservationSubmit = (event)=>{
        event.preventDefault();
       handleReservationCreate(reservationFormData);
      };
    return (
        <div className="pt-3">
        <ErrorAlert error={reservationsError} />
        <ReservationForm handleReservationChange={handleReservationChange} handleReservationSubmit={handleReservationSubmit} reservationFormData={reservationFormData} handleReservationCreate={handleReservationCreate} />
       
        </div>
    )
}
export default CreateReservation;