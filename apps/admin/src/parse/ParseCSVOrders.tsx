import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import DownloadButton from '../components/Order/DownloadButton';
import { ErrorCode, order } from 'types/src/index';
import { createOrder, } from '../services/ApiService';
import { useRecoilState } from 'recoil';
import { ordersSearchDate } from '../store/atoms/orderAtom';


const ParseCSVOrders = () => {
  const [csvData, setCSVData] = useState<any[]>([]);
  const [createOrderStatus, setCreateOrdersStatus] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const uploadInputButtonRef = useRef<any>(null);
  const [date, setDate] = useRecoilState(ordersSearchDate)



  const handleSubmitCSV = () => {


    const resetStates = () => {
      if (statusOfUploading.length === csvData.length) {
        setCreateOrdersStatus(statusOfUploading)
        setDate(new Date(date))
        setIsLoading(false)
        setCSVData([])
        uploadInputButtonRef.current.value = ''
      }
    }

    let orderAttributes = ['orderNumber', 'cname', 'cphone', 'cemail', 'address', 'deliveryDate', 'priority', 'specialInstructions', 'itemsDetail',]
    setIsLoading(true)
    let statusOfUploading: {}[] = []
    csvData.map(async (row) => {
      let orderobject: any = {}
      Object.values(row).map((cell: any, cellIndex: number) => {
        orderobject[orderAttributes[cellIndex]] = cell
      })
      orderobject['deliveryDate'] = new Date(new Date(orderobject[orderAttributes[5]]).setHours(0, 0, 0, 0))

      if (!orderobject['priority']) {
        orderobject['priority'] = "Medium"
      }
      try {
        let parse = order.safeParse(orderobject)
        if (parse.success) {
          createOrder(parse.data).then((result: any) => {
            if (result.isAdded) {
              statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: true })
            }
            else {
              if (result.err != null || result.err != undefined) {
                if (result.err == ErrorCode.AddressError) {
                  statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false, err: "Address not recognised by Google Maps" })
                }
              }
              else {
                statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false })
              }
            }
            if (statusOfUploading.length === csvData.length) {
              resetStates()
            }
          }).catch((result: any) => {
            statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false })
            if (statusOfUploading.length === csvData.length) {
              resetStates()
            }
          })
        }
        else {
          if (parse.error) {
            let errMsg = ''
            parse.error.issues.forEach((issue) => {
              errMsg = errMsg + issue.path[0] + ":" + issue.message + ", "
            })
            statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false, err: errMsg })
          }
          else {
            statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false, err: "Error" })
          }

          if (statusOfUploading.length === csvData.length) {
            resetStates()
          }
        }
      }
      catch (e) {
        statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false })
        if (statusOfUploading.length === csvData.length) {
          resetStates()
        }
      }
    }
    )

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
        skipEmptyLines: true,
      });
    }
  };


  return (
    <div className='flex flex-col'>
      <h1 className='text-center text-xl mb-8'>Upload CSV</h1>
      <DownloadButton></DownloadButton>
      <input ref={uploadInputButtonRef} className='mb-8' type="file" accept='.csv' onChange={handleFileUpload} />


      {csvData.length > 0 && (
        <div>
          <div className='max-h-96 overflow-y-scroll'>

            <h3>Parsed CSV Data:</h3>
            <table className="text-sm text-left w-full text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  {csvData[0] &&
                    Object.keys(csvData[0]).map((header) => <th scope="col" className="px-3 py-3 w-10" key={header}>{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, rowIndex) => (
                  <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600" key={rowIndex}>
                    {Object.values(row).map((cell: any, cellIndex) => (
                      <td className="px-3 py-4" key={cellIndex}>{cell}</td>
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
              <th scope="col" className="px-6 py-3">
                Error
              </th>

            </tr>
          </thead>
          <tbody>
            {createOrderStatus.map((orderStatus: any) => {
              return <>
                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">

                  <>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {orderStatus.orderNumber}
                    </th>
                    <td className="px-6 py-4">
                      {orderStatus.success == true ? "Success" : "Failed"}
                    </td>
                    <td className="px-6 py-4">
                      {orderStatus.success == true ? "No issue" : orderStatus.err}
                    </td>
                  </>


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

