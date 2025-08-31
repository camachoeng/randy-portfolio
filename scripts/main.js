import { saveTasks, loadTasks } from "/scripts/storage.js";

const addBtn = document.querySelector("#addBtn");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
let tasks = loadTasks();

renderTasks(tasks);

const gallery = document.getElementById('gallery');
const filterButtons = document.getElementById('filter-buttons');

const form = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

// Modal for large image
let modal, modalImg;

// Project Gallery Data
const projects = [
  {
    title: 'My Portfolio',
    category: 'Web',
    images: [
      './images/portfolio1.png',
      './images/portfolio2.png'
    ]
  },
  {
    title: 'ACIKY Yoga para Todos',
    category: 'Yoga',
    images: [
      './images/aciky1.png',
      './images/aciky2.png',
      './images/aciky3.png',
      './images/aciky4.png',
      './images/aciky5.png'
    ]
  },
  {
    title: 'To-Do List',
    category: 'Web',
    images: [
      './images/todo.png'
    ]
  }
];


function createModal() {
  modal = document.createElement('div');
  modal.className = 'img-modal';
  modal.style.display = 'none';
  modal.innerHTML = '<span class="img-modal-close">&times;</span><img class="img-modal-content"><div class="img-modal-caption"></div>';
  document.body.appendChild(modal);
  modalImg = modal.querySelector('.img-modal-content');
  const closeBtn = modal.querySelector('.img-modal-close');
  closeBtn.onclick = () => { modal.style.display = 'none'; };
  modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
}

function renderGallery(items) {
  if (!modal) createModal();
  gallery.innerHTML = '';
  items.forEach((project, idx) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';

    // Create slider container
    const slider = document.createElement('div');
    slider.className = 'image-slider';

    // Create image element
    const img = document.createElement('img');
    img.src = project.images[0];
    img.alt = project.title;
    slider.appendChild(img);
    // Show modal on image click
    img.style.cursor = 'pointer';
    img.onclick = () => {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.querySelector('.img-modal-caption').textContent = project.title;
      modal.style.display = 'flex';
    };
    // Create prev/next buttons if more than 1 image
    if (project.images.length > 1) {
      let current = 0;
      const prevBtn = document.createElement('button');
      prevBtn.textContent = '<';
      prevBtn.className = 'slider-btn prev-btn';
      const nextBtn = document.createElement('button');
      nextBtn.textContent = '>';
      nextBtn.className = 'slider-btn next-btn';

      prevBtn.onclick = () => {
        current = (current - 1 + project.images.length) % project.images.length;
        img.src = project.images[current];
      };
      nextBtn.onclick = () => {
        current = (current + 1) % project.images.length;
        img.src = project.images[current];
      };
      slider.appendChild(prevBtn);
      slider.appendChild(nextBtn);
    }

    card.appendChild(slider);
    const title = document.createElement('h3');
    title.textContent = project.title;
    card.appendChild(title);
    const cat = document.createElement('p');
    cat.textContent = project.category;
    card.appendChild(cat);
    gallery.appendChild(card);
  });
}

function renderFilters() {
  const categories = ['All', ...new Set(projects.map(p => p.category))];
  filterButtons.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      if (cat === 'All') {
        renderGallery(projects);
      } else {
        renderGallery(projects.filter(p => p.category === cat));
      }
    });
    filterButtons.appendChild(btn);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderFilters();
  renderGallery(projects);

  // Theme toggle logic with localStorage
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  let dark = false;
  // Restore theme from localStorage
  if (localStorage.getItem('theme') === 'dark') {
    dark = true;
    html.classList.add('dark-theme');
    if (themeToggle) themeToggle.textContent = '☀️ Light Mode';
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      dark = !dark;
      html.classList.toggle('dark-theme', dark);
      themeToggle.textContent = dark ? '☀️ Light Mode' : '🌙 Dark Mode';
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    });
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent actual form submission

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  console.log(name, email, message);
  if (!validateEmail(email)) {
    formMessage.style.color = "red";
    formMessage.textContent = "Please enter a valid email address.";
    return;
  }

  formMessage.style.color = "green";
  formMessage.textContent = "Message sent successfully (mock)!";

  form.reset(); // Clear the form
});

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// To-Do List Logic
addBtn.addEventListener("click", () => {
  if (taskInput.value.trim()) {
    tasks.push(taskInput.value.trim());
    saveTasks(tasks);
    renderTasks(tasks, taskList);
    taskInput.value = "";
  }
});

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
});

function renderTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const span = document.createElement("span");
    span.textContent = task;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTask(index);
    deleteBtn.className = "delete-btn";

    const iconDelete = document.createElement("i");
    iconDelete.className = "fas fa-trash-alt";
    deleteBtn.appendChild(iconDelete);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTask(index);
    editBtn.className = "edit-btn";

    const iconEdit = document.createElement("i");
    iconEdit.className = "fas fa-edit";
    editBtn.appendChild(iconEdit);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      li.classList.toggle("completed");
      saveTasks(tasks);
    });
    checkbox.className = "task-checkbox";

    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.appendChild(editBtn);
    li.appendChild(checkbox);
    taskList.appendChild(li);
  });
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTasks(tasks);
}

function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index]);
  if (newText !== null && newText.trim() !== "") {
    tasks[index] = newText.trim();
    saveTasks(tasks);
    renderTasks(tasks);
  }
}





