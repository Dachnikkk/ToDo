'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }
    
    addToStorage() { // функция добавление в localStorage 
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    render() { // вывод на экран тудушку
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage(); // добавление в localStorage 
    }

    createItem(todo) { // создание лишки и добавление её
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>
        `);
        this.input.value = ''; // очистка поля ввода

        this.output(todo, li);
    }

    output(todo, li) {
        if(todo.completed) {
            this.todoCompleted.append(li);
        }else {
            this.todoList.append(li);
        }
    }

    addTodo(e){   // создание тудушку
        e.preventDefault();
        if(this.input.value.trim()){ // проверка на то что нам передали
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey()
            }
            this.todoData.set(newTodo.key, newTodo); // запишем в Map новый таск
            this.render(); // выведем на экран
        }else{
            alert('Нельзя создать пустое дело!')
        }
    }

    generateKey() { // функция генерации ключа
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteItem(target) { // функция удаления элемента
        let li = target.closest('li'); // найдём саму лишку 
        this.todoData.delete(li.key); // удалим её в массиве по ключу
        li.remove(); // удалим с экрана
        this.addToStorage(); // перезапишим localStorage
    }

    completedItem(target) { // функция выполнения лишки
        let li = target.closest('li'); // найдём саму лишку
        let key = li.key;
        if(this.todoData.get(key).completed){ // если лишка выполнена
            this.todoData.get(key).completed = false; // присвоим ей значение не выполнено(false)
            this.output(this.todoData.get(key), li) // выведем на экран 
            this.addToStorage();
        }else {
            this.todoData.get(key).completed = true; // присвоим ей значение выполнено(true)
            this.output(this.todoData.get(key), li) // выведем на экран 
            this.addToStorage();
        }
    }

    handler() {
        const todoContainer = document.querySelector('.todo-container');

        todoContainer.addEventListener('click', (e) => {
            let target = e.target; 
            if(!target.matches('button')){ // если пользователь нажал не на кнопку то прервём функцию
                return;
            }else {
                if(target.matches('.todo-remove')) { // если это кнопка удаления
                    this.deleteItem(target); // выполним функцию удаления
                }else if(target.matches('.todo-complete')) { // если это функция выполнения 
                    this.completedItem(target); // выполним функцию выполнения
                };
            
            }
        });
    }

    init() { // слушатель события на приём формы
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render(); // выгрузка лишек из мапа который был в локал сторедж
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '#completed');

todo.init();
todo.handler();