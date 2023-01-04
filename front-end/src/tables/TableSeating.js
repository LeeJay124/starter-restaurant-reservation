import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, readReservation, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import "./Tables.css";


function TableSeating() {
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);
    const { reservationId } = useParams();
    const [reservation, setReservation] = useState([]);
    const [reservationError, setReservationError] = useState(null);
    const [options, setOptions] = useState([]);
    const history = useHistory();
    
    const [seatTableFormData, setSeatTableFormData] = useState({});


    useEffect(() => {
        async function loadReservation() {
            const abortController = new AbortController();
            try {
                const reservationFromAPI = await readReservation(reservationId,abortController.signal);
                setReservation(reservationFromAPI);
            } catch (error) {
                if (error) {
                    setReservationError(error)
                }
            }
            return () => abortController.abort();
        }
        async function loadTables() {
            const abortController = new AbortController();
            try {
                const tablesFromAPI = await listTables(abortController.signal);
                setTables(tablesFromAPI);
                const results = [];
                tablesFromAPI.forEach((table) => {
                    results.push({
                        key: `${table.table_name} - ${table.capacity}`,
                        value: table.table_id
                    });
                });
                setOptions([
                    { key: `Select a table`, value: '' },
                    ...results
                ])
            } catch (error) {
                if (error) {
                    setTablesError(error)
                }
            }
            return () => abortController.abort();
        }

        loadTables();
        loadReservation();
    }, [reservationId]);

    const handleTableSeating = async (table) => {
const reservationDate = reservation.reservation_date;
        const abortController = new AbortController();
        try {
            await updateTable(table.table_id, reservationId, abortController.signal);

            history.push(`/dashboard?date=${reservationDate}`);
        }
        catch (error) {
            if (error) {
                setTablesError(error);
            }
        }

        return () => abortController.abort();
    };

    function validCapacity(table) {
        const people = reservation.people;
        const currentTable = tables.filter((item)=>table.id === item.id);
        const tableCapacity = currentTable[0].capacity;
        const errors = {};
        if (people > tableCapacity) {
            errors.capacity='Form: Too many people for this table';
        }
        
        return errors;
    }
    const handleTableSeatChange = ({ target }) => {
        setSeatTableFormData({
            ...seatTableFormData,
            [target.name]: target.value,
        });
    };
    const handleTableseatSubmit = (event) => {
        event.preventDefault();
        handleTableSeating(seatTableFormData);

    };

    const formValidation = (event) => {
        event.preventDefault();
        const capacityError = validCapacity(seatTableFormData);
                     // Clear all previous errors
  const errorElements = document.querySelectorAll(".errors");
  
    for (let element of errorElements) {
      element.style.display = "none";
    }
     // Display any new errors
     if(Object.keys(capacityError).length !== 0){
      const errorDiv = document.querySelector(".errors");
      errorDiv.classList.add("alert");
      errorDiv.classList.add("alert-danger");
      Object.keys(capacityError).forEach((key) => {
          // Find the specific error element
          const errorElement = document.querySelector(`.errors`);
          errorElement.innerHTML = capacityError[key];
          errorElement.style.display = "block";
        });
     }
           

            else{
            handleTableseatSubmit(event);
        }
    }
    return (

        <div className="pt-3">
                                <div className="m-2 errors"></div>

            {tablesError &&
                <ErrorAlert error={tablesError} />
            }
            {reservationError &&
                <ErrorAlert error={reservationError} />
            }
            <form name="TableSeating" onSubmit={formValidation}>
                <table className="table table-bordered table-condensed">
                    <tbody>
                        <tr className="table-dark text-dark">
                            <th colSpan={"3"}>Seat a Reservation</th></tr>
                        <tr>
                            <td>
                                <div className="flexFields">
                                    <div>
                                {/* <label htmlFor="table_id">Choose a table:</label> */}

                                <select name="table_id" id="table_id" onChange={handleTableSeatChange}>
                                    {options.map((option) => {
                                        return (
                                            <option key={option.value} value={option.value}>{option.key}</option>
                                        )
                                    })}
                                </select></div><div><button type="submit" className="btn btn-primary mr-2 ml-2">Submit</button>
                                    </div><div><button type="button" onClick={() => history.goBack()} className="btn btn-danger">Cancel</button></div></div>
</td></tr>
                    
                    </tbody>
                </table>
            </form>
        </div>
    )
}

export default TableSeating;