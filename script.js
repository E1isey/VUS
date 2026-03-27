const STORAGE_KEY = "todo-list-tasks";

const state = {
  tasks: [],
  editingTaskId: null,
};

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state.tasks = raw ? JSON.parse(raw) : [];
  } catch (error) {
    state.tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

function formatStatus(task) {
  return task.completed ? "Статус: выполнено" : "Статус: в работе";
}

function updateStats() {
  const totalTasks = document.getElementById("totalTasks");
  const completedTasks = document.getElementById("completedTasks");
  const emptyState = document.getElementById("emptyState");

  totalTasks.textContent = String(state.tasks.length);
  completedTasks.textContent = String(state.tasks.filter((task) => task.completed).length);
  emptyState.classList.toggle("hidden", state.tasks.length > 0);
}

function resetForm() {
  state.editingTaskId = null;
  document.getElementById("taskForm").reset();
  document.getElementById("submitButton").textContent = "Добавить задачу";
  document.getElementById("formHint").textContent = "Нажмите Enter или кнопку, чтобы добавить задачу.";
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  state.tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const statusButton = document.createElement("button");
    statusButton.type = "button";
    statusButton.className = "action-button complete";
    statusButton.textContent = task.completed ? "Вернуть" : "Готово";
    statusButton.addEventListener("click", () => toggleTask(task.id));

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const meta = document.createElement("span");
    meta.className = "task-meta";
    meta.textContent = formatStatus(task);

    content.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "action-button";
    editButton.textContent = "Редактировать";
    editButton.addEventListener("click", () => startEditing(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "action-button delete";
    deleteButton.textContent = "Удалить";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    actions.append(editButton, deleteButton);
    item.append(statusButton, content, actions);
    taskList.appendChild(item);
  });

  updateStats();
}

function addTask() {
  const input = document.getElementById("newTaskInput");
  const title = input.value.trim();

  if (!title) {
    input.focus();
    return;
  }

  if (state.editingTaskId) {
    state.tasks = state.tasks.map((task) =>
      task.id === state.editingTaskId ? { ...task, title } : task
    );
  } else {
    state.tasks.unshift({
      id: createId(),
      title,
      completed: false,
    });
  }

  saveTasks();
  renderTasks();
  resetForm();
}

function startEditing(taskId) {
  const task = state.tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  state.editingTaskId = taskId;
  document.getElementById("newTaskInput").value = task.title;
  document.getElementById("submitButton").textContent = "Сохранить";
  document.getElementById("formHint").textContent = "Режим редактирования: измените текст и нажмите сохранить.";
  document.getElementById("newTaskInput").focus();
}

function deleteTask(taskId) {
  state.tasks = state.tasks.filter((task) => task.id !== taskId);

  if (state.editingTaskId === taskId) {
    resetForm();
  }

  saveTasks();
  renderTasks();
}

function toggleTask(taskId) {
  state.tasks = state.tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );

  saveTasks();
  renderTasks();
}

function handleSubmit(event) {
  event.preventDefault();
  addTask();
}

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  document.getElementById("taskForm").addEventListener("submit", handleSubmit);
  renderTasks();
});
