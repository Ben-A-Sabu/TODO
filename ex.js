const homebtn = document.querySelector('#homebtn');
const Inputbox = document.querySelector('#taskEnter');
const Taskdate = document.querySelector('#TaskDate');
const Addbtn = document.querySelector('#Addbtn');
const Clearbtn = document.querySelector('#Clearbtn');
const tasks = document.querySelector('.tasks');
const today = document.querySelector('#today');
const upcoming = document.querySelector('#upcoming');
const tasksList = document.querySelector('.task');
const taskList1 = document.querySelector('.upcomming_task');
const viewMisedTasks = document.querySelector('#view_miss_task');
const viewCompletedTasks = document.querySelector('#view_comp_task');
const viewCurrentTasks = document.querySelector('#view_current_task');
const completedTask = document.querySelector('#completed');
const compTasklist = document.querySelector('.Ctask');
const missedTaskList = document.querySelector('.Mtask');
const Missed = document.querySelector('#Missed');


var currentdate;
var month;
var id = 0;
var lastId = 0;

displayFromLocalStorage();
findcurrentdate();
updateNotification();

console.log(localStorage.getItem('lastId'));

if (localStorage.getItem('lastId') != null) {

    id = localStorage.getItem('lastId');
    id = JSON.parse(id);

} else {
    id = 0;
}

function findcurrentdate() {
    if (new Date().getMonth() + 1 < 10) {
        currentdate = new Date().getFullYear() + '-' + "0" + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    } else {
        currentdate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    }
}


homebtn.addEventListener('click', function () {

    console.log("home button clicked");
    window.location.href = "ex.html";
});



function addTask(task, date) {
    let taskElement = document.createElement('li');
    taskElement.classList.add('task');
    taskElement.innerHTML = `<p >${task}</p>
        <p>${date}</p><button class="action" id="deletebtn">delete</button><button class="action" id="editbtn">edit</button><button class="action" id="cmpltbtn">Done</button></div>`;
    tasksList.appendChild(taskElement);
    taskElement.setAttribute('id', id);
    today.appendChild(taskElement);
    AddToLocalStorage(task, date, id);
    updateid();
    return taskElement;
}


Addbtn.addEventListener('click', function () {
    let task = Inputbox.value;
    let date = Taskdate.value;
    console.log(date);

    if (task === '' || date === '') {
        alert('Please enter a task and date');
    } else if (currentdate === date) {

        let taskList = document.createElement('li');
        taskList.classList.add('task');
        taskList.innerHTML = `<p >${task}</p>
        <p>${date}</p><button class="action" id="deletebtn">delete</button><button class="action" id="editbtn">edit</button><button class="action" id="cmpltbtn">Done</button></div>`;
        tasksList.appendChild(taskList);
        taskList.setAttribute('id', id);
        today.appendChild(taskList);
        AddToLocalStorage(task, date, id);
        updateid();


    } else if (new Date().getTime() < new Date(date).getTime()) {
        let tasklist1 = document.createElement('li');
        tasklist1.classList.add('upcomming_task');
        tasklist1.innerHTML = `<p>${task}</p>
        <p>${date}</p><button class="action" id="deletebtn">delete</button><button class="action" id="editbtn">edit</button><button class="action" id="cmpltbtn">Done</button></div>`;
        taskList1.appendChild(tasklist1);
        tasklist1.setAttribute('id', id);
        upcoming.appendChild(tasklist1);
        AddToLocalStorage(task, date, id);
        updateid();


    } else {
        alert('Please enter a valid date');
    }

    Inputbox.value = '';
    Taskdate.value = '';

});




Clearbtn.addEventListener('click', function () {
    Inputbox.value = '';
    Taskdate.value = '';
});


