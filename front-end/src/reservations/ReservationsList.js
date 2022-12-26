import React, {useState, useEffect}  from "react";
import CreateReservation from "./CreateReservation";
import UpdateReservation from "./UpdateReservation";
import Reservation from "./Reservation";
import { listReservations } from "../utils/api";
import { Route, useHistory, useParams, useRouteMatch } from "react-router-dom";

/**
 * Defines the reservation page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function ReservationsList() {
  const history = useHistory();
    const {url} = useRouteMatch();
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
      const abortController = new AbortController();
  
      //listReservations( abortController.signal).then((data) => { setReservations(data); setReservations(data.reservations); });
  
      return () => abortController.abort();
    }, []);
  
    const handleReservationDelete = async (id) => {
        const result = window.confirm("Delete this reservation?");
        if (result) {

            const abortController = new AbortController();

            //deleteReservation(id, abortController.signal);

            history.push("/dashboard");
        }
    };

    const handleReservationCreate = async (reservation) => {
        //const {deckId} = deckId;
        const result = window.confirm("Create this reservation?");
        if (result) {

            const abortController = new AbortController();

            //createReservation(reservation, abortController.signal);

            history.push("/dashboard");
        }
    };

    const list = reservations.map((reservation) => {
        return <Reservation key={reservation.id} reservation={reservation} handleReservationDelete={handleReservationDelete} />
    });

    
  return (
    <main>
      <h1>Reservations</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
       
        <div className="reservation-deck ptr-3 pt-3">{list}</div>
        <Route path={`${url}/reservations/new`}><CreateReservation handleReservationCreate={handleReservationCreate}/></Route>
        <Route path={`${url}/reservations/:reservationId/edit`}><UpdateReservation /></Route>
      </div>
    </main>
  );
}

export default ReservationsList;

