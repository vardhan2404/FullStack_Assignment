import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [availability, setAvailability] = useState([]);
  type Slot = {
    day: string;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const viewUserAvailability = async (email: string) => {
    const response = await axios.get(
      `http://localhost:5000/api/users/${email}/availability`
    );
    setAvailability(response.data);
  };

  const scheduleSession = (slot: any) => {
    axios.post("http://localhost:5000/api/schedule", {
      email: selectedUser,
      slot,
    });
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <select onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">Select a user</option>
        {users.map((user: any) => (
          <option key={user.email} value={user.email}>
            {user.email}
          </option>
        ))}
      </select>

      <button onClick={() => viewUserAvailability(selectedUser || "")}>
        View Availability
      </button>

      {availability.length > 0 && (
        <div>
          <h3>{selectedUser}'s Availability</h3>
          {availability.map((slot: Slot, index) => (
            <div key={index}>
              <p>{slot.day}</p>
              <button onClick={() => scheduleSession(slot)}>
                Schedule Session
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
