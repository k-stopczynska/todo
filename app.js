class Todo {
  constructor(itemId, value) {
    this.itemId = itemId;
    this.value = value;
  }
}

class ElementAttribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

class Component {
  constructor(renderHookId, doRender = true) {
    this.renderHookId = renderHookId;
    if (doRender) {
      this.render();
    }
  }

  createElement(tag, cssClassess, attributes) {
    const element = document.createElement(tag);
    if (cssClassess) {
      element.className = cssClassess;
    }
    if (attributes) {
      for (const attr of attributes) {
        element.setAttribute(attr.name, attr.value);
      }
    }
    document.getElementById(this.renderHookId).appendChild(element);
    return element;
  }

  render() {}
}

class TodoItem extends Component {
  constructor(todo, renderHookId) {
    super(renderHookId, false);
    this.todo = todo;
    this.render();
  }

  render() {
    const todoItem = this.createElement("li", "todo-item", [
      new ElementAttribute("id", `${this.todo.itemId}`),
    ]);
    todoItem.innerHTML = `
    <div class="wrapper__input">
    <button class="button button__completed"></button>
    <p>${this.todo.value}</p>
    </div>
    <button class="button button__clear"></button>`;
  }
}

class TodoList extends Component {
  todos = [];
  completedTodos = [];
  allTodos = [];
  constructor(renderHookId) {
    super(renderHookId, true);
    //this.type = type;
    this.fetchTodoItems();
    this.getAllTodos();
    this.connectUserInputButton();
    this.connectRemoveButtons();
    this.connectSwitchButtons();
    this.connectSwitchListButtons();
    this.updateItemsLeft();
    this.connectClearAllButton();
  }

  fetchTodoItems() {
    this.todos = [
      new Todo(Math.random(), "cooking"),
      new Todo(Math.random(), "walking dogs"),
      new Todo(Math.random(), "cleaning house"),
      new Todo(Math.random(), "learning JS"),
    ];
    this.renderTodos("list__active", this.todos);
  }

  getAllTodos() {
    this.allTodos = [...this.todos, ...this.completedTodos];
    return this.allTodos;
  }

  getUserInputValue() {
    const userInput = document.getElementById("user-input");
    const value = userInput.value;
    const itemId = Math.random();
    return new Todo(itemId, value);
  }

  connectUserInputButton() {
    const userInputButton = document.querySelector(".button__input");
    userInputButton.addEventListener("click", this.updateTodos.bind(this));
  }

  updateTodos(e) {
    e.preventDefault();
    this.todos.push(this.getUserInputValue());
    this.render(this.className, this.array);
    this.updateItemsLeft();
    this.getAllTodos();
  }

  renderTodos(className, array) {
    for (const todoEl of array) {
      new TodoItem(todoEl, className);
    }
  }

  render(className, array) {
    const previousList = document.getElementsByTagName("ul")[0];
    if (previousList) {
      previousList.remove();
    }
    if (previousList) {console.log(className, this.todos);}
    const todoList = this.createElement("ul", "todo-list", [
      new ElementAttribute("id", (className = "list__active")),
    ]);
    if (array && array.length > 0) {
      this.renderTodos(className, array);
      this.connectRemoveButtons();
      this.connectSwitchButtons();
      this.connectSwitchListButtons();
    }
  }

  movingTodo(e, array1, array2) {
    const movingItem = e.target.closest("li");
    console.log(array2);
    for (let i = 0; i < array1.length; i++) {
      if (array1[i].itemId == movingItem.id) {
        if (array2) {
          array2.push(array1[i]);
        }
        array1.splice(i, 1);
      }
    }
    this.render(this.className, this.todos);
    this.updateItemsLeft();
    this.getAllTodos();
  }

  removeTodoItem(e) {
    this.movingTodo(e, this.todos);
    this.movingTodo(e, this.completedTodos);
    this.getAllTodos();
  }

  connectRemoveButtons() {
    const removeButtons = document.querySelectorAll(".button__clear");
    removeButtons.forEach((removeButton) =>
      removeButton.addEventListener("click", this.removeTodoItem.bind(this))
    );
  }

  switchTodoItem(e) {
   e.target.classList.add('checked');
    this.completedTodos = [];
    this.movingTodo(e, this.todos, this.completedTodos);
    this.getAllTodos();
    console.log(this.completedTodos, this.todos, this.allTodos);
  }

  connectSwitchButtons() {
    const switchButtons = document.querySelectorAll(".button__completed");
    switchButtons.forEach((switchButton) =>
      switchButton.addEventListener("click", this.switchTodoItem.bind(this))
    );
  }

  switchListHandler(e) {
    const buttonId = e.target.id;
    buttonId === "active"
      ? this.render("list__active", this.todos)
      : buttonId === "completed"
      ? this.render("list__completed", this.completedTodos)
      : this.render("list__all", this.allTodos);
  }

  connectSwitchListButtons() {
    const switchListButtons = document.querySelectorAll(".button__list");
    switchListButtons.forEach((switchListButton) =>
      switchListButton.addEventListener(
        "click",
        this.switchListHandler.bind(this)
      )
    );
  }

  updateItemsLeft() {
    const itemsLeft = document.getElementById("items-left");
    itemsLeft.innerHTML = `${this.todos.length} items left`;
  }

  clearCompletedTodosHandler() {
    const itemsToRemove = this.completedTodos.length;
    this.completedTodos.splice(0, itemsToRemove);
    this.render("list__completed", this.completedTodos);
  }

  connectClearAllButton() {
    const clearAllButton = document.querySelector(".button__clear__all");
    clearAllButton.addEventListener(
      "click",
      this.clearCompletedTodosHandler.bind(this)
    );
  }
}

class App {
  static init() {
    new TodoList("app");
  }
}

App.init();
