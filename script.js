const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
let ID = 0;





// Увед разрешение алуға арналған код
document.getElementById("taskInput").addEventListener("click", function() {
    if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Разрешение на уведомления получено.");
            } else {
                console.log("Разрешение на уведомления отклонено.");
            }
        });
    }
});



// Сақталған задачаларды шығару
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Жаңа задача қосу
function addTask() {
    
    const taskText = taskInput.value.trim();
    const taskTime = parseInt(prompt("Через сколько минут напомнить?"));
    if (taskText === "") {
        alert("Введите задачу!");
        return;
    }

    ID++;
    const task = {
        text: taskText,
        time: taskTime,
        completed: false,
        id: ID,
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    setNotification(task);
    taskInput.value = "";
}

// задачаларды көрсету
function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach(task => {
        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleComplete(${task.id})">
            <span class="task-text">${task.text}</span>
            <div class="action-buttons">
                <button class="edit-btn" onclick="editTask(${task.id})">Редактировать</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Удалить</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

// задачаларды сақтау
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Задачаны орындау белгісі
function toggleComplete(taskId) {
    
    const task = tasks.find(t => t.id === taskId);

  
    task.completed = !task.completed;

    saveTasks();
    renderTasks();
}


// Өшіру
function deleteTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    tasks.splice(taskIndex, 1);
    saveTasks();
    renderTasks();
}

// Өзгерту
function editTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    const newText = prompt("Редактировать задачу:", tasks[taskIndex].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[taskIndex].text = newText;
        saveTasks();
        renderTasks();
    }
}

// Увед қосу
function setNotification(task) {
    const taskTime = task.time * 60 * 1000; // милиссикунттармен 
    setTimeout(() => {
        sendNotification(task.text);
    }, taskTime);
}

// Увед жіберу
function sendNotification(taskText) {
    if (Notification.permission === "granted") {
        new Notification("Напоминание о задаче", {
            body: taskText,
            icon: "icon.png", 
        });
    } else {
        alert("Разрешите уведомления для этого сайта.");
    }
}

// Запрос увед тастауға
// if (Notification.permission !== "granted") {
//     Notification.requestPermission();
// }

// страница қосылғаннан кейінгі задачаларды шығару үшін
renderTasks();
