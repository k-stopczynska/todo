import { Component } from "./Component.js";
import { ElementAttribute } from "../Utils/ElementAttribute.js";
import { Todo } from "./Todo.js";
import { TodoItem } from "./TodoItem.js";

export class TodoList extends Component {
  todos = [];
  completedTodos = [];
  allTodos = [];
  constructor(renderHookId) {
    super(renderHookId, true);
    this.setLocalStorage();
    this.fetchTodoItems();
    this.connectUserInputButton();
    this.connectRemoveButtons();
    this.connectSwitchButtons();
    this.connectSwitchListButtons();
    this.updateItemsLeft();
    this.connectClearAllButton();
    this.connectDrop();
  }

  setLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
    localStorage.setItem("completedTodos", JSON.stringify(this.completedTodos));
    localStorage.setItem("allTodos", JSON.stringify(this.allTodos));
  }

  getLocalStorage() {
    this.todos = JSON.parse(localStorage.getItem("todos"));
    this.completedTodos = JSON.parse(localStorage.getItem("completedTodos"));
    this.allTodos = JSON.parse(localStorage.getItem("allTodos"));
  }

  fetchTodoItems() {
    this.getLocalStorage();
    if (this.todos.length === 0 && this.completedTodos.length === 0) {
      this.todos = [
        new Todo(Math.random(), "Jog around the park 3x", false),
        new Todo(Math.random(), "10 minutes meditation", false),
        new Todo(Math.random(), "Read for 1 hour", false),
        new Todo(Math.random(), "Pick up groceries", false),
        new Todo(Math.random(), "Complete Todo App on Frontend Mentor", false),
      ];
      this.completedTodos = [
        new Todo(Math.random(), "Complete online Javascript course", true),
      ];
      this.allTodos = [...this.completedTodos, ...this.todos];
      this.setLocalStorage();
    } else {
      this.getLocalStorage();
    }
    this.renderTodos("list__all", this.allTodos);
  }

  getUserInputValue() {
    const userInput = document.getElementById("user-input");
    const value = userInput.value;
    const itemId = Math.random();
    const isCompleted = false;
    userInput.value = '';
    return new Todo(itemId, value, isCompleted);
  }

  connectUserInputButton() {
    const userInputButton = document.querySelector(".button__input");
    userInputButton.addEventListener("click", this.updateTodos.bind(this));
  }

  updateTodos(e) {
    e.preventDefault();
    this.getLocalStorage();
    const previousListId = document.getElementsByTagName("ul")[0];
    this.todos.push(this.getUserInputValue());
    this.allTodos = [...this.completedTodos, ...this.todos];
    this.setLocalStorage();
    this.getLocalStorage();
    this.switchListHelper(previousListId);
    this.updateItemsLeft();
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
    } else {
      className = "list__all";
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
      this.connectDrop();
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
        this.allTodos = [...this.completedTodos, ...this.todos];
        this.setLocalStorage();
      }
    }
    this.switchListHelper(previousListId);
    this.updateItemsLeft();
  }

  removeTodoItem(e) {
    this.getLocalStorage();
    this.movingTodo(e, this.todos);
    this.movingTodo(e, this.completedTodos);
    this.movingTodo(e, this.allTodos);
  }

  connectRemoveButtons() {
    const removeButtons = document.querySelectorAll(".button__clear");
    removeButtons.forEach((removeButton) =>
      removeButton.addEventListener("click", this.removeTodoItem.bind(this))
    );
  }

  switchTodoItem(e) {
    this.getLocalStorage();
    this.movingTodo(e, this.todos, this.completedTodos);
  }

  connectSwitchButtons() {
    const switchButtons = document.querySelectorAll(".button__completed");
    switchButtons.forEach((switchButton) =>
      switchButton.addEventListener("click", this.switchTodoItem.bind(this))
    );
  }

  switchListHelper(id) {
    this.getLocalStorage();
      id === "active" || id === "list__active"
      ? this.render("list__active", this.todos)
      : id === "completed" || id === "list__completed"
      ? this.render("list__completed", this.completedTodos)
      : this.render("list__all", this.allTodos);
  }

  switchListHandler(e) {
    document
      .querySelectorAll(".button__list")
      .forEach((switchListButton) =>
        switchListButton.classList.remove("active")
      );
    const buttonId = e.target.id;
    e.target.classList.add("active");
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
    this.getLocalStorage();
    let itemsLeft = document.querySelectorAll(".items-left");
    itemsLeft.forEach(
      (itemLeft) => (itemLeft.innerHTML = `${this.todos.length} items left`)
    );
  }

  clearCompletedTodosHandler() {
    const previousListId = document.getElementsByTagName("ul")[0].id;
    this.getLocalStorage();
    const itemsToRemove = this.completedTodos.length;
    this.completedTodos.splice(0, itemsToRemove);
    this.allTodos = [...this.completedTodos, ...this.todos];
    this.setLocalStorage();
    this.switchListHelper(previousListId);
  }

  connectClearAllButton() {
    const clearAllButtons = document.querySelectorAll(".button__clear__all");
    clearAllButtons.forEach((clearAllButton) =>
      clearAllButton.addEventListener(
        "click",
        this.clearCompletedTodosHandler.bind(this)
      )
    );
  }

  dropCompleteHandler(e) {
    this.getLocalStorage();
    const previousListId = document.getElementsByTagName("ul")[0].id;
    const todoId = e.dataTransfer.getData("text/plain");
    if (todoId === e.target.id) {
      return;
    } else {
      const firstIndex = (elem) => elem.itemId == todoId;
      const secondIndex = (elem) => elem.itemId == e.target.closest("li").id;
      const indexToMove = this.todos.findIndex(firstIndex);
      const indexToInsert = this.todos.findIndex(secondIndex);
      const [movingObject] = this.todos.splice(indexToMove, 1);
      this.todos.splice(indexToInsert, 0, movingObject);
      this.allTodos = [...this.completedTodos, ...this.todos];
      this.setLocalStorage();
    }
    this.switchListHelper(previousListId);
  }

  connectDrop() {
    const list = document.querySelector(".todo-list");
    list.addEventListener("drop", this.dropCompleteHandler.bind(this));
  }
}
