// Check for Tauri API
if (!window.__TAURI__ || !window.__TAURI__.tauri || !window.__TAURI__.tauri.invoke) {
    console.error("Tauri API not found. The app might not be running in a Tauri environment.");
    alert("Critical error: Tauri API not available. Functionality will be limited.");
    // Optionally, disable UI elements if the API is missing
    // document.getElementById('compare_button').disabled = true;
}

// Access Tauri API
const { invoke } = window.__TAURI__.tauri;

// DOM Element References
const file1Input = document.getElementById('file1_input');
const file2Input = document.getElementById('file2_input');
const compareButton = document.getElementById('compare_button');
const diffOutput1 = document.getElementById('diff_output1'); // For later use
const diffOutput2 = document.getElementById('diff_output2'); // For later use

// File Storage
let file1 = null;
let file2 = null;

// Event Listener for File Input 1
file1Input.addEventListener('change', (event) => {
    if (event.target.files[0]) {
        file1 = event.target.files[0];
        console.log("File 1 selected:", file1.name);
    } else {
        file1 = null;
        console.log("File 1 deselected.");
    }
});

// Event Listener for File Input 2
file2Input.addEventListener('change', (event) => {
    if (event.target.files[0]) {
        file2 = event.target.files[0];
        console.log("File 2 selected:", file2.name);
    } else {
        file2 = null;
        console.log("File 2 deselected.");
    }
});

// Helper function to read file as text
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    });
}

// Event Listener for Compare Button
compareButton.addEventListener('click', async () => {
    if (!file1 || !file2) {
        alert("Please select two files to compare.");
        return;
    }

    console.log("Comparing files:", file1.name, "and", file2.name);

    try {
        const [content1, content2] = await Promise.all([
            readFileAsText(file1),
            readFileAsText(file2)
        ]);

        // Log the contents and the fact that we'd call the backend
        console.log("File 1 content (first 100 chars):", content1.substring(0, 100) + "...");
        console.log("File 2 content (first 100 chars):", content2.substring(0, 100) + "...");
        
        // Invoke the backend command
        const diffResult = await invoke('compare_files_content', { content1, content2 });
        
        // Clear previous results
        diff_output1.innerHTML = '';
        diff_output2.innerHTML = '';

        if (!diffResult || diffResult.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No differences found or comparison error.';
            diff_output1.appendChild(p.cloneNode(true));
            diff_output2.appendChild(p);
            return;
        }

        if (diffResult.length === 1 && (diffResult[0].includes("Files are identical") || diffResult[0].includes("Files are different"))) {
            const p = document.createElement('p');
            // Remove the prefix for display if it's one of these general messages
            if (diffResult[0].startsWith('  ') || diffResult[0].startsWith('~ ')) {
                p.textContent = diffResult[0].substring(2); 
            } else {
                p.textContent = diffResult[0];
            }
            diff_output1.appendChild(p.cloneNode(true));
            diff_output2.appendChild(p);
            return;
        }
        
        diffResult.forEach(lineText => {
            const lineDiv1 = document.createElement('div');
            lineDiv1.classList.add('line');
            const lineDiv2 = document.createElement('div');
            lineDiv2.classList.add('line');

            if (lineText.startsWith('+ ')) {
                lineDiv1.classList.add('line-placeholder');
                // lineDiv1.textContent = ' '; // Optional: non-breaking space
                
                lineDiv2.textContent = lineText.substring(2);
                lineDiv2.classList.add('line-added');
            } else if (lineText.startsWith('- ')) {
                lineDiv1.textContent = lineText.substring(2);
                lineDiv1.classList.add('line-removed');

                lineDiv2.classList.add('line-placeholder');
                // lineDiv2.textContent = ' '; // Optional: non-breaking space
            } else if (lineText.startsWith('  ')) { // Common line
                lineDiv1.textContent = lineText.substring(2);
                lineDiv2.textContent = lineText.substring(2);
            } else { // Fallback for unexpected lines (e.g., the "~" message if not caught by the specific check above)
                lineDiv1.textContent = lineText;
                lineDiv2.textContent = lineText;
            }

            diff_output1.appendChild(lineDiv1);
            diff_output2.appendChild(lineDiv2);
        });

    } catch (error) {
        // Display error in UI panes
        console.error("Error during comparison:", error);
        diff_output1.innerHTML = ''; // Clear panes
        diff_output2.innerHTML = '';
        const errorP = document.createElement('p');
        errorP.style.color = 'red';
        errorP.textContent = `An error occurred: ${error.message || String(error)}`;
        diff_output1.appendChild(errorP.cloneNode(true));
        diff_output2.appendChild(errorP);
    }
});

console.log("main.js loaded and event listeners attached.");
