import React from "react";
import { Link } from "react-router-dom";

function Reservation({reservation, handleReservationCancel}){


    return(
        <>
       <tr key={reservation.reservation_id}>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td data-reservation-id-status={`${reservation.reservation_id}`}>{reservation.status}</td>

            <td className="text-center"> 
            {reservation.status === "booked" ? <Link to={`/reservations/${reservation.reservation_id}/edit`}>
              <button className="btn btn-secondary btn-sm mb-1 ljbutton">Edit</button>
              </Link>: ""}
              {reservation.status === "booked" ? <Link to={`/reservations/${reservation.reservation_id}/seat`}>
              <button className="btn btn-info btn-sm mb-1 ljbutton">Seat</button>
              </Link>: ""}
              
              <button data-reservation-id-cancel={`${reservation.reservation_id}`} className="btn btn-danger btn-sm mb-1 ljbutton" onClick={()=> handleReservationCancel(reservation.reservation_id)}>Cancel</button>
              </td>
       
        </tr>
      </>
    )
}
export default Reservation;