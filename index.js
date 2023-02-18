const homebtn = document.querySelector('#homebtn');
const Errorpopup = document.getElementById('Errorpopup')
const ErrorMsg = document.getElementById('ErrorMsg');
const TaskList = document.getElementById('tasklist');
///////////////////////////////////////////////////////////////////////
const Inputbox = document.querySelector('#taskEnter');
const Taskdate = document.querySelector('#TaskDate');
const Addbtn = document.querySelector('#Addbtn');
const Clearbtn = document.querySelector('#Clearbtn');
///////////////////////////////////////////////////////////////////////
const tasks = document.querySelector('.tasks');
//const container = document.querySelector('.container');
///////////////////////// current task elements ///////////////////////////////////////////
const today = document.querySelector('#today');
const today_container = document.querySelector('#crrnt_container');
//////////////////// upcoming task element /////////////////////////////////////////////////
const upcoming = document.querySelector('#upcoming');
const upcoming_container = document.querySelector('#upcmg_container');
///////////////////////completed task elements ///////////////////////////////////////////
const completedTask = document.querySelector('#completed');
const completed_container = document.querySelector('#cmp_container');
////////////////////////missed task elements ////////////////////////////////////////////
const Missed = document.querySelector('#Missed');
const Missed_container = document.querySelector('#miss_container');
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
        window.location.href = "index.html";
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
        today.style.height = '60vh';
        veiw_and_Hide_Area(Missed, upcoming, completedTask, today);
    });

    id = JSON.parse(localStorage.getItem('lastId')) || 0;

    displayFromLocalStorage();
    findcurrentdate();
    updateNotification();
    Taskdate.value = currentdate;

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
// Declare a variable to hold a reference to the Edit_bar element
function addTask(task, date, container, where_to_add) {
    let taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.innerHTML = `
    <div class="todo"><div>${task}</div>
    <div>${date}</div></div>
    <div class="menu">
      <div class="menu-icon" id="Edit_bar">...</div>
      <div class="menu-actions hidden">
        <div class="action" id="deletebtn">delete</div>
        <div class="action" id="editbtn">edit</div>
        <div class="action" id="cmpltbtn">Done</div>
      </div>
    </div>
  `;
    taskElement.setAttribute('id', id);
    container.appendChild(taskElement);
    where_to_add.appendChild(container);
    AddToLocalStorage(task, date, id);
    updateNotification();
    updateid();
}

