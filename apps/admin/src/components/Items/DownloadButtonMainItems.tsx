// Import your file

function DownloadButtonMainItems() {
    return (<div className="flex items-center mb-8" >
        <div className="bg-blue-700 text-white py-1 px-3 mr-2 rounded hover:bg-blue-600">
            <a href="src/assets/sample_main_items_creation_file.csv" type="text/csv" download="Sample.csv">Download</a>
        </div>
        <p>Sample CSV file</p>
    </div>
    );
}

export default DownloadButtonMainItems;
