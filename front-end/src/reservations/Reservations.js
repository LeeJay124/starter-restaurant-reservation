import React from "react";

/**
 * Defines the reservation page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Reservations() {
  
  

  return (
    <main>
      <h1>Reservations</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
    </main>
  );
}

export default Reservations;