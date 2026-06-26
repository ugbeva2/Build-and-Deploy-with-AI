const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearBtn = document.getElementById("clearBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

displayTasks();

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

clearBtn.addEventListener("click", clearCompleted);

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") return;

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    displayTasks();

    taskInput.value = "";
    taskInput.focus();
}

function displayTasks() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-clipboard"></i>
                No tasks yet. Add one above!
            </div>
        `;
    } else {
        tasks.forEach(task => {
            const li = document.createElement("li");
            li.className = "task" + (task.completed ? " completed" : "");

            li.innerHTML = `
                <div class="left">
                    <input type="checkbox"
                        ${task.completed ? "checked" : ""}
                        onchange="toggleComplete(${task.id})">
                    <span>${task.text}</span>
                </div>
                <button class="delete-btn" onclick="deleteTask(${task.id})" title="Delete task">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;

            taskList.appendChild(li);
        });
    }

    updateMeta();
}

function updateMeta() {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const remaining = total - done;

    if (total === 0) {
        taskCount.textContent = "";
    } else {
        taskCount.textContent = `${remaining} of ${total} remaining`;
    }

    clearBtn.disabled = done === 0;
}

function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) task.completed = !task.completed;
        return task;
    });
    saveTasks();
    displayTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    displayTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    displayTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