// Access the Edit_bar element outside the function

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
        addTask(task, date, today_container, today);

    } else if (new Date().getTime() < new Date(date).getTime()) {
        addTask(task, date, upcoming_container, upcoming);
    } else {
        alert('Please enter a valid date');
    }
    Inputbox.value = '';
    Taskdate.value = currentdate;
});
/// action that can be performed (ie, edit, delete, complete)
document.addEventListener('click', function (e) {
    // Get a reference to the menu-icon element
    const menuIcon = e.target;
    // Get a reference to the menu-actions element
    const menuActions = menuIcon.parentNode.querySelector('.menu-actions');
    if (menuActions) {
        // Toggle the hidden class on the menu-actions element
        menuActions.classList.toggle('hidden');
        menuActions.addEventListener('click', function (e) {
            elementid = e.target.parentElement.parentElement.parentElement.id
            if (e.target.id === 'deletebtn') {
                RemoveFromLocalStorage(elementid);
            }
            if (e.target.id === 'editbtn') {
                editpopup(elementid);
            }
            if (e.target.id === 'cmpltbtn') {
                updateStatus(elementid, 'completed');
            }
            if (e.target.id == 'addbackbtn') {
                updateStatus(elementid, 'notdone');
            }

        });
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
function createtasktoDisplay(taskname, date, task_id, container, where_to_add) {
    let taskElement = document.createElement('div');
    taskElement.classList.add('task');
    if (where_to_add == completedTask) {
        taskElement.innerHTML = `
    <div class="todo"><div>${taskname}</div>
    <div>${date}</div></div>
    <div class="menu">
      <div class="menu-icon" id="Edit_bar">...</div>
      <div class="menu-actions hidden">
        <div class="action" id="deletebtn">delete</div>
        <div class="action" id="editbtn">edit</div>
        <div class="action" id="addbackbtn">undo</div>
      </div>
    </div>
  `;
    }
    else {
        taskElement.innerHTML = `
    <div class="todo"><div>${taskname}</div>
    <div>${date}</div></div>
    <div class="menu">
      <div class="menu-icon" id="Edit_bar">...</div>
      <div class="menu-actions hidden">
        <div class="action" id="deletebtn">delete</div>
        <div class="action" id="editbtn">edit</div>
        <div class="action" id="cmpltbtn">Done</div>
      </div>
    </div>
  `;
    }
    taskElement.setAttribute('id', task_id);
    container.appendChild(taskElement);
    where_to_add.appendChild(container);
}
//display from  local storage function
function displayFromLocalStorage() {

    findcurrentdate();
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(function (task) {
        if (new Date().getTime() < new Date(task.date).getTime() && task.taskstatus == 'notdone' && currentdate != task.date) {
            createtasktoDisplay(task.task, task.date, task.id, upcoming_container, upcoming);
        } else if (currentdate == task.date && task.taskstatus == 'notdone') {
            createtasktoDisplay(task.task, task.date, task.id, today_container, today);
        } else if (new Date().getTime() > new Date(task.date).getTime() && task.taskstatus == 'notdone' && currentdate != task.date) {
            createtasktoDisplay(task.task, task.date, task.id, Missed_container, Missed);
        } else if (task.taskstatus == 'completed' && (new Date().getTime() < new Date(task.date).getTime() || currentdate == task.date)) {
            createtasktoDisplay(task.task, task.date, task.id, completed_container, completedTask);
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
            tasks.splice(i, 1);
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    location.reload();
}
// validate_edited info function
function validate_edited_task(task, date) {
    if (task == '' || date == '') {
        Errorpopup.style.display = 'flex';
        blur();
        ErrorMsg.innerHTML = 'Please fill all the fields';
        document.getElementById('Errorpopup').style.display = 'flex';
        document.getElementById('Editpopup').style.display = 'none';
        return false;
    } else if (currentdate == date || new Date().getTime() < new Date(date).getTime()) {
        document.getElementById('Editpopup').style.display = 'none';
        return true;
    }
    else {
        Errorpopup.style.display = 'flex';
        blur();
        ErrorMsg.innerHTML = 'Please enter date in the format YYYY-MM-DD';
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
    location.reload();
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
    count_completed_tasks.innerHTML = "Finished:" + No_of_task_completed + "<br>view";
    count_missed_tasks.innerHTML = "Missed :" + No_of_task_missed + "<br>view";
    count_current_tasks.innerHTML = "Today :" + No_of_task_todo + "<br>view";
}


document.getElementById('yes').addEventListener("click", function () {
    document.getElementById('Errorpopup').style.display = 'none';
    document.getElementById('Editpopup').style.display = 'flex';
    blur();
    ErrorMsg.innerHTML = '';


})


function blur() {
    if (Errorpopup.style.display == 'flex' || document.getElementById('Editpopup').style.display == 'flex') {
        TaskList.classList.add('blur');
        document.getElementById('header').classList.add('blur');
        document.getElementById('footer').classList.add('blur');
        document.getElementById('TaskInput').classList.add('blur');
    }
    else {
        TaskList.classList.remove('blur');
        document.getElementById('header').classList.remove('blur');
        document.getElementById('footer').classList.remove('blur');
        document.getElementById('TaskInput').classList.remove('blur');
    }
}

/// popup that perform editing the task 
function editpopup(elementid) {
    document.getElementById('Editpopup').style.display = 'flex';
    blur();
    document.getElementById('Reject').addEventListener("click", function () {
        document.getElementById('Editpopup').style.display = 'none';
        blur();
    })

    document.getElementById('confirm').addEventListener("click", function () {
        let task = document.getElementById('EditedTask').value;
        let date = document.getElementById('EditedTaskDate').value;
        if (validate_edited_task(task, date)) {
            editFromLocalStorage(task, date, elementid);
        }
    })
}

