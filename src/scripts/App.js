import { TodoList } from './Components/TodoList.js';

class App {
  static init() {
    new TodoList("app");
  }
}

App.init();
