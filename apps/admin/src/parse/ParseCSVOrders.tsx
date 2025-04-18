import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import DownloadButton from '../components/Order/DownloadButton';
import { ErrorCode, order } from 'types/src/index';
import { createOrder, } from '../services/ApiService';
import { useRecoilState } from 'recoil';
import { ordersSearchDate } from '../store/atoms/orderAtom';
import { convertToUTC } from '../utils/UTCdate';
import * as XLSX from 'xlsx';
import DownloadButtonExcel from '../components/Order/DownloadButtonExcel';


const ParseCSVOrders = () => {
  const [csvData, setCSVData] = useState<any[]>([]);
  const [createOrderStatus, setCreateOrdersStatus] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const uploadInputButtonRef = useRef<any>(null);
  const [date, setDate] = useRecoilState(ordersSearchDate)


  const isDateFormatValid = (dateString: string) => {
    const pattern: RegExp = /^(0?[1-9]|1[0-2])\/\d{2}\/\d{4}$/;
    return pattern.test(dateString);
  }

  const handleSubmitCSV = async () => {
    const resetStates = () => {
      if (statusOfUploading.length === csvData.length) {
        setCreateOrdersStatus(statusOfUploading)
        setDate(new Date(date))
        setIsLoading(false)
        setCSVData([])
        uploadInputButtonRef.current.value = ''
      }
    }

    let orderAttributes = ['orderNumber', 'cname', 'cphone', 'cemail', 'address', 'deliveryDate', 'priority', 'specialInstructions', 'itemsDetail','paymentStatus']
    setIsLoading(true)
    let statusOfUploading: {}[] = []
    for (const row of csvData){
      let orderobject: any = {}
      Object.values(row).map((cell: any, cellIndex: number) => {
        orderobject[orderAttributes[cellIndex]] = cell
      })
      if (!isDateFormatValid(orderobject[orderAttributes[5]])) {
        statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false, err: "Date format must be MM/DD/YYYY" })
        if (statusOfUploading.length === csvData.length) {
          resetStates()
        }
        return
      }
      let newDate = convertToUTC(new Date(orderobject[orderAttributes[5]]))
      orderobject['deliveryDate'] = newDate

      if (!orderobject['priority']) {
        orderobject['priority'] = "Medium"
      }
      try{
        let parse = order.safeParse(orderobject)
        if (parse.success) {
          try{
            const result:any = await  createOrder(parse.data)
            if (result.isAdded) {
              statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: true })
            }
            else {
              if (result.err != null || result.err != undefined) {
                if (result.err == ErrorCode.AddressError) {
                  statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false, err: "Address not recognised by Google Maps" })
                }
                if (result.err == ErrorCode.OrderLimitIncrease) {
                  statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false, err: "Maximum Limit Reached. Conatct info@easeyourtasks.com"})
                }
              }
              else {
                statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false })
              }
            }
            if (statusOfUploading.length === csvData.length) {
              resetStates()
            }
          }catch(result:any){
            statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false })
            if (statusOfUploading.length === csvData.length) {
              resetStates()
            }
          }
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

    csvData.forEach((row) => {
      let orderobject: any = {}
      Object.values(row).map((cell: any, cellIndex: number) => {
        orderobject[orderAttributes[cellIndex]] = cell
      })
      if (!isDateFormatValid(orderobject[orderAttributes[5]])) {
        statusOfUploading.push({ orderNumber: orderobject['orderNumber'], success: false, err: "Date format must be MM/DD/YYYY" })
        if (statusOfUploading.length === csvData.length) {
          resetStates()
        }
        return
      }
      let newDate = convertToUTC(new Date(orderobject[orderAttributes[5]]))
      orderobject['deliveryDate'] = newDate

      if (!orderobject['priority']) {
        orderobject['priority'] = "Medium"
      }
      try {

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

   // common file to handle csv directly anf converted by Excel
    const handleCSV = function(csvFile:any ){
      Papa.parse(csvFile, {
        complete: (result) => {
          setCSVData(result.data);
        },
        header: true, // Set this to true if the CSV file has headers
        skipEmptyLines: true,
      });
    }


    if (file) {
      if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target!.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const csvFile = XLSX.utils.sheet_to_csv(worksheet);
          handleCSV(csvFile)
        };
      reader.readAsArrayBuffer(file!); //    
      }
      else{
        handleCSV(file)
      }
      
    } 
  };


  return (
    <div className='flex flex-col'>
      <h1 className='text-center text-xl mb-8'>Upload CSV or Excel File</h1>

      <input ref={uploadInputButtonRef} className='mb-8' type="file" accept='.csv, .xls, .xlsx' onChange={handleFileUpload} />
      
      <DownloadButtonExcel></DownloadButtonExcel>
      
      <DownloadButton></DownloadButton>
    
      {csvData.length > 0 && (
        <div>
          <div className='max-h-96 overflow-y-scroll'>

            <h3>Parsed Data:</h3>
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