tasks.addEventListener('click', function (e) {

    if (e.target.id === 'deletebtn') {
        console.log(e.target.parentElement.id);
        RemoveFromLocalStorage(e.target.parentElement.id);
        e.target.parentElement.remove();

    }

    if (e.target.id === 'editbtn') {
        console.log(e.target.parentElement.id);
        let prevdate = e.target.parentElement.querySelector('p:nth-child(2)').innerHTML;

        let editTask = prompt('Edit Task');
        let editDate = prompt('Edit Date' + '(' + 'YYYY-MM-DD' + ')');


        e.target.parentElement.setAttribute('id', e.target.parentElement.id);
        var value = validate_edited_task(editTask, editDate, e.target.parentElement.id, prevdate);
        if (value == true) {
            editFromLocalStorage(editTask, editDate, e.target.parentElement.id);
            e.target.parentElement.innerHTML = `<p>${editTask}</p><p>${editDate}</p><button class="action" id="deletebtn">delete</button><button class="action" id="editbtn">edit</button><button class="action" id="cmpltbtn">Done</button></div>`;
        } else {
            alert('Please enter in valid format');
        }



    }

    if (e.target.id === 'cmpltbtn') {
        console.log(e.target.parentElement.id);
        updateStatus(e.target.parentElement.id, 'completed');
        e.target.parentElement.remove();
        displayFromLocalStorage();
    }

    if (e.target.id == 'addbackbtn') {

        updateStatus(e.target.parentElement.id, 'notdone');
        e.target.parentElement.remove();
        displayFromLocalStorage();

    }

});
//console.log(localStorage.getItem('tasks'));

function updateid() {
    console.log("id being updated");
    id++;
    lastId = id;
    console.log("updated id is " + lastId);
    localStorage.setItem('lastId', JSON.stringify(lastId));

}


function AddToLocalStorage(task, date, id) {
    let taskObj = {
        task: task,
        date: date,
        id: id,
        taskstatus: 'notdone'
    };
    let tasks = localStorage.getItem('tasks');

    if (tasks == null) {
        tasks = [];
    } else {
        tasks = JSON.parse(tasks);
    }

    tasks.push(taskObj);
    updateNotification();

    localStorage.setItem('tasks', JSON.stringify(tasks));

}



function displayFromLocalStorage() {

    findcurrentdate();

    let tasks = localStorage.getItem('tasks');

    if (tasks === null) {
        console.log('No tasks to display');
        tasks = [];
    } else {
        tasks = JSON.parse(tasks);
    }

    tasks.forEach(function (task) {

        if (new Date().getTime() < new Date(task.date).getTime() && task.taskstatus == 'notdone') {
            let tasklist1 = document.createElement('li');
            tasklist1.classList.add('upcomming_task');
            tasklist1.innerHTML = `<p>${task.task}</p>
            <p>${task.date}</p><button class="action" id="deletebtn">delete</button><button class="action" id="editbtn">edit</button><button class="action" id="cmpltbtn">Done</button></div>`;
            taskList1.appendChild(tasklist1);
            tasklist1.setAttribute('id', task.id);
            upcoming.appendChild(tasklist1);
        } else if (currentdate == task.date && task.taskstatus == 'notdone') {
            let taskList = document.createElement('li');
            taskList.classList.add('task');
            taskList.innerHTML = `<p >${task.task}</p>
            <p>${task.date}</p><button class="action" id="deletebtn">delete</button><button class="action" id="editbtn">edit</button><button class="action" id="cmpltbtn">Done</button></div>`;
            tasksList.appendChild(taskList);
            taskList.setAttribute('id', task.id);
            today.appendChild(taskList);
        } else if (new Date().getTime() > new Date(task.date).getTime() && task.taskstatus == 'notdone' && currentdate != task.date) {
            let taskList = document.createElement('li');
            taskList.classList.add('Mtask');
            taskList.innerHTML = `<p >${task.task}</p>
            <p>${task.date}</p><button class="action" id="deletebtn">delete</button><button class="action" id="editbtn">edit</button><button class="action" id="cmpltbtn">Done</button></div>`;
            missedTaskList.appendChild(taskList);
            taskList.setAttribute('id', task.id);
            Missed.appendChild(taskList);
        } else if (task.taskstatus == 'completed' && (new Date().getTime() < new Date(task.date).getTime() || currentdate == task.date)) {
            console.log("task is done");
            let taskList = document.createElement('li');
            taskList.classList.add('Ctask');
            taskList.innerHTML = `<p >${task.task}</p><p>${task.date}</p></p><button class="action" id="addbackbtn">Add Back</button><button class="action" id="editbtn">edit</button>`;
            compTasklist.appendChild(taskList);
            taskList.setAttribute('id', task.id);
            completedTask.appendChild(taskList);
        } else {
            RemoveFromLocalStorage(task.id);
        }


    });

    updateNotification();
}



