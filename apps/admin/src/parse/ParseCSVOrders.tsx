import React, { useState } from 'react';
import Papa from 'papaparse';
import DownloadButton from '../components/DownloadButton';
import { order } from 'types/src/index';

const ParseCSVOrders = () => {
  const [csvData, setCSVData] = useState<any[]>([]);

  const handleSubmitCSV = () => {

    let orderAttributes = ['orderNumber', 'cname', 'cphone', 'cemail', 'address', 'deliveryDate', 'deliverTimeRangeStart', 'deliverTimeRangeEnd', 'specialInstructions', 'rentingItems', 'extraItems']

    let orders: any = []
    csvData.map((row, rowIndex) => {
      let orderobject: any = {}
      Object.values(row).map((cell: any, cellIndex: number) => {
        orderobject[orderAttributes[cellIndex]] = cell
      })
      //console.log(orderobject)
      orderobject[orderAttributes[5]] = new Date(orderobject[orderAttributes[5]])
      orderobject[orderAttributes[6]] = parseInt(orderobject[orderAttributes[6]])
      orderobject[orderAttributes[7]] = parseInt(orderobject[orderAttributes[7]])
      orderobject[orderAttributes[9]] = []
      orderobject[orderAttributes[10]] = []


      let parse = order.safeParse(orderobject)
      if (parse.success) {
        console.log(parse.data)
      }
      else {
        console.log(parse.error)
      }

    }

    )
  }

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
    <div className='flex flex-col  '>
      <h1 className='text-center text-xl mb-8'>Upload CSV</h1>
      <DownloadButton></DownloadButton>
      <input className='' type="file" accept=".csv" onChange={handleFileUpload} />


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
          <button onClick={handleSubmitCSV} className='bg-blue-700 text-white py-2 px-4 mr-2 rounded hover:bg-blue-600'>Submit</button>
        </div>
      )}
    </div>
  );
};

export default ParseCSVOrders;
