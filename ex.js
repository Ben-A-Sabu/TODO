const homebtn = document.querySelector('#homebtn');
///////////////////////////////////////////////////////////////////////
const Inputbox = document.querySelector('#taskEnter');
const Taskdate = document.querySelector('#TaskDate');
const Addbtn = document.querySelector('#Addbtn');
const Clearbtn = document.querySelector('#Clearbtn');
///////////////////////////////////////////////////////////////////////
const tasks = document.querySelector('.tasks');
///////////////////////// current task elements ///////////////////////////////////////////
const today = document.querySelector('#today');
//////////////////// upcoming task element /////////////////////////////////////////////////
const upcoming = document.querySelector('#upcoming');
///////////////////////completed task elements ///////////////////////////////////////////
const completedTask = document.querySelector('#completed');
////////////////////////missed task elements ////////////////////////////////////////////
const Missed = document.querySelector('#Missed');
/////////////////////// footer btn elements /////////////////////////////////////////////
const viewMisedTasks = document.querySelector('#view_miss_task');
const viewCompletedTasks = document.querySelector('#view_comp_task');
const viewCurrentTasks = document.querySelector('#view_current_task');
///////////// global variable ///////////////////////////////////////////////////////////
var currentdate;
var month;
var id = 0;
var lastId = 0;
/// event listeners used in the code
window.addEventListener('load', function () {

    homebtn.addEventListener('click', function () {
        window.location.href = "ex.html";
    });
    Clearbtn.addEventListener('click', function () {
        Inputbox.value = '';
        Taskdate.value = '';
    });
    viewMisedTasks.addEventListener('click', function () {
        veiw_and_Hide_Area(today, upcoming, completedTask, Missed);
    });
    viewCompletedTasks.addEventListener('click', function () {
        veiw_and_Hide_Area(today, upcoming, Missed, completedTask);
    });
    viewCurrentTasks.addEventListener('click', function () {
        veiw_and_Hide_Area(Missed, upcoming, completedTask, today);
    });

    id = JSON.parse(localStorage.getItem('lastId')) || 0;

    displayFromLocalStorage();
    findcurrentdate();
    updateNotification();

});

