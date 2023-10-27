// Import your file

function DownloadButton() {
    return (<div className="flex items-center mb-10" >
        <div className="bg-blue-700 text-white py-2 px-4 mr-2 rounded hover:bg-blue-600">
            <a href="src/assets/sample_order_creation_file.csv" download="Sample">Download</a>
        </div>
        <p>Sample CSV file</p>
    </div>
    );
}

export default DownloadButton;
