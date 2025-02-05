// Retrieve bucket list from local storage or initialize an empty object
let bucketList = JSON.parse(localStorage.getItem("bucketList")) || {};
const todoInput = document.getElementById("todoInput");
const categorySelect = document.getElementById("categorySelect");
const todoSections = document.getElementById("todoSections");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
    addButton.addEventListener("click", addTask);
    todoInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });
    deleteButton.addEventListener("click", deleteAllTasks);
    displayTasks();
});

const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");
const selectedCategory = document.getElementById("selectedCategory");

// Toggle dropdown menu visibility
dropdownButton.addEventListener("click", () => {
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
});

// Function to select an option
function selectOption(value) {
    dropdownButton.textContent = value + " ▼"; // Update button text
    selectedCategory.value = value; // Store selected value for use
    dropdownMenu.style.display = "none"; // Close dropdown
}

// Close the dropdown when clicking outside
document.addEventListener("click", (event) => {
    if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = "none";
    }
});


function displayTasks() {
    todoSections.innerHTML = "";
    let totalCount = 0;

    Object.keys(bucketList).forEach(category => {
        if (bucketList[category].length > 0) {
            totalCount += bucketList[category].length;

            const section = document.createElement("div");
            section.classList.add("category-section");
            section.innerHTML = `<h3 class="category-title">${category}</h3>`;

            bucketList[category].forEach((item, index) => {
                const div = document.createElement("div");

                div.classList.add("todo-item");

                div.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" id="checkbox-${category}-${index}" 
                    ${item.completed ? "checked" : ""}>
                    <p class="${item.completed ? "completed" : ""}" 
                    onclick="editTask('${category}', ${index})">${item.text}</p>
                    <button onclick="deleteTask('${category}', ${index})">❌</button>
                `;

                div.querySelector(".todo-checkbox").addEventListener("change", () => toggleTask(category, index));
                section.appendChild(div);
            });

            todoSections.appendChild(section);
        }
    });

    todoCount.textContent = totalCount;
}

function editTask(category, index) {
    const existingText = bucketList[category][index].text;
    const inputElement = document.createElement("input");
    inputElement.value = existingText;
    
    inputElement.addEventListener("blur", function () {
        const updatedText = inputElement.value.trim();
        if (updatedText) {
            bucketList[category][index].text = updatedText;
            saveToLocalStorage();
        }
        displayTasks();
    });

    document.getElementById(`checkbox-${category}-${index}`).nextElementSibling.replaceWith(inputElement);
    inputElement.focus();
}

function toggleTask(category, index) {
    bucketList[category][index].completed = !bucketList[category][index].completed;
    saveToLocalStorage();
    displayTasks();
}

function deleteTask(category, index) {
    bucketList[category].splice(index, 1);
    if (bucketList[category].length === 0) {
        delete bucketList[category];
    }
    saveToLocalStorage();
    displayTasks();
}

function deleteAllTasks() {
    bucketList = {};
    saveToLocalStorage();
    displayTasks();
}

function saveToLocalStorage() {
    localStorage.setItem("bucketList", JSON.stringify(bucketList));
}
function addTask() {
    const newTask = todoInput.value.trim();
    const category = selectedCategory.value.trim(); // NEW CODE: Gets category from hidden input

    if (newTask !== "" && category !== "") {
        if (!bucketList[category]) {
            bucketList[category] = [];
        }
        bucketList[category].push({ text: newTask, completed: false });
        saveToLocalStorage();
        todoInput.value = "";
        displayTasks();
    } else {
        alert("Please enter a task and select a category.");
    }
}