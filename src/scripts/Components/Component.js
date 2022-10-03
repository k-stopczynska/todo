export class Component {
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