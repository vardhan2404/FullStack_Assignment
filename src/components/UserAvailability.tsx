import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

interface AvailabilitySlot {
  day: string;
  slots: { start: Date; end: Date }[];
}

const UserAvailability: React.FC = () => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchAvailability = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/users/${email}/availability`
      );
      setAvailability(response.data);
    };
    fetchAvailability();
  }, [email]);

  const addAvailabilitySlot = () => {
    if (selectedDay && startTime && endTime) {
      const dayName = selectedDay.toLocaleDateString("en-US", {
        weekday: "long",
      });

      setAvailability((prevAvailability) => [
        ...prevAvailability,
        { day: dayName, slots: [{ start: startTime, end: endTime }] },
      ]);

      axios.post("http://localhost:5000/api/availability", {
        email,
        day: dayName,
        start: startTime,
        end: endTime,
      });
    }
  };

  return (
    <div className="container">
      <h2>Set Your Availability</h2>
      <DatePicker
        selected={selectedDay}
        onChange={(date) => setSelectedDay(date)}
        placeholderText="Select a day"
      />
      <DatePicker
        selected={startTime}
        onChange={(time) => setStartTime(time)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={30}
        timeCaption="Start Time"
        dateFormat="h:mm aa"
        placeholderText="Select start time"
      />
      <DatePicker
        selected={endTime}
        onChange={(time) => setEndTime(time)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={30}
        timeCaption="End Time"
        dateFormat="h:mm aa"
        placeholderText="Select end time"
      />
      <button onClick={addAvailabilitySlot}>Add Availability Slot</button>

      <h3>Your Availability</h3>
      {availability.map((slot, index) => (
        <div key={index}>
          <p>
            {slot.day}:{" "}
            {slot.slots
              .map((s) => {
                const startTime = new Date(s.start);
                const endTime = new Date(s.end);
                return `${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`;
              })
              .join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
};

export default UserAvailability;
