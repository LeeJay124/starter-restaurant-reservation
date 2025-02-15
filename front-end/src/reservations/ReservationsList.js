import React, {useState} from "react";
import Reservation from "./Reservation";
import { updateReservationStatus } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import "./Reservations.css";

/**
 * Defines the reservation page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function ReservationsList({reservations}) {
  const history = useHistory();
    const [reservationError, setReservationError] = useState(null);

    const handleReservationCancel = async (reservationId) => {
      const abortController = new AbortController();

        const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
        if (result) {
          try{
            const status = "cancelled";
            const updatedReservation = await updateReservationStatus(reservationId, status, abortController.signal);
            history.push(`/dashboard?date=${updatedReservation.reservation_date}`);
        }
        catch (error) {
              setReservationError(error);
      }

      return () => abortController.abort();
    };
      
  };

    const list = reservations.map((reservation) => {
        return <Reservation key={reservation.reservation_id} reservation={reservation} handleReservationCancel={handleReservationCancel} />
    });

    
  return (
    <main>
      {reservationError &&
                <ErrorAlert error={reservationError} />
            }
      <div className="d-md-flex mb-3">   
      <table className="table rtable table-striped table-hover table-responsive">
        <tbody>
          <tr>
          <td>First Name</td>
          <td>Last Name</td>
          <td>Phone</td>
          <td>Date</td>
          <td>Time</td>
          <td>People</td>
          <td>Status</td>
          <td className="text-center">Actions:</td>
          </tr>
          {list}
        </tbody>
        </table>   
      </div>
    </main>
  );
}

export default ReservationsList;


