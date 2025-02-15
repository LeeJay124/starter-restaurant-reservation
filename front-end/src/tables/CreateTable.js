import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import "./Tables.css";

function CreateTable() {
    const history = useHistory();
    const [tablesErrors, setTablesErrors] = useState(null);
    const initialTableFormData = {

        table_name: ``,
        capacity: 0,
    };
    const [tableFormData, setTableFormData] = useState({ ...initialTableFormData });

    const handleTableCreate = async (table) => {
const tableFormatted={
    "table_name": table.table_name,
    "capacity": Number(table.capacity)
}
        const abortController = new AbortController();
        try {
            await createTable(tableFormatted, abortController.signal);

            history.push("/dashboard");
        }
        catch (error) {
                setTablesErrors(error);
        }

        return () => abortController.abort();
    };


    const handleTableChange = ({ target }) => {
        setTableFormData({
            ...tableFormData,
            [target.name]: target.value,
        });
    };
    const handleTableSubmit = (event) => {
        event.preventDefault();
        handleTableCreate(tableFormData);

    };
    function validCapacity(table) {
        const errors = {};
        if (table.capacity < 1) {
            errors.capacity= 'Form: Capacity must be at least 1';
        }
        if (table.table_name.length < 2) {
            errors.table='Form: Table name must be at least 2 characters';
        }
        return errors;
    }

    const formValidation = (event) => {
        event.preventDefault();
        const capacityError = validCapacity(tableFormData);
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
            handleTableSubmit(event);
        }
    };

    return (
        <div className="pt-3">
                     <div className="m-2 errors"></div>

            {tablesErrors &&
                <ErrorAlert error={tablesErrors} />
            }
            <form name="Tables" onSubmit={formValidation}>
                <table className="table table-bordered table-condensed ljTable">
                    <tbody>
                        <tr className="table-dark text-dark">
                            <th>Create a Table</th></tr>
                        <tr>
                            <td><label htmlFor="table_name">Table Name:</label>
                       <input name="table_name"
                                id="table_name"
                                placeholder="Table Name"
                                type="text"
                                onChange={handleTableChange}
                                value={tableFormData.table_name} required /></td></tr>
                                <tr>
                                <td><label htmlFor="capacity">Capacity:</label>
                            <input name="capacity"
                                id="capacity"
                                placeholder="Capacity"
                                type="number"
                                onChange={handleTableChange}
                                value={tableFormData.capacity} required /></td>
                                </tr>
                                <tr>
                            <td><button type="submit" className="btn btn-primary mr-3">Submit</button>
                                <button type="button" onClick={() => history.goBack()} className="btn btn-danger">Cancel</button></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}
export default CreateTable;