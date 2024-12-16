import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEvent, deleteEvent, editEvent } from "../utils/eventSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Pencil } from "lucide-react";
import { createSelector } from "reselect";

const selectEventsByDate = createSelector(
    [(state) => state.events.events, (_, dateString) => dateString],
    (eventsByDate, dateString) => {
      return eventsByDate[dateString] || [];
    }
  );
const EventModal = ({ date, onClose }) => {
  const formatDate = (date) => date.toISOString().split("T")[0];
  const dateString = formatDate(date);
  const dispatch = useDispatch();
  const events = useSelector(state => selectEventsByDate(state, dateString));
  
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleAddEvent = () => {
    if (eventName && startTime && endTime) {
      if (editIndex !== null) {
        dispatch(
          editEvent({
            date: dateString,
            index: editIndex,
            event: { eventName, startTime, endTime, description },
          })
        );
      } else {
        const eventData = { eventName, startTime, endTime, description };
        dispatch(
          addEvent({
            date: dateString,
            event: eventData,
          })
        );
      }
      setEventName("");
      setStartTime("");
      setEndTime("");
      setDescription("");
    }
  };

  const handleDeleteEvent = (index) => {
    dispatch(deleteEvent({ date: dateString, index }));
  };
  const handleEditEvent = (index) => {
    const event = events[index];
    setEventName(event.eventName);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setDescription(event.description);
    setEditIndex(index);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Events on{" "}
            <span className="text-gray-500">{date.toDateString()}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-gray-500 text-center">No events for this day</p>
          ) : (
            events.map((event, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium text-gray-800">
                    {event.eventName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {event.startTime} - {event.endTime}
                  </p>
                  {event.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {event.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  {/* edit event button */}
                  <button
                    onClick={() => handleEditEvent(idx)}
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"
                    aria-label="Edit Event button"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  {/* delete event button */}
                  <button
                    onClick={() => handleDeleteEvent(idx)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                    aria-label="Delete Event button"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* event form */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
          <textarea
            placeholder="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            rows={3}
          ></textarea>
          {/* add event button */}
          <button
            onClick={handleAddEvent}
            disabled={!eventName || !startTime || !endTime}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 
                       disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Event
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
