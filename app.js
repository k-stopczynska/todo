class Todo {
  constructor(itemId, value, isCompleted = false) {
    this.itemId = itemId;
    this.value = value;
    this.isCompleted = isCompleted;
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
    this.fetchTodoItems();
    this.connectUserInputButton();
    this.connectRemoveButtons();
    this.connectSwitchButtons();
    this.connectSwitchListButtons();
    this.updateItemsLeft();
    this.connectClearAllButton();
  }

  fetchTodoItems() {
    this.todos = [
      new Todo(Math.random(), "cooking", false),
      new Todo(Math.random(), "walking dogs", false),
      new Todo(Math.random(), "cleaning house", false),
      new Todo(Math.random(), "learning JS", false),
    ];
    this.completedTodos = [];
    this.allTodos = [...this.completedTodos, ...this.todos];
    this.renderTodos("list__all", this.allTodos);
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
    const previousListId = document.getElementsByTagName("ul")[0];
    this.todos.push(this.getUserInputValue());
    this.allTodos = [...this.completedTodos, ...this.todos];
    this.switchListHelper(previousListId);
    this.updateItemsLeft();
  }

  renderTodos(className, array) {
    for (const todoEl of array) {
//       if (todoEl.isCompleted) {
// new TodoItem(todoEl, className).classList.add('checked');
//       }
      new TodoItem(todoEl, className);
    }
  }

  render(className, array) {
    const previousList = document.getElementsByTagName("ul")[0];
     if (previousList) {
      previousList.remove();
    } else {
      className = 'list__all';
      array = this.allTodos;
    }
    const todoList = this.createElement("ul", "todo-list", [
      new ElementAttribute("id", className),
    ]);
    if (array && array.length > 0) {
      this.renderTodos(className, array);
      this.connectRemoveButtons();
      this.connectSwitchButtons();
      this.connectSwitchListButtons();
    }
  }

  movingTodo(e, array1, array2) {
    const previousListId = document.getElementsByTagName("ul")[0].id;
    const movingItem = e.target.closest("li");
    for (let i = 0; i < array1.length; i++) {
      if (array1[i].itemId == movingItem.id) {
        if (array2) {
          array1[i].isCompleted = true;
          array2.push(array1[i]);
        }
        array1.splice(i, 1);
      }
    }
    this.switchListHelper(previousListId);
    this.updateItemsLeft();
  }

  removeTodoItem(e) {
    this.movingTodo(e, this.todos);
    this.movingTodo(e, this.completedTodos);
  }

  connectRemoveButtons() {
    const removeButtons = document.querySelectorAll(".button__clear");
    removeButtons.forEach((removeButton) =>
      removeButton.addEventListener("click", this.removeTodoItem.bind(this))
    );
  }

  switchTodoItem(e) {
    this.completedTodos = [];
    this.movingTodo(e, this.todos, this.completedTodos);
  }

  connectSwitchButtons() {
    const switchButtons = document.querySelectorAll(".button__completed");
    switchButtons.forEach((switchButton) =>
      switchButton.addEventListener("click", this.switchTodoItem.bind(this))
    )
  }

  switchListHelper(buttonId, previousListId) {
    buttonId === "active" ||  previousListId === "list__active"
    ? this.render("list__active", this.todos)
    : buttonId === "completed" ||  previousListId === "list__completed"
    ? this.render("list__completed", this.completedTodos)
    : this.render("list__all", this.allTodos);
  }

  switchListHandler(e) {
    document.querySelectorAll(".button__list").forEach((switchListButton) => switchListButton.classList.remove('active'));
    const buttonId = e.target.id;
    e.target.classList.add('active');
    this.switchListHelper(buttonId);
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
    this.render(this.className, this.array);
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
