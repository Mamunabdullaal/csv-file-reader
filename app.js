let csvData = [];

document.getElementById('csvFileInput').addEventListener('change', uploadCSV);

// Function to read and parse the uploaded CSV file
function uploadCSV(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result;
        parseCSV(text);
    };
    reader.readAsText(file);
}

// Function to parse CSV data
function parseCSV(text) {
    const rows = text.split('\n');
    const headers = rows[0].split(',');

    // Parse rows and store as objects
    csvData = rows.slice(1).map(row => {
        const values = row.split(',');
        let agentData = {};
        headers.forEach((header, index) => {
            agentData[header.trim()] = values[index].trim();
        });
        return agentData;
    });

    console.log("CSV data parsed:", csvData);
}

// Function to search for an agent by ID and display the information
function searchAgent() {
    const agentId = document.getElementById('agentIdInput').value.trim();
    const resultTable = document.getElementById('resultTable');
    const resultBody = document.getElementById('resultBody');

    // Clear previous results
    resultBody.innerHTML = '';

    // Find the agent by ID
    const agent = csvData.find(item => item['agent_id'] === agentId);

    if (agent) {
        const readyTime = parseFloat(agent['ready_time']);
        const requiredTime = 7.5; // 7 hours and 30 minutes = 7.5 hours
        const status = readyTime >= requiredTime 
            ? 'Complete' 
            : `Needs ${requiredTime - readyTime} more hours`;

        // Append the result to the table
        resultBody.innerHTML = `
            <tr>
                <td>${agent['agent_id']}</td>
                <td>${agent['login_time']}</td>
                <td>${agent['logout_time']}</td>
                <td>${agent['total_break']}</td>
                <td>${agent['ready_time']}</td>
                <td>${status}</td>
            </tr>
        `;

        // Show the table
        resultTable.style.display = 'table';
    } else {
        alert('Agent ID not found.');
    }
}
