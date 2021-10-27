let tasks = [
  {
    title: "Complete online JavaScript course",
    completed: true,
    id: "1",
  },
  {
    title: "Jog around the park 3x",
    completed: false,
    id: "2",
  },

  {
    title: "10 minutes meditation",
    completed: false,
    id: "3",
  },

  {
    title: "Read for 1 hour",
    completed: false,
    id: "4",
  },

  {
    title: "Pick up groceries",
    completed: false,
    id: "5",
  },

  {
    title: "Complete Todo App on Frontend Mentor",
    completed: false,
    id: "6",
  },
];
const form = document.getElementById("form");
const input = document.getElementById("input");
const checkbox = document.getElementById("checkbox");
const itemsLeft = document.getElementById("itemsLeft");
const listContainer = document.querySelector(".listContainer");
const clearCompleted = document.getElementById("clearCompleted");
const allTasks = document.getElementById("allTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");
const toggleTasks = document.querySelectorAll(".toggleTasks");
const themeSvg = document.querySelectorAll(".theme__svg");

themeSvg.forEach((item) => {
  item.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.querySelector(".dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
});
toggleTasks.forEach((item) => {
  item.addEventListener("click", () => {
    toggleTasks.forEach((toggleItem) =>
      toggleItem.classList.remove("info__item_active")
    );
    item.classList.add("info__item_active");
  });
});

allTasks.addEventListener("click", () => {
  renderAllTasks(JSON.parse(localStorage.getItem("tasks")));
});
activeTasks.addEventListener("click", () => {
  renderAllTasks(
    JSON.parse(localStorage.getItem("tasks")).filter((item) => !item.completed)
  );
});
completedTasks.addEventListener("click", () => {
  renderAllTasks(
    JSON.parse(localStorage.getItem("tasks")).filter((item) => item.completed)
  );
});
listContainer.addEventListener("click", ({ target }) => {
  if (target.classList.contains("checkbox")) {
    const parent = target.closest("[data-task-id]");
    const textItem = parent.querySelector(".textItem");
    textItem.classList.toggle("completed");
    const id = parent.getAttribute("data-task-id");

    changeTasksArray(id);
  }
  if (target.classList.contains("delete")) {
    const parent = target.closest("[data-task-id]");
    const id = parent.getAttribute("data-task-id");
    parent.remove();
    removeTaskArray(id);
  }
});
clearCompleted.addEventListener("click", () => {
  let newTasks = [];
  JSON.parse(localStorage.getItem("tasks")).forEach((item) => {
    if (!item.completed) {
      newTasks.push(item);
    }
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    renderAllTasks(JSON.parse(localStorage.getItem("tasks")));
    changeItemsLeft();
  });
});
function removeTaskArray(id) {
  let newTasks = [];
  JSON.parse(localStorage.getItem("tasks")).forEach((item) => {
    if (item.id !== id) {
      newTasks.push(item);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(newTasks));
  changeItemsLeft();
}
function changeTasksArray(id) {
  const newTasks = [];
  JSON.parse(localStorage.getItem("tasks")).forEach((item) => {
    if (item.id === id) {
      item.completed = !item.completed;
    }
    newTasks.push(item);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  });
  changeItemsLeft();
}
function renderAllTasks(tasks) {
  const fragment = document.createDocumentFragment();
  tasks.forEach((item) => {
    const li = listItemTemplate(item);
    fragment.appendChild(li);
  });
  listContainer.textContent = "";
  listContainer.appendChild(fragment);
  changeItemsLeft();
}
function listItemTemplate({ id, title, completed }) {
  const li = document.createElement("li");
  li.classList.add("listItem");
  li.classList.add("li-item");
  li.draggable = true;
  const label = document.createElement("label");
  label.classList.add("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  const span = document.createElement("span");
  span.classList.add("checkbox");
  const text = document.createElement("span");
  text.classList.add("textItem");
  text.textContent = title;
  const img = document.createElement("img");
  img.src = "./images/close.svg";
  img.classList.add("delete");
  if (completed) {
    checkbox.checked = true;
    text.classList.add("completed");
  }
  li.setAttribute("data-task-id", id);
  label.appendChild(checkbox);
  label.appendChild(span);
  li.appendChild(label);
  li.appendChild(text);
  li.appendChild(img);
  return li;
}
function changeItemsLeft() {
  let count = 0;
  JSON.parse(localStorage.getItem("tasks")).forEach((item) => {
    if (!item.completed) {
      count++;
    }
  });
  itemsLeft.textContent = count;
}
function startApp(tasks) {
  if (localStorage.getItem("tasks") === null) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log(localStorage.getItem("tasks"));
  }
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.remove("dark");
    console.log("light");
  } else {
    document.body.classList.add("dark");
    console.log("dark");
  }
  renderAllTasks(JSON.parse(localStorage.getItem("tasks")));
}
startApp(tasks);
// renderAllTasks(tasks);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let id = (Math.random() * 10000).toFixed();
  let val;
  if (!input.value) {
    return;
  }
  if (checkbox.checked) {
    val = true;
  } else {
    val = false;
  }

  const newTask = {
    title: input.value,
    completed: val,
    id: id,
  };

  renderNewTask(newTask);
});
function renderNewTask(newTask) {
  const newTasks = JSON.parse(localStorage.getItem("tasks"));
  newTasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(newTasks));
  const newListItem = listItemTemplate(newTask);
  listContainer.insertAdjacentElement("beforeend", newListItem);
  form.reset();
  changeItemsLeft();
}

let list = document.querySelector(".listContainer");
let draggedItem;

function isLiItem(event) {
  return event.target && event.target.classList.contains("li-item");
}

function onDragStart(event) {
  if (isLiItem(event)) {
    event.target.classList.add("on-drag-start");
    draggedItem = event.target;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", event.target.innerHTML);
  }
}

function onDragEnter(event) {
  if (isLiItem(event)) {
    event.target.classList.add("on-drag-enter");
  }
}

function onDragLeave(event) {
  if (isLiItem(event)) {
    event.stopPropagation();
    event.target.classList.remove("on-drag-enter");
  }
}

function onDragOver(event) {
  if (isLiItem(event)) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }
}

function onDragDrop(event) {
  if (isLiItem(event)) {
    // draggedItem.innerHTML = event.target.innerHTML;
    // event.target.innerHTML = event.dataTransfer.getData('text/html');
    list.insertBefore(draggedItem, event.target);
    draggedItem.classList.remove("on-drag-start");
    event.target.classList.remove("on-drag-start");
  }
  savePosition();
}

function onDragEnd(event) {
  let allItems = list.querySelectorAll(".li-item");
  allItems.forEach((item) => item.classList.remove("on-drag-enter"));
  event.target.classList.remove("on-drag-start");
}

list.addEventListener("dragstart", onDragStart);
list.addEventListener("dragover", onDragOver);
list.addEventListener("dragenter", onDragEnter);
list.addEventListener("dragleave", onDragLeave);
list.addEventListener("drop", onDragDrop);
list.addEventListener("dragend", onDragEnd);

function savePosition() {
  let array = document.querySelectorAll("[data-task-id]");
  if (!array.length) return;
  let arrayId = [];
  array.forEach((item) => {
    const id = item.getAttribute("data-task-id");
    arrayId.push(id);
  });

  let oldTasks = JSON.parse(localStorage.getItem("tasks"));
  let newTasks = [];
  arrayId.forEach((id) => {
    oldTasks.forEach((item) => {
      if (item.id === id) {
        newTasks.push(item);
      }
    });
  });
  localStorage.setItem("tasks", JSON.stringify(newTasks));
}
