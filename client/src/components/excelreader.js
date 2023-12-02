import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelReader = ({ onDataLoaded }) => {
  const [attendanceData, setAttendanceData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Assuming the first sheet is the one you want to read
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet data to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      setAttendanceData(jsonData);

      // Pass the data to the parent component
      //onDataLoaded(jsonData);
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
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr key={index}>
                  <td>{record.Name}</td>
                  <td>{record['Clock In']}</td>
                  <td>{record['Clock Out']}</td>
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