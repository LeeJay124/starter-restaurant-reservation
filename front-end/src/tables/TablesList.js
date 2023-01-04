import React, {useState, useEffect} from "react";
import Table from "./Table";
import { finishTable, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import "./Tables.css";


function TablesList() {

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(() => {
    async function loadTables() {
      const abortController = new AbortController();
      try {
        const tablesFromAPI = await listTables(abortController.signal);
        setTables(tablesFromAPI);
      } catch (error) {
        if (error) {
          setTablesError(error)
        }
      }
      return () => abortController.abort();
    }

    loadTables();
  }, []);

  const finishTableHandler = async (table_id) => {
    const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.");
    if (result) {
      const abortController = new AbortController();

    try {
        await finishTable(table_id, abortController.signal);

        const updatedTables = await listTables(abortController.signal);

setTables(updatedTables);

      }
    catch (error) {
            setTablesError(error);
        }
    } 
    
};

  const list = tables.map((table) => {
    return <Table key={table.table_id} table={table} finishTable={finishTableHandler}/>
  });
  return (
    <main>
      <h2>Tables</h2>
      <ErrorAlert error={tablesError} />
      <div className="d-md-flex mb-3">
        <table className="table bordered table-striped table-hover table-condensed">
          <tbody>
            <tr>
              <td>Table Name</td>
              <td>Capacity</td>
              <td>Status</td>
              <td>Action</td>
            </tr>
            {list}
          </tbody>
        </table>
      </div>
    </main>

  );

}

export default TablesList;