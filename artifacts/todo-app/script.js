const taskInput  = document.getElementById("taskInput");
const dateInput  = document.getElementById("dateInput");
const addBtn     = document.getElementById("addBtn");
const taskList   = document.getElementById("taskList");
const taskCount  = document.getElementById("taskCount");
const clearBtn   = document.getElementById("clearBtn");
const themeToggle = document.getElementById("themeToggle");
const themeIcon  = document.getElementById("themeIcon");

let tasks          = JSON.parse(localStorage.getItem("tasks"))  || [];
let currentFilter  = localStorage.getItem("filter")             || "all";
let selectedTaskId = null;
let darkMode       = localStorage.getItem("darkMode") === "true";

/* ── init ─────────────────────────────────────── */
applyTheme();
setActiveFilter(currentFilter);
displayTasks();

/* ── events ───────────────────────────────────── */
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") { e.preventDefault(); addTask(); }
});

document.addEventListener("keydown", function(e) {
    // Delete / Backspace removes selected task (not while typing in inputs)
    if ((e.key === "Delete" || e.key === "Backspace") &&
        document.activeElement !== taskInput &&
        document.activeElement.type !== "date" &&
        selectedTaskId !== null) {
        e.preventDefault();
        deleteTask(selectedTaskId);
    }
    // Escape clears selection
    if (e.key === "Escape") {
        selectedTaskId = null;
        document.querySelectorAll(".task.selected").forEach(el => el.classList.remove("selected"));
    }
});

clearBtn.addEventListener("click", clearCompleted);

themeToggle.addEventListener("click", toggleTheme);

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", function() {
        currentFilter = this.dataset.filter;
        localStorage.setItem("filter", currentFilter);
        setActiveFilter(currentFilter);
        selectedTaskId = null;
        displayTasks();
    });
});

/* ── theme ────────────────────────────────────── */
function toggleTheme() {
    darkMode = !darkMode;
    localStorage.setItem("darkMode", darkMode);
    applyTheme();
}

function applyTheme() {
    document.body.classList.toggle("dark", darkMode);
    themeIcon.className = darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

/* ── filter ───────────────────────────────────── */
function setActiveFilter(filter) {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.filter === filter);
    });
}

function filteredTasks() {
    const sorted = sortedTasks();
    if (currentFilter === "active")    return sorted.filter(t => !t.completed);
    if (currentFilter === "completed") return sorted.filter(t => t.completed);
    return sorted;
}

/* ── date helpers ─────────────────────────────── */
function todayStr() {
    return new Date().toISOString().split("T")[0];
}
function tomorrowStr() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
}

function urgencyLevel(task) {
    if (task.completed) return 99;
    if (!task.dueDate)  return 10;
    const t  = todayStr();
    const tm = tomorrowStr();
    if (task.dueDate < t)    return 0;
    if (task.dueDate === t)  return 1;
    if (task.dueDate === tm) return 2;
    return 3;
}

function dueBadge(task) {
    if (!task.dueDate) return "";
    const t  = todayStr();
    const tm = tomorrowStr();
    let cls, label;
    if (task.dueDate < t) {
        cls = "badge overdue-badge";  label = "🔥 Overdue";
    } else if (task.dueDate === t) {
        cls = "badge today-badge";    label = "⚡ Due today";
    } else if (task.dueDate === tm) {
        cls = "badge tomorrow-badge"; label = "🌅 Tomorrow";
    } else {
        const [, m, d] = task.dueDate.split("-");
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        cls = "badge upcoming-badge";
        label = `📅 ${months[+m - 1]} ${+d}`;
    }
    return `<span class="${cls}">${label}</span>`;
}

/* ── add ─────────────────────────────────────────*/
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
        id: Date.now(),
        text,
        dueDate: dateInput.value || null,
        completed: false
    });

    saveTasks();
    displayTasks();
    taskInput.value = "";
    dateInput.value = "";
    taskInput.focus();
}

/* ── sort ─────────────────────────────────────── */
function sortedTasks() {
    return [...tasks].sort((a, b) => {
        const diff = urgencyLevel(a) - urgencyLevel(b);
        if (diff !== 0) return diff;
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        return 0;
    });
}

/* ── display ─────────────────────────────────── */
function displayTasks() {
    taskList.innerHTML = "";
    const visible = filteredTasks();

    if (visible.length === 0) {
        const msg = currentFilter === "completed" ? "No completed tasks yet."
                  : currentFilter === "active"    ? "Nothing active — great job! 🎉"
                  : "No tasks yet — add one above!";
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-clipboard"></i>
                ${msg}
            </div>`;
    } else {
        visible.forEach(task => {
            const li  = document.createElement("li");
            const lvl = urgencyLevel(task);
            let urg   = "";
            if (!task.completed) {
                if (lvl === 0) urg = " overdue";
                else if (lvl === 1) urg = " due-today";
                else if (lvl === 2) urg = " due-tomorrow";
            }
            const sel = task.id === selectedTaskId ? " selected" : "";
            li.className = "task" + (task.completed ? " completed" : "") + urg + sel;
            li.dataset.id = task.id;

            li.innerHTML = `
                <div class="card-body">
                    <div class="left">
                        <input type="checkbox"
                            ${task.completed ? "checked" : ""}
                            onchange="toggleComplete(${task.id})">
                        <span>${task.text}</span>
                    </div>
                    <button class="delete-btn" onclick="deleteTask(${task.id})" title="Delete (or select + ⌫)">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
                ${dueBadge(task) ? `<div class="badge-row">${dueBadge(task)}</div>` : ""}
            `;

            // Click card body (not checkbox / delete) to select
            li.addEventListener("click", function(e) {
                if (e.target.type === "checkbox" || e.target.closest(".delete-btn")) return;
                selectedTaskId = (selectedTaskId === task.id) ? null : task.id;
                displayTasks();
            });

            taskList.appendChild(li);
        });
    }

    updateMeta();
}

/* ── meta ─────────────────────────────────────── */
function updateMeta() {
    const total     = tasks.length;
    const done      = tasks.filter(t => t.completed).length;
    const remaining = total - done;
    taskCount.textContent = total === 0 ? "" : `${remaining} of ${total} remaining`;
    clearBtn.disabled = done === 0;
}

/* ── mutations ───────────────────────────────── */
function toggleComplete(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks();
    displayTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    if (selectedTaskId === id) selectedTaskId = null;
    saveTasks();
    displayTasks();
}

function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    displayTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
