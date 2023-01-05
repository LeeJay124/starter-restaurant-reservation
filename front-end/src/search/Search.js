import React, {useState} from "react";
import ReservationsList from "../reservations/ReservationsList";
import { reservationSearch } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import "./Search.css";

function Search(){

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const initialSeachFormData = {
    mobile_number:``, 
  };
  const [searchFormData, setSearchFormData] = useState({...initialSeachFormData});
  const [searchPerformed, setSearchPerformed] = useState(false);



  const handleSearch = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
        const reservationsFromAPI = await reservationSearch({ mobile_number:searchFormData.mobile_number }, abortController.signal);
        setReservations(reservationsFromAPI);
        setSearchPerformed(true);
    }
    catch (error) {
          setReservationsError(error);
    }

    return () => abortController.abort();
};
  

const handleSearchChange = ({ target }) => {
  setSearchFormData({
      ...searchFormData,
      [target.name]: target.value,
  });
};
    return(
        <main>
          {reservationsError &&
                <ErrorAlert error={reservationsError} />
            }
      <div className="d-md-flex mb-3 pt-3">
      <form name="Tables" onSubmit={handleSearch}>
                <table className="table table-bordered table-condensed ljTable">
<tbody>
<tr className="table-dark text-dark"><th>Search for a Reservation</th></tr>
<tr>
<td><div className="flexFields"><div>
        <input name="mobile_number"
              type="text"
              size="30"
              placeholder="Enter a customer's phone number"
              onChange={handleSearchChange} 
              value={searchFormData.mobile_number} required/></div>
              <div>
              <button type="submit"  className="btn btn-primary ml-3">Find</button></div></div>
              </td>
              </tr>
                    </tbody>
                </table>
            </form>
      </div>
     {searchPerformed ? <div><div className="d-md-flex mb-3">
        <h4>Search Results</h4>
        </div>
        
        {reservations.length > 0 ? <ReservationsList reservations={reservations} /> : <p>No reservations found.</p>}
        </div> : ""} 

    </main>
  );
    
}
export default Search;