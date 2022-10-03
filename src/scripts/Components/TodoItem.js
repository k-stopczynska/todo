import { Component } from "./Component.js";
import { ElementAttribute } from "../Utils/ElementAttribute.js";

export class TodoItem extends Component {
  constructor(todo, renderHookId, isCompleted = false) {
    super(renderHookId, false);
    this.todo = todo;
    this.isCompleted = isCompleted;
    this.render();
    this.addEventListeners();
  }

  render() {
    const todoItem = this.createElement("li", "todo-item", [
      new ElementAttribute("id", `${this.todo.itemId}`),
      new ElementAttribute("draggable", "true"),
    ]);
    if (this.todo.isCompleted) {
      todoItem.classList.add("checked");
    }
    todoItem.innerHTML = `
      <div class="wrapper__input">
      <button class="button button__completed"></button>
      <p>${this.todo.value}</p>
      </div>
      <button class="button button__clear"></button>`;
  }

  dragStart(e) {
    const item = document.getElementById(this.id);
    e.dataTransfer.setData("text/plain", this.id);
  }
  dragEnter(e) {
    e.preventDefault();
    this.classList.add("draggable");
  }
  dragOver(e) {
    e.preventDefault();
  }
  dragLeave(e) {
    e.preventDefault();
    this.classList.remove("draggable");
  }
  drop() {
    this.classList.remove("draggable");
  }

  addEventListeners() {
    const listElements = document.querySelectorAll("li");
    listElements.forEach((listEl) => {
      listEl.addEventListener("dragenter", this.dragEnter);
      listEl.addEventListener("dragover", this.dragOver);
      listEl.addEventListener("dragleave", this.dragLeave);
      listEl.addEventListener("dragstart", this.dragStart);
      listEl.addEventListener("drop", this.drop);
    });
  }
}
