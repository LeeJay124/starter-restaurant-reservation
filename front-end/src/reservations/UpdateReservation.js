import React, {useState, useEffect} from "react";
import { readReservation, updateReservation } from "../utils/api";
import {useHistory, useParams} from "react-router-dom";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";
import { formatAsDate, formatAsTime } from "../utils/date-time";

function UpdateReservation (){
  const {reservationId} = useParams();
    const history = useHistory();
   const [reservationError, setReservationError] = useState(null);
   
    const initialReservationFormData = {
         
        first_name:``, 
        last_name:``,
        mobile_number:``, 
        reservation_date: ``, 
        reservation_time: ``, 
        people: ``
      };
      useEffect(() => {
        const abortController = new AbortController();
    
        readReservation(reservationId, abortController.signal).then((data)=>{
          const formattedTime = formatAsTime(data.reservation_time);

          setReservationFormData({
            first_name:`${data.first_name}`, 
            last_name:`${data.last_name}`,
            mobile_number:`${data.mobile_number}`, 
            reservation_date: `${data.reservation_date}`, 
            reservation_time: formattedTime, 
            people: `${data.people}`,
          });});
    
        return () => abortController.abort();
      }, [reservationId]);

      const [reservationFormData, setReservationFormData]=useState({...initialReservationFormData});
      const handleReservationChange = ({target})=>{
        setReservationFormData({
          ...reservationFormData, 
          [target.name]:target.value,
        });   
      };
      const handleReservationUpdate = async (reservation) => {
        const reservationFormatted={
          "first_name":reservation.first_name, 
            "last_name":reservation.last_name,
            "mobile_number":reservation.mobile_number, 
            "reservation_date": reservation.reservation_date, 
            "reservation_time": reservation.reservation_time, 
            "people": Number(reservation.people), 
      }
        const abortController = new AbortController();
          try{
            const updatedRes = await updateReservation(reservationId, reservationFormatted, abortController.signal);
          const resDate = formatAsDate(updatedRes.reservation_date);
              history.push(`/dashboard?date=${resDate}`);
        } catch(error){
            setReservationError(error);
        }
      };
      const handleReservationSubmit = (event)=>{
        event.preventDefault();
        handleReservationUpdate(reservationFormData);
      };
    return (
      
        <div className="pt-3">
         {reservationError &&
                <ErrorAlert error={reservationError} />
            }
<ReservationForm handleReservationChange={handleReservationChange} handleReservationSubmit={handleReservationSubmit} reservationFormData={reservationFormData} />
        </div>
        
    )
}
export default UpdateReservation;