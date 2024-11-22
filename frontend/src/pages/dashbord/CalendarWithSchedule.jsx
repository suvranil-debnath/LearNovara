import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
} from "date-fns";
import "./CalendarWithSchedule.css";
import DatePicker from "react-datepicker";
import { server } from "../../main";
import toast from "react-hot-toast"; 

const CalendarWithSchedule = ({ userId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleName, setScheduleName] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [selectedDaySchedule, setSelectedDaySchedule] = useState(null); // For storing schedule of selected day

  // Fetch schedules for the current month
  useEffect(() => {
    const fetchSchedules = async () => {
      const startDate = startOfMonth(selectedDate);
      const endDate = endOfMonth(selectedDate);

      try {
        const response = await axios.get(`${server}/api/schedules`, {
          params: {
            userid: userId,
            startDate,
            endDate,
          },
        });
        setSchedules(response.data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        toast.error("Failed to fetch schedules.");
      }
    };

    fetchSchedules();
  }, [selectedDate, userId]);

  // Check if a date has a schedule
  const isDateHighlighted = (date) =>
    schedules.some(
      (schedule) =>
        format(new Date(schedule.date), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );

  // Get all days of the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate),
  });

  // Render calendar days with blanks for alignment
  const renderDaysGrid = () => {
    const blanks = [];
    const firstDayOfMonth = getDay(startOfMonth(selectedDate));
    for (let i = 0; i < firstDayOfMonth; i++) {
      blanks.push(<div className="calendar-blank" key={`blank-${i}`} />);
    }

    const days = daysInMonth.map((date) => (
      <div
        key={date}
        className={`calendar-day ${isToday(date) ? "current" : ""} ${
          isDateHighlighted(date) ? "highlighted" : ""
        } ${format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd") ? "selected" : ""}`}
        onClick={() => handleDateClick(date)} // Handle date click
      >
        {format(date, "d")}
      </div>
    ));

    return [...blanks, ...days];
  };

  // Handle opening the modal
  const handleOpenModal = () => {
    setSelectedDateTime(selectedDate); 
    setScheduleName("");
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle creating a new schedule
  const handleCreateSchedule = async () => {
    if (!scheduleName) {
      toast.error("Please enter a schedule name!");
      return;
    }

    try {
      const newSchedule = {
        userid: userId,
        name: scheduleName,
        date: selectedDateTime, 
      };

      const response = await axios.post(`${server}/api/schedules/new`, newSchedule);
      setSchedules((prev) => [...prev, response.data]);
      toast.success("Schedule created successfully!");
      setIsModalOpen(false); 
    } catch (err) {
      console.error("Error creating schedule:", err);
      toast.error("Failed to create schedule.");
    }
  };

  // Handle date click to show the schedule for that day
  const handleDateClick = (date) => {
    setSelectedDate(date); // Set selected date
    const selectedSchedule = schedules.find(
      (schedule) =>
        format(new Date(schedule.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
    setSelectedDaySchedule(selectedSchedule); // Set the schedule for the selected day
  };

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <button
          className="arrow-btn"
          onClick={() =>
            setSelectedDate(
              new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
            )
          }
        >
          &lt;
        </button>
        <span>{format(selectedDate, "MMMM yyyy")}</span>
        <button
          className="arrow-btn"
          onClick={() =>
            setSelectedDate(
              new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
            )
          }
        >
          &gt;
        </button>
      </header>
      <div className="calendar-days-header">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div className="calendar-day-name" key={day}>
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid">{renderDaysGrid()}</div>
      <button className="create-schedule-btn" onClick={handleOpenModal}>
        + Create New Schedule
      </button>

      {/* Modal for creating a new schedule */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Schedule</h2>
            <label>Schedule Name:</label>
            <input
              type="text"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              placeholder="Enter schedule name"
            />
            <label>Pick Date and Time:</label>
            <DatePicker
              selected={selectedDateTime}
              onChange={(date) => setSelectedDateTime(date)} 
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa" 
              timeCaption="Time"
            />
            <div className="modal-actions">
              <button className="modal-btn" onClick={handleCreateSchedule}>
                Save
              </button>
              <button className="modal-btn cancel" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display schedule details for the selected date in a modal */}
      {selectedDaySchedule && (
        <div className="schedule-info-modal">
          <div className="modal-content">
            <h3>Schedule for {format(selectedDate, "MMMM d, yyyy")}</h3>
            <div>
              <strong>Schedule Name:</strong> {selectedDaySchedule.name}
            </div>
            <div>
              <strong>Time:</strong> {format(new Date(selectedDaySchedule.date), "h:mm aa")}
            </div>
            <button className="modal-btn cancel" onClick={() => setSelectedDaySchedule(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarWithSchedule;