// function to displa current date
function findcurrentdate() {
    if (new Date().getMonth() + 1 < 10) {
        currentdate = new Date().getFullYear() + '-' + "0" + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    } else {
        currentdate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    }
}
/// function to add task on to screen
function addTask(task, date, where_to_add) {
    let taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.innerHTML = `<div class="todo">${task}</div>
        <div>${date}</div><button class="action" id="deletebtn">delete</button><button class="action" id="editbtn">edit</button><button class="action" id="cmpltbtn">Done</button>`;
    taskElement.setAttribute('id', id);
    where_to_add.appendChild(taskElement);
    AddToLocalStorage(task, date, id);
    updateid();

}
// function to provide unique id for each task
function updateid() {
    id++;
    lastId = id;
    localStorage.setItem('lastId', JSON.stringify(lastId));

}
/// function to add task
Addbtn.addEventListener('click', function () {
    let task = Inputbox.value;
    let date = Taskdate.value;

    if (task === '' || date === '') {
        alert('Please enter a task and date');
    } else if (currentdate === date) {
        addTask(task, date, today);

    } else if (new Date().getTime() < new Date(date).getTime()) {
        addTask(task, date, upcoming);
    } else {
        alert('Please enter a valid date');
    }
    Inputbox.value = '';
    Taskdate.value = '';

});
/// action that can be performed (ie, edit, delete, complete)
tasks.addEventListener('click', function (e) {
    if (e.target.id === 'deletebtn') {
        RemoveFromLocalStorage(e.target.parentElement.id);
        displayFromLocalStorage();
        updateNotification();
    }
    if (e.target.id === 'editbtn') {
        let editTask = prompt('Edit Task');
        let editDate = prompt('Edit Date' + '(' + 'YYYY-MM-DD' + ')');
        var value = validate_edited_task(editTask, editDate);
        if (value == true) {
            editFromLocalStorage(editTask, editDate, e.target.parentElement.id);
            location.reload();
        }
    }
    if (e.target.id === 'cmpltbtn') {
        updateStatus(e.target.parentElement.id, 'completed');
        location.reload();
    }
    if (e.target.id == 'addbackbtn') {
        updateStatus(e.target.parentElement.id, 'notdone');
        location.reload();
    }

});
//// add to local storage function 
function AddToLocalStorage(task, date, id) {
    let taskObj = {
        task: task,
        date: date,
        id: id,
        taskstatus: 'notdone'
    };
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(taskObj);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
// function to create task element from local storage
function createtasktoDisplay(taskname, date, task_id, where_to_add) {
    let taskElement = document.createElement('div');
    taskElement.classList.add('task');
    if (where_to_add == completedTask) {
        taskElement.innerHTML = `<div class="todo" >${taskname}</div>
        <div>${date}</div><button class="action" id="deletebtn">delete</button><button class="action" id="editbtn">edit</button><button class="action" id="addbackbtn">Add Back</button>`;
    }
    else {
        taskElement.innerHTML = `<div class="todo" >${taskname}</div>
    <div>${date}</div><button class="action" id="deletebtn">delete</button><button class="action" id="editbtn">edit</button><button class="action" id="cmpltbtn">Done</button>`;
    }
    taskElement.setAttribute('id', task_id);
    where_to_add.appendChild(taskElement);
}
//display from  local storage function
function displayFromLocalStorage() {

    findcurrentdate();
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(function (task) {

        if (new Date().getTime() < new Date(task.date).getTime() && task.taskstatus == 'notdone') {
            createtasktoDisplay(task.task, task.date, task.id, upcoming);
        } else if (currentdate == task.date && task.taskstatus == 'notdone') {
            createtasktoDisplay(task.task, task.date, task.id, today);
        } else if (new Date().getTime() > new Date(task.date).getTime() && task.taskstatus == 'notdone' && currentdate != task.date) {
            createtasktoDisplay(task.task, task.date, task.id, Missed);
        } else if (task.taskstatus == 'completed' && (new Date().getTime() < new Date(task.date).getTime() || currentdate == task.date)) {
            createtasktoDisplay(task.task, task.date, task.id, completedTask);
        } else {
            RemoveFromLocalStorage(task.id);
        }
    });

}
// edit from local storage function
function editFromLocalStorage(task, date, id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            tasks[i].task = task;
            tasks[i].date = date;
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    location.reload();
}
// remove from local storage function
function RemoveFromLocalStorage(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            console.log(id)
            console.log(tasks[i].id)
            tasks.splice(i, 1);
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));

}
// validate_edited info function
function validate_edited_task(task, date) {
    if (task == '' || date == '') {
        alert('Please enter a valid task and date');
        return false;
    } else if (currentdate == date || new Date().getTime() < new Date(date).getTime()) {
        return true;
    }
    else {
        alert('Please enter a valid date');
        return false;
    }
}
// update status function
function updateStatus(id, status) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            tasks[i].taskstatus = status;
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
// veiew_and_Hide_Area function
function veiw_and_Hide_Area(area1, area2, area3, area4) {
    area1.style.display = 'none';
    area2.style.display = 'none';
    area3.style.display = 'none';
    area4.style.display = 'block';
}
///  function updates number of task missed,completed, todo
function updateNotification() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let No_of_task_completed = 0;
    let No_of_task_missed = 0;
    let No_of_task_todo = 0;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].taskstatus == 'completed') {
            No_of_task_completed++;
        } else if (tasks[i].taskstatus == 'notdone') {
            if (new Date().getTime() < new Date(tasks[i].date).getTime() || currentdate == tasks[i].date) {

                No_of_task_todo++;
            } else {
                No_of_task_missed++;
            }
        }
    }
    count_completed_tasks = document.querySelector('#completedtask');
    count_missed_tasks = document.querySelector('#pending');
    count_current_tasks = document.querySelector('#tocomplete');
    count_completed_tasks.innerText = "Completed Task:" + No_of_task_completed;
    count_missed_tasks.innerText = "Missed Task:" + No_of_task_missed;
    count_current_tasks.innerText = "Current Task:" + No_of_task_todo;
}


