import React, {useState, useEffect} from "react";
import Reservation from "./Reservation";
import { updateReservationStatus, listReservations } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the reservation page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function ReservationsList({newDate}) {
  const history = useHistory();
    // const {url} = useRouteMatch();
    const [reservationError, setReservationError] = useState(null);
    const [reservations, setReservations] = useState([]);

    useEffect(()=>{
      async function loadDashboard() {
         const abortController = new AbortController();
         try{
           const reservationsFromAPI = await listReservations({ date: newDate }, abortController.signal);
           const reservationsToDisplay = reservationsFromAPI.filter((item)=> item.status !== "finished");
           setReservations(reservationsToDisplay);
         } catch(error){
           if (error){
             setReservationError(error)
           }
         }
         return () => abortController.abort();
         }
   
   loadDashboard();
     }, []);







    const handleReservationCancel = async (reservationId) => {
      const abortController = new AbortController();

        const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
        if (result) {
          try{
            const status = "cancelled";
            await updateReservationStatus(reservationId, status, abortController.signal);
            history.go();
        }
        catch (error) {
          if (error) {
              setReservationError(error);
          }
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
      <table className="table bordered table-striped table-hover table-condensed">
        <tbody>
          <tr>
          <td>First Name</td>
          <td>Last Name</td>
          <td>Phone</td>
          <td>Date</td>
          <td>Time</td>
          <td># of People</td>
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


