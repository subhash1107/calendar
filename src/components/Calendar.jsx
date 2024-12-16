import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDaysInMonth, isToday } from "../utils/dateUtils";
import EventModal from "./EventModal";
import { useSelector } from "react-redux";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const events = useSelector((state) => state.events.events);

  const daysInMonth = getDaysInMonth(
    currentDate.getMonth(),
    currentDate.getFullYear()
  );
  const firstDayIndex = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateClick = (day) => {
    setSelectedDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
  };

  const formatDate = (date) => date.toISOString().split("T")[0];

  const isDateWithEvent = (day) => {
    const fullDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const dateKey = formatDate(fullDate);
    return events[dateKey]?.length > 0;
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setCurrentDate(new Date(year, currentDate.getMonth(), 1)); 
    setIsYearPickerOpen(false); 
  };

  const yearOptions = Array.from({ length: 20 }, (_, idx) => selectedYear - 10 + idx);

  return (
    <>
      <div className="h-[100vh] flex-col sm:justify-center flex">
        <h1 className="text-center text-3xl font-semibold">CALENDAR</h1>
        <div className="bg-white sm:border sm:shadow-lg sm:rounded-xl p-4 sm:w-[80%] md:w-[60%] lg:w-[40%] w-full mx-auto">
          <div className="flex items-center justify-between mb-4 relative">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-gray-800">
                {currentDate.toLocaleString("default", { month: "long" })}
                
                <button
                  onClick={() => setIsYearPickerOpen((prev) => !prev)}
                  className="text-xl ml-1 font-semibold text-gray-800 hover:underline"
                >
                  {selectedYear}
                </button>
              </h2>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {isYearPickerOpen && (
            <div className="absolute bg-white shadow-lg rounded-lg w-40 top-16 left-1/2 transform -translate-x-1/2 p-2 z-10">
              <ul className="text-sm space-y-1">
                {yearOptions.map((year) => (
                  <li
                    key={year}
                    className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
            {weekdays.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`placeholder-${idx}`} className="bg-gray-50"></div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const fullDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              );

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`p-2 cursor-pointer rounded-lg transition-all duration-200
                ${
                  isToday(fullDate)
                    ? "bg-blue-500 text-white font-bold"
                    : "hover:bg-gray-100 text-gray-700"
                }
                ${
                  selectedDate &&
                  selectedDate.toDateString() === fullDate.toDateString()
                    ? "ring-2 ring-blue-300"
                    : ""
                }
                ${isDateWithEvent(day) ? "bg-green-300" : ""}`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {selectedDate && (
            <EventModal
              date={selectedDate}
              onClose={() => setSelectedDate(null)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Calendar;
