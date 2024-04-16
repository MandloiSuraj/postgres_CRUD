import React, { useState, useEffect } from "react";

const Table = () => {
  const [submittedData, setSubmittedData] = useState([]);
  const [editId, setEditId] = useState(null); // State to track the ID of the item being edited

  // Fetch data from the /info endpoint when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/info");
      const data = await response.json();
      setSubmittedData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/info/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // If deletion is successful, refetch data to update the table
        fetchData();
      } else {
        console.error("Failed to delete:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleEdit = (id) => {
    // Set the ID of the item being edited
    setEditId(id);
  };

  const handleSave = async (id, newData) => {
    try {
      const response = await fetch(`http://localhost:4000/api/info/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      if (response.ok) {
        // If update is successful, clear the edit mode
        setEditId(null);
        // Refetch data to update the table
        fetchData();
      } else {
        console.error("Failed to update:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const renderTableRows = () => {
    return submittedData.map((data) => (
      <tr key={data.id}>
        <td>
          {editId === data.id ? (
            <input
              
              defaultValue={data.name}
              onChange={(e) =>
                handleInputChange(data.id, "name", e.target.value)
              }
            />
          ) : (
            data.name
          )}
        </td>
        <td>
          {editId === data.id ? (
            <input
              
              defaultValue={data.email}
              onChange={(e) =>
                handleInputChange(data.id, "email", e.target.value)
              }
            />
          ) : (
            data.email
          )}
        </td>
        <td className="action-buttons">
          {editId === data.id ? (
            <button
              className="save-button"
              onClick={() =>
                handleSave(data.id, { name: data.name, email: data.email })
              }
            >
              Save
            </button>
          ) : (
            <button className="edit-button" onClick={() => handleEdit(data.id)}>
              Edit
            </button>
          )}
          <button className="remove-button" onClick={() => handleRemove(data.id)}>Remove</button>
        </td>
      </tr>
    ));
  };

  const handleInputChange = (id, field, value) => {
    // Update the submittedData state with the edited value
    setSubmittedData(
      submittedData.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]: value,
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="table-container">
      <h2>Submitted Data</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {submittedData.length > 0 ? (
            renderTableRows()
          ) : (
            <tr>
              <td colSpan="3">No data submitted yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
