export class Todo {
    constructor(itemId, value, isCompleted = false) {
      this.itemId = itemId;
      this.value = value;
      this.isCompleted = isCompleted;
    }
  }