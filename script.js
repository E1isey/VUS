function addTask() {
  const input = document.getElementById("newTaskInput");

  if (input.value.trim()) {
    const taskList = document.getElementById("taskList");
    const newItem = document.createElement("li");
    newItem.textContent = input.value.trim();
    taskList.appendChild(newItem);
    input.value = "";
  }
}
