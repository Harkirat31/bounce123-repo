import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import DownloadButton from '../components/DownloadButton';
import { order } from 'types/src/index';
import { createOrder, } from '../services/ApiService';


const ParseCSVOrders = () => {
  const [csvData, setCSVData] = useState<any[]>([]);
  const [createOrderStatus, setCreateOrdersStatus] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const uploadInputButtonRef = useRef<any>(null);


  const handleSubmitCSV = () => {

    let orderAttributes = ['orderNumber', 'cname', 'cphone', 'cemail', 'address', 'deliveryDate', 'priority', 'specialInstructions', 'itemsDetail',]
    setIsLoading(true)
    let statusOfUploading: {}[] = []
    csvData.map(async (row) => {
      let orderobject: any = {}
      Object.values(row).map((cell: any, cellIndex: number) => {
        orderobject[orderAttributes[cellIndex]] = cell
      })
      orderobject[orderAttributes[5]] = new Date(new Date(orderobject[orderAttributes[5]]).setHours(0, 0, 0, 0))

      if (orderobject['priority'])
        try {
          let parse = order.safeParse(orderobject)
          if (parse.success) {
            createOrder(parse.data).then((result: any) => {
              if (result.isAdded) {
                statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: true })
              }
              else {
                statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false })
              }
              if (statusOfUploading.length === csvData.length) {
                setCreateOrdersStatus(statusOfUploading)
              }

            }).catch((_err) => {
              statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false })
              if (statusOfUploading.length === csvData.length) {
                setCreateOrdersStatus(statusOfUploading)
              }
            })
          }
          else {
            statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false })
            if (statusOfUploading.length === csvData.length) {
              setCreateOrdersStatus(statusOfUploading)
            }
          }
        }
        catch (e) {
          statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false })
          if (statusOfUploading.length === csvData.length) {
            setCreateOrdersStatus(statusOfUploading)
          }
        }
    }
    )
    console.log(statusOfUploading)


    setIsLoading(false)
    setCSVData([])
    uploadInputButtonRef.current.value = ''
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    setCreateOrdersStatus([])
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
      <input ref={uploadInputButtonRef} className='mb-8' type="file" accept='.csv' onChange={handleFileUpload} />


      {csvData.length > 0 && (
        <div>
          <div className='max-h-96 overflow-y-scroll'>

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
          <button onClick={handleSubmitCSV} className='bg-blue-700 text-white py-2 px-4 mr-2 rounded hover:bg-blue-600'>Submit</button>
        </div>
      )}
      {isLoading && <p>Uploading...</p>}
      {!isLoading && createOrderStatus.length > 0 && <div className='max-h-64 overflow-y-scroll'>
        <h1 className='text-center mb-2 text-blue-700'>Uploading Result</h1>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Order Number
              </th>
              <th scope="col" className="px-6 py-3">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {createOrderStatus.map((orderStatus: any) => {
              return <>
                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                  {orderStatus.success &&
                    <>
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {orderStatus.orderNumber}
                      </th>
                      <td className="px-6 py-4">
                        {orderStatus.success == true ? "Success" : "Failed"}
                      </td>
                    </>
                  }

                </tr>
              </>
            })}
          </tbody>
        </table>

      </div>}
    </div>
  );
};

export default ParseCSVOrders;

