import React, { useState } from 'react';
import Papa from 'papaparse';
import DownloadButton from '../components/DownloadButton';

const ParseCSVOrders = () => {
  const [csvData, setCSVData] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          console.log(result)
          setCSVData(result.data);
        },
        header: true, // Set this to true if the CSV file has headers
      });
    }
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <h1 className='text-center text-xl'>Upload CSV</h1>
      <br></br>
      <br></br>
      <DownloadButton></DownloadButton>
      <input type="file" accept=".csv" onChange={handleFileUpload} />


      {csvData.length > 0 && (
        <div>
          <h3>Parsed CSV Data:</h3>
          <table>
            <thead>
              <tr>
                {csvData[0] &&
                  Object.keys(csvData[0]).map((header) => <th key={header}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((cell: any, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ParseCSVOrders;
