// Manage tasks
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const timerDisplay = document.getElementById('timer-display');

let tasks = [];
let timer = null;
let currentTaskId = null;
let elapsedTime = 0;

// Add a task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('task-title').value;
  const desc = document.getElementById('task-desc').value;
  const priority = document.getElementById('task-priority').value;
  const startTime = document.getElementById('task-start-time').value;
  const duration = parseInt(document.getElementById('task-duration').value);
  const day = document.getElementById('task-day').value;

  const task = {
    id: Date.now(),
    title,
    desc,
    priority,
    startTime,
    duration,
    day,
    actualTime: 0
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskForm.reset();
});

// Save tasks to local storage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
  const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = storedTa  sks;
  renderTasks();
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task', task.priority);
    taskDiv.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.desc}</p>
      <p>Start: ${task.startTime}, Duration: ${task.duration} mins</p>
      <p>Day: ${task.day}</p>
      <button onclick="startTimer(${task.id})">Start</button>
      <button onclick="editTask(${task.id})">Edit</button>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    taskList.appendChild(taskDiv);
  });
}

// Edit a task
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-desc').value = task.desc;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-start-time').value = task.startTime;
    document.getElementById('task-duration').value = task.duration;
    document.getElementById('task-day').value = task.day;

    deleteTask(id);
  }
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

// Start the timer
function startTimer(id) {
  if (timer) clearInterval(timer);
  currentTaskId = id;
  elapsedTime = 0;
  timer = setInterval(() => {
    elapsedTime++;
    timerDisplay.textContent = new Date(elapsedTime * 1000).toISOString().substr(11, 8);
  }, 1000);
}

// Pause the timer
document.getElementById('pause-timer').addEventListener('click', () => {
  if (timer) clearInterval(timer);
});

// Stop the timer
document.getElementById('stop-timer').addEventListener('click', () => {
  if (timer) clearInterval(timer);
  const task = tasks.find((t) => t.id === currentTaskId);
  if (task) {
    task.actualTime += elapsedTime;
    saveTasks();
    renderTasks();
  }
  elapsedTime = 0;
  timerDisplay.textContent = '00:00:00';
});

// Load tasks on page load
loadTasks();
