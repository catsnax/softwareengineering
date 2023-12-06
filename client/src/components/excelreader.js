import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const ExcelReader = ({ onDataLoaded }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [startingTime, setStartingTime] = useState([]);
  const [endingTime, setEndingTime] = useState([]);

  const [hoursDifference, setHoursDifference] = useState([]);
  
useEffect(() => {
  console.log(hoursDifference);
})
  
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Assuming the first sheet is the one you want to read
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      
    //function to convert time string variable to datetime variable
    function convertTimeToDatetime(timeString, date) {
        const [hours, minutes] = timeString.match(/\d+/g).map(Number);
        const isPM = timeString.includes('PM');

        // Adjust hours for PM
        const adjustedHours = isPM ? hours + 12 : hours;
      
        // Create a new Date object with the same date and adjusted time
        const datetime = new Date(date);
        datetime.setHours(adjustedHours);
        datetime.setMinutes(minutes);
        datetime.setSeconds(0);
        datetime.setMilliseconds(0);
      
        return datetime;
      }

    //function to get the difference between two times
    function calculateHourDifference(startDate, endDate) {
      const startTime = new Date(startDate).getTime();
      const endTime = new Date(endDate).getTime();
    
      // Calculate the time difference in milliseconds
      const timeDifference = endTime - startTime;
    
      // Convert milliseconds to hours
      const hourDifference = timeDifference / (1000 * 60 * 60);

      console.log(hourDifference)
    
      return hourDifference;
    }



    // Convert sheet data to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet, 
      {raw: false,
      dateNF: 'yyyy-mm-ddTHH:MM:ss',
      cellDates: true})

      function customRound(number) {
        const decimalPart = number - Math.floor(number);
        
        if (decimalPart >= 0.68) {
          return Math.ceil(number);
        } else {
          return Math.floor(number);
        }
      }
      
    let result = 0

    setStartingTime(jsonData.map((row) => row['Clock In']));
    setEndingTime(jsonData.map((row) => row['Clock Out']));


    let dummyStarting = (jsonData.map((row) => row['Clock In']));
    let dummyEnding = (jsonData.map((row) => row['Clock Out']));

    let convertedStarting = [];
    let convertedEnding = [];

    for(let i = 0; i < dummyStarting.length - 1; i++){
      convertedStarting.push(convertTimeToDatetime(dummyStarting[i], new Date()));
      convertedEnding.push(convertTimeToDatetime(dummyEnding[i], new Date()));
    }
    
    let dummyHours = []

    for(let i = 0; i < convertedStarting.length; i++){
      let pusher = calculateHourDifference(convertedStarting[i], convertedEnding[i]);
      dummyHours.push(customRound(pusher));
      setHoursDifference(dummyHours);
    }
    setAttendanceData(jsonData);

    onDataLoaded(jsonData, dummyHours);
      // Pass the data to the parent component
    
    };
    
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {attendanceData && (
        <div>
          <h2>Attendance Data:</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Number of Hours</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr key={index}>
                  <td>{record.Name}</td>
                  <td>{startingTime[index]}</td>
                  <td>{endingTime[index]}</td> 
                  <td>difference {hoursDifference[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExcelReader;