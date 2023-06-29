/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/trello/trellowidget.js

class TrelloWidget {
  constructor(data) {
    const {
      parentName,
      task,
      form,
      tooltip,
      note
    } = data;
    const toDo = new note({
      task,
      form,
      tooltip,
      title: "TODO"
    });
    const inProgress = new note({
      task,
      form,
      tooltip,
      title: "INPROGRESS"
    });
    const done = new note({
      task,
      form,
      tooltip,
      title: "DONE"
    });
    const title = document.createElement("h3");
    title.classList.add("app-title");
    title.textContent = "TRELLO";
    const widgetMain = document.createElement("div");
    widgetMain.classList.add("widget-main");
    widgetMain.append(toDo.note);
    widgetMain.append(inProgress.note);
    widgetMain.append(done.note);
    const widget = document.createElement("div");
    widget.classList.add("trello-wrapper");
    widget.append(title);
    widget.append(widgetMain);
    this.element = document.querySelector(`.${parentName}`);
    this.element.append(widget);
    this.main = widgetMain;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.element.addEventListener("mousedown", this.onMouseDown);
  }
  onMouseUp(e) {
    if (!this.actualElement) return;
    const onMouseUpTarget = e.target;
    if (onMouseUpTarget.classList.contains("task")) {
      const list = onMouseUpTarget.querySelector(".list");
      list.insertBefore(this.actualElement, onMouseUpTarget);
    } else if (onMouseUpTarget.classList.contains("list-wrapper")) {
      const list = onMouseUpTarget.querySelector(".list");
      list.append(this.actualElement);
    }
    this.actualElement.classList.remove("dragged");
    this.actualElement = null;
    document.documentElement.removeEventListener("mouseup", this.onMouseUp);
    document.documentElement.removeEventListener("mouseover", this.onMouseOver);
  }
  onMouseDown(e) {
    if (!e.target.classList.contains("task")) {
      return;
    }
    e.preventDefault();
    this.actualElement = e.target;
    this.actualElement.classList.add("dragged");
    document.documentElement.addEventListener("mouseup", this.onMouseUp);
    document.documentElement.addEventListener("mouseover", this.onMouseOver);
    this.items = [...document.querySelectorAll(".task")];
  }
  onMouseOver(e) {
    if (!this.actualElement) return;
    this.actualElement.style.top = `${e.clientY}px`;
    this.actualElement.style.left = `${e.clientX}px`;
  }
}
;// CONCATENATED MODULE: ./src/img/close.png
const close_namespaceObject = __webpack_require__.p + "d5be631607bd0cfb4fdd.png";
;// CONCATENATED MODULE: ./src/components/task.js


class Task {
  constructor(data) {
    const task = document.createElement("li");
    task.classList.add("task");
    task.textContent = data;
    this.element = task;
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.remove = this.remove.bind(this);
    this.element.addEventListener("mouseover", this.onMouseOver);
    this.element.addEventListener("mouseout", this.onMouseOut);
  }
  get task() {
    return this.element;
  }
  onMouseOut() {
    this.element.classList.toggle("overlapped");
    this.closeBtn.remove();
    this.element.removeEventListener("mouseout", this.onMouseOut);
    this.element.addEventListener("mouseover", this.onMouseOver);
  }
  onMouseOver(e) {
    const removeBtn = document.createElement("img");
    removeBtn.classList.add("remove-btn");
    removeBtn.classList.add("overlap");
    removeBtn.setAttribute("src", close_namespaceObject);
    this.closeBtn = removeBtn;
    this.element.append(this.closeBtn);
    this.element.classList.toggle("overlapped");
    this.closeBtn.addEventListener("mousedown", this.remove);
    this.element.removeEventListener("mouseover", this.onMouseOver);
    this.element.addEventListener("mouseout", this.onMouseOut);
  }
  remove(e) {
    this.element.remove();
  }
}
;// CONCATENATED MODULE: ./src/components/form.js

class Form {
  constructor() {}
  get form() {
    const form = document.createElement("form");
    form.classList.add("form-widget");
    form.classList.add("item");
    form.setAttribute("novalidate", true);
    const inputText = document.createElement("input");
    inputText.classList.add("item-input");
    inputText.setAttribute("type", "text");
    inputText.setAttribute("placeholder", "Enter a title for this card...");
    const acceptBtn = document.createElement("button");
    acceptBtn.classList.add("accept-btn");
    acceptBtn.textContent = "Add Card";
    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("cancel-btn");
    cancelBtn.textContent = "X";
    const btnSet = document.createElement("span");
    btnSet.classList.add("form-settings");
    btnSet.textContent = "...";
    const btnWrap = document.createElement("div");
    btnWrap.classList.add("btn-wrapper");
    btnWrap.append(acceptBtn);
    btnWrap.append(cancelBtn);
    btnWrap.append(btnSet);
    form.append(inputText);
    form.append(btnWrap);
    this._form = form;
    this.inputText = inputText;
    return form;
  }
  get data() {
    const data = this.inputText.value;
    if (data === "") {
      return null;
    }
    this._form.reset();
    return data;
  }
  getError(elements) {
    const error = {
      valid: true
    };
    elements.some(el => {
      return Object.keys(ValidityState.prototype).some(key => {
        if (key === "valid") {
          return;
        }
        if (el.validity[key]) {
          error.message = this.errors[el.name][key];
          error.element = el;
          error.valid = false;
          return true;
        }
      });
    });
    return error;
  }
}
;// CONCATENATED MODULE: ./src/components/tooltip.js

class TooltipFactory {
  constructor() {
    this.tooltips = [];
    this.removeTooltip = this.removeTooltip.bind(this);
  }
  showTooltip(data) {
    const {
      form,
      element
    } = data;
    const tooltipEl = document.createElement("div");
    tooltipEl.classList.add("tooltip");
    element.append(form);
    const id = Math.ceil(performance.now());
    this.tooltips.push({
      element: form,
      id
    });
    form.addEventListener("click", e => {
      if (e.target.classList.contains("cancel-btn")) {
        this.removeTooltip(id);
      }
    });
    return id;
  }
  removeTooltip(id) {
    const tooltip = this.tooltips.find(el => el.id === id);
    tooltip.element.remove();
    this.tooltips = this.tooltips.filter(el => el.id !== id);
  }
  clearTooltips() {
    this.tooltips.forEach(el => el.element.remove());
  }
}
;// CONCATENATED MODULE: ./src/components/noteFactory.js

class NoteFactory {
  constructor(data) {
    const {
      task,
      form,
      tooltip,
      title
    } = data;
    this.taskType = task;
    this.formController = new form();
    this.tooltipController = new tooltip();
    const listWrap = document.createElement("div");
    listWrap.classList.add("list-wrapper");
    const listTitle = document.createElement("span");
    listTitle.classList.add("list-title");
    listTitle.textContent = title;
    const listSet = document.createElement("span");
    listSet.classList.add("list-settings");
    listSet.textContent = "...";
    const listHead = document.createElement("div");
    listHead.classList.add("list-header");
    listHead.append(listTitle);
    listHead.append(listSet);
    const list = document.createElement("ul");
    list.classList.add("list");
    const listBtn = document.createElement("span");
    listBtn.classList.add("list-footer");
    listBtn.classList.add("btn");
    listBtn.textContent = "+ Add another card";
    listWrap.append(listHead);
    listWrap.append(list);
    listWrap.append(listBtn);
    this.element = listWrap;
    this.list = list;
    this.btn = listBtn;
    this.onAddClick = this.onAddClick.bind(this);
    this.btn.addEventListener("click", this.onAddClick);
  }
  get note() {
    return this.element;
  }
  onAddClick(e) {
    const form = this.formController.form;
    const data = {
      form,
      element: this.list
    };
    const id = this.tooltipController.showTooltip(data);
    form.addEventListener("submit", e => this.addTask(e, id));
  }
  addTask(e, id) {
    e.preventDefault();
    const data = this.formController.data;
    this.tooltipController.removeTooltip(id);
    if (!data) return;
    const newTask = new this.taskType(data);
    this.list.append(newTask.task);
  }
}
;// CONCATENATED MODULE: ./src/js/app.js





const data = {
  parentName: "wrapper",
  task: Task,
  form: Form,
  tooltip: TooltipFactory,
  note: NoteFactory
};
const trello = new TrelloWidget(data);
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;