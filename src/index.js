import "./css/base.css";

import { sayHello } from "./js/utils";
import "./js/nodes.js"


//navigation
// Foooter buttons
const allBtn = document.querySelector('a[href="#/all"]');
const pendingBtn = document.querySelector('a[href="#/pending"]');
const completedBtn = document.querySelector('a[href="#/completed"');

allBtn.addEventListener('click', () => {
    allBtn.classList.add('selected')
    pendingBtn.classList.remove('selected')
    completedBtn.classList.remove('selected')

})

pendingBtn.addEventListener('click', () => {
    allBtn.classList.remove('selected')
    pendingBtn.classList.add('selected')
    completedBtn.classList.remove('selected')
})

completedBtn.addEventListener('click', () => {
    allBtn.classList.remove('selected')
    pendingBtn.classList.remove('selected')
    completedBtn.classList.add('selected')
})

window.addEventListener('hashchange', navigator, false);

function navigator() {

    if (location.hash.endsWith('pending')) {
        pendingPage();
    } else if (location.hash.endsWith('completed')) {
        completedPage();
    } else {
        allPage();
    }
    updateCounter()

}

function pendingPage() {
    const completeTasks = document.querySelectorAll('ul.todo-list li');
    completeTasks.forEach(task => {
        if (task.classList.contains('completed')) {
            task.style.display = "none";
        } else {
            task.style.display = "list-item";
        }
    });
}

function completedPage() {
    const completeTasks = document.querySelectorAll('ul.todo-list li');
    completeTasks.forEach(task => {
        if (!task.classList.contains('completed')) {
            task.style.display = "none";
        } else {
            task.style.display = "list-item";
        }
    });
}

function allPage() {
    const completeTasks = document.querySelectorAll('ul.todo-list li');
    completeTasks.forEach(task => {
        task.style.display = "list-item";
    });
}


//Header
const headerSection = document.querySelector('.header');
const inputTasks = document.querySelector('.new-todo');

// Sections
const main = document.querySelector('.main');
const todoList = document.querySelector('.todo-list')


// Foooter
const footer = document.querySelector('.footer');
const todosCounter = document.querySelector('.todo-count');
const clearTasksBtn = document.querySelector('.clear-completed');


//Local Storage
// localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
// const item = JSON.parse(localStorage.getItem('liked_movies'));

const tasks = {}


function readLS() {
    if (localStorage.getItem('mydayapp-js')) {
        const taskItems = JSON.parse(localStorage.getItem('mydayapp-js'))
        const values = Object.keys(taskItems)
        values.forEach(item => {
            addNewTodo(item, taskItems[item])
        })
    }

}
function saveTasksLS() {
    localStorage.setItem('mydayapp-js', JSON.stringify(tasks));
}


let todos = 0
let todosCompleted = 0


//Home Page
function homePage() {
    if (todos == 0) {
        main.style.display = "none";
        footer.style.display = "none";
    } else {
        main.style.display = "block";
        footer.style.display = "block";
    }
}



//input
inputTasks.addEventListener('change', readInput)

function readInput() {
    if (inputTasks.value != '') {
        const inputValue = inputTasks.value.trim()
        addNewTodo(inputValue)
        inputTasks.value = ''
    } else {
        console.log("Write a task")
    }

}

//TODOs

function addNewTodo(inputValue, isComplete = false) {
    tasks[inputValue] = isComplete;
    saveTasksLS()
    todos++
    homePage()
    const containerTask = document.createElement('li');

    const task = document.createElement('div')
    task.setAttribute('class', "view");

    const taskInput = document.createElement('input')
    taskInput.setAttribute('class', "toggle");
    taskInput.setAttribute('type', "checkbox");


    const taskLabel = document.createElement('label')
    taskLabel.innerHTML = `${inputValue}`

    const taskDestroyBtn = document.createElement('button')
    taskDestroyBtn.setAttribute('class', "destroy");

    const containerTaskInput = document.createElement('input')
    containerTaskInput.setAttribute('class', "edit");
    containerTaskInput.setAttribute('value', inputValue);
    if (isComplete) {
        taskInput.checked = true
        containerTask.classList.add('completed')
    }


    todoList.appendChild(containerTask)
    containerTask.appendChild(task)
    task.appendChild(taskInput)
    task.appendChild(taskLabel)
    task.appendChild(taskDestroyBtn)
    containerTask.appendChild(containerTaskInput)

    taskInput.addEventListener('click', () => {
        containerTask.classList.toggle('completed')
        if (containerTask.classList.contains('completed')) {
            todosCompleted++
            tasks[inputValue] = true
        } else {
            todosCompleted--
            tasks[inputValue] = false
        }
        updateCounter()
        saveTasksLS()
    })

    taskLabel.addEventListener('dblclick', () => {
        inputValue = containerTaskInput.value.trim()
        containerTask.classList.toggle('editing')
    })



    containerTaskInput.addEventListener('blur', inputChange)
    containerTaskInput.addEventListener('change', inputChange)

    containerTaskInput.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            if (containerTaskInput === document.activeElement) {
                taskLabel.innerHTML = `${inputValue}`
                containerTask.classList.remove('editing')
                containerTaskInput.value = inputValue
            }
        }
    })


    taskDestroyBtn.addEventListener('click', () => {
        todos--
        if (containerTask.classList.contains('completed')) {
            todosCompleted--
        }
        containerTask.innerHTML = ''
        todoList.removeChild(containerTask)
        homePage()
        updateCounter()
        delete tasks[inputValue]
        saveTasksLS()
    })



    function inputChange() {

        const prevData = tasks[inputValue]
        delete tasks[inputValue]

        const inputValue = containerTaskInput.value.trim()
        taskLabel.innerHTML = `${inputValue}`
        containerTask.classList.remove('editing')
        containerTaskInput.value = inputValue

        tasks[inputValue] = prevData
        saveTasksLS()
    }

    updateCounter()

}


//Footer
function updateCounter() {
    // 'a[href="#/all"]'
    const todosCount = todoList.querySelectorAll('li[style="display: none;"]')
    const numberTodo = todosCount.length;
    const number = todos-numberTodo

    if(number==0){
        todosCounter.innerHTML = `<strong>${number}</strong> items`
    }else if (number==1){
        todosCounter.innerHTML = `<strong>${number}</strong> item`
    }else{
        todosCounter.innerHTML = `<strong>${number}</strong> items`
    }

}

clearTasksBtn.addEventListener('click', removeCompletedTasks)

function removeCompletedTasks() {

    const completeTasks = document.querySelectorAll('.completed');

    completeTasks.forEach(task => {

        task.innerHTML = ''
        todoList.removeChild(task)
        todos--
        if (task.classList.contains('completed')) {
            todosCompleted--
        }
    });

    homePage()
    updateCounter()

}


readLS()
homePage()