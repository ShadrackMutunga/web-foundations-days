// Select DOM elements
const loadBtn = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

// Store loaded users in memory
let allUsers = [];

// Async function to fetch users
async function loadUsers() {
    // 1. Loading state
    loadBtn.disabled = true;
    statusText.textContent = "Loading users...";
    usersList.innerHTML = "";

    try {
        // 2. Fetch data
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        
        // 3. Check for HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // 4. Parse JSON and store in array
        allUsers = await response.json();
        
        // 5. Success state
        statusText.textContent = `Successfully loaded ${allUsers.length} users.`;
        renderUsers(allUsers);
        
    } catch (error) {
        // 6. Error state
        statusText.textContent = "Could not load users. Please try again.";
        console.error("Error loading users:", error);
    } finally {
        // 7. Always re-enable the button
        loadBtn.disabled = false;
    }
}

// Function to render an array of users
function renderUsers(users) {
    usersList.innerHTML = ""; // Clear current list
    
    // Handle empty filter results
    if (users.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No users match your filter.";
        usersList.appendChild(li);
        return;
    }

    // Render each user
    users.forEach(user => {
        const li = document.createElement("li");
        
        const nameEl = document.createElement("strong");
        nameEl.textContent = user.name;
        li.appendChild(nameEl);
        
        li.appendChild(document.createElement("br"));
        
        const emailEl = document.createElement("span");
        emailEl.textContent = `Email: ${user.email}`;
        li.appendChild(emailEl);
        
        li.appendChild(document.createElement("br"));
        
        const cityEl = document.createElement("span");
        cityEl.textContent = `City: ${user.address.city}`;
        li.appendChild(cityEl);
        
        li.appendChild(document.createElement("br"));
        
        const companyEl = document.createElement("span");
        companyEl.textContent = `Company: ${user.company.name}`;
        li.appendChild(companyEl);
        
        usersList.appendChild(li);
    });
}

// Event listener for the Load button
loadBtn.addEventListener("click", loadUsers);

// Event listener for the Filter input (filters locally, no new fetch)
filterInput.addEventListener("input", (event) => {
    const filterText = event.target.value.toLowerCase();
    
    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(filterText)
    );
    
    renderUsers(filteredUsers);
});