function editFromLocalStorage(task, date, id) {
    let tasks = localStorage.getItem('tasks');
    if (tasks == null) {
        tasks = [];
    } else {
        tasks = JSON.parse(tasks);
    }



    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            tasks[i].task = task;
            tasks[i].date = date;
            console.log("haiiiiiiiiiiii");
        }


    }


    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function RemoveFromLocalStorage(id) {
    console.log(id);
    let tasks = localStorage.getItem('tasks');
    if (tasks === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(tasks);

        console.log("task is being removed");

        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id == id) {
                console.log(id)
                console.log(tasks[i].id)
                tasks.splice(i, 1);

                console.log("hauiiii");
            }

        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function validate_edited_task(task, date, cid, prevdate) {
    if (task == '' || date == '') {
        alert('Please enter a valid task and date');
        return false;
    } else if (currentdate == date) {


        if (prevdate != date) {
            let taskList = document.createElement('li');
            taskList.classList.add('task');
            taskList.innerHTML = `<p >${task}</p>
           <p>${date}</p><button class="action" id="deletebtn">delete</button><button class="action" id="editbtn">edit</button><button class="action" id="cmpltbtn">Done</button></div>`;
            tasksList.appendChild(taskList);
            taskList.setAttribute('id', cid);
            today.appendChild(taskList);
            RemoveFromLocalStorage(cid);
            AddToLocalStorage(task, date, cid);
            window.location.reload();

        }

        return true;

    } else if (new Date().getTime() < new Date(date).getTime()) {

        if (prevdate != date) {
            let tasklist1 = document.createElement('li');
            tasklist1.classList.add('upcomming_task');
            tasklist1.innerHTML = `<p>${task}</p>
            <p>${date}</p><button class="action" id="deletebtn">delete</button><button class="action" id="editbtn">edit</button><button class="action" id="cmpltbtn">Done</button></div>`;
            taskList1.appendChild(tasklist1);
            tasklist1.setAttribute('id', cid);
            upcoming.appendChild(tasklist1);
            RemoveFromLocalStorage(cid);
            AddToLocalStorage(task, date, cid);
            window.location.reload();
        }

        return true;

    } else {
        alert('Please enter a valid date');
        return false;
    }



}

function updateStatus(id, status) {
    let tasks = localStorage.getItem('tasks');
    if (tasks == null) {
        tasks = [];
    } else {
        tasks = JSON.parse(tasks);
    }

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            tasks[i].taskstatus = status;
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
}



viewMisedTasks.addEventListener('click', function () {

    console.log("button clicked");
    console.log(Missed);

    today.style.display = 'none';
    upcoming.style.display = 'none';
    completedTask.style.display = 'none';
    Missed.style.display = 'block';

});

viewCompletedTasks.addEventListener('click', function () {

    console.log("button clicked");
    console.log(completedTask);

    today.style.display = 'none';
    upcoming.style.display = 'none';
    Missed.style.display = 'none';
    completedTask.style.display = 'block';

});


viewCurrentTasks.addEventListener('click', function () {

    console.log("button clicked");
    console.log(today);

    Missed.style.display = 'none';
    upcoming.style.display = 'none';
    completedTask.style.display = 'none';
    today.style.display = 'block';

});




function updateNotification() {
    let tasks = localStorage.getItem('tasks');
    if (tasks == null) {
        tasks = [];
    } else {
        tasks = JSON.parse(tasks);
    }

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