// Import your file

function DownloadButtonExcel() {
    return (<div className="flex items-center mb-8" >
        <div className="bg-blue-700 text-white py-1 px-3 mr-2 rounded hover:bg-blue-600">
            <a href="src/assets/sample.xlsx" download="Sample">Download</a>
        </div>
        <p>Sample Excel file</p>
    </div>
    );
}

export default DownloadButtonExcel;
