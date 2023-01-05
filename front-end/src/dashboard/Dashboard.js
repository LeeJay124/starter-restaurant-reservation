import React, {useEffect,useState} from "react";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import {next, previous, today} from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { Link } from "react-router-dom";
import { listReservations } from "../utils/api";
import TablesList from "../tables/TablesList"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({date}) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

const newDate = useQuery().get("date") ?? date;

  useEffect(()=>{
   async function loadDashboard() {
      const abortController = new AbortController();
      try{
        const reservationsFromAPI = await listReservations({ date: newDate }, abortController.signal);
        const reservationsToDisplay = reservationsFromAPI.filter((item)=> item.status !== "cancelled");
        setReservations(reservationsToDisplay);
      } catch(error){
        if (error){
          setReservationsError(error)
        }
      }
      return () => abortController.abort();
      }

loadDashboard();
  }, [newDate]);

async function resetReservations(){
  const abortController = new AbortController();
try{
  const reservationsFromAPI = await listReservations({ date: newDate }, abortController.signal);
  const reservationsToDisplay = reservationsFromAPI.filter((item)=> item.status !== "cancelled");
  setReservations(reservationsToDisplay);
}catch(error){
  setReservationsError(error)
}
}
  return (
    <main>
      <h2 className="pt-3">Reservations for date: {newDate}</h2>
       <div className="d-md-flex mb-3"> <Link to={`/dashboard?date=${previous(newDate)}`}><button className="btn btn-primary mr-2">
          Previous Day
        </button></Link>
        <Link to={`/dashboard?date=${today(date)}`}><button className="btn btn-success mr-2">
          Today
        </button></Link>
        <Link to={`/dashboard?date=${next(newDate)}`}>
        <button className="btn btn-secondary mr-2">
          Next Day
        </button></Link>
        </div>
      
      <ErrorAlert error={reservationsError} />
      <ReservationsList reservations={reservations} />
      <TablesList resetReservations={resetReservations}/>
    </main>
  );
}

export default Dashboard;
