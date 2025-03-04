import { useState } from "react";
import ParseCSVOrders from "../../parse/ParseCSVOrders";



const UploadOrdersCSV = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);

    };
    return (
        <div className="flex items-center">
            <button onClick={openPopup} className="bg-blue-700 text-white py-2 px-4 mr-2 rounded hover:bg-blue-600">
                Upload CSV or Excel
            </button>
            <p className="text-blue-900 font-bold"> for new Orders</p>
            <Popup isOpen={isPopupOpen} onClose={closePopup}>
                <ParseCSVOrders></ParseCSVOrders>
            </Popup>
        </div>
    );
}

const Popup = ({ isOpen, onClose, children }: any) => {
    return isOpen ? (
        <div className="fixed bg-white bg-opacity-60 top-0 left-0 right-0 w-full h-full flex items-center justify-center z-50">

            <div className="md:max-w-screen-xl w-3/4 bg-white p-4 rounded shadow-md relative">
                <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {children}
            </div>

        </div>
    ) : null;
};

export default UploadOrdersCSV
