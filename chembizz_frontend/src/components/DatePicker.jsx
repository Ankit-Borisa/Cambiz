import React, { useState, useRef, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';

// Import react-date-range CSS
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DatePicker = ({ selectedOption }) => {

    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const datePickerRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [datePickerRef]);

    const handleSelect = (ranges) => {
        setSelectionRange(ranges.selection);
        const { startDate, endDate } = ranges.selection;

        if (startDate && endDate) {
            setShowDatePicker(false); // Close the date picker after a valid selection
        }
    };

    useEffect(() => {
        setShowDatePicker(true)
    }, [selectedOption]);

    return (
        <div className="relative" ref={datePickerRef}>
            {/* <input
                type="text"
                value={`${selectionRange.startDate.toDateString()} - ${selectionRange.endDate.toDateString()}`}
                onClick={() => setShowDatePicker(!showDatePicker)}
                readOnly
                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
            /> */}
            
            {showDatePicker && (
                <div className="absolute z-10 top-12 right-0">
                    <DateRangePicker
                        ranges={[selectionRange]}
                        onChange={handleSelect}
                    />
                </div>
            )}
            
        </div>
    );
};

export default DatePicker;
