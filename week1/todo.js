var btn = document.querySelector(".submit");
var remove = document.querySelector(".draggable");
var listItems = [];
var dragItem = "";
var dropItem = "";

function dragStart(e) {
  console.log("dragStart");
  console.log(e.srcElement.dataset.id);
  dragItem = e.srcElement.dataset.id;
  this.style.opacity = "0.4";
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

function dragEnter(e) {
  this.classList.add("over");
}

function dragLeave(e) {
  e.stopPropagation();
  this.classList.remove("over");
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  return false;
}

function dragDrop(e) {
  console.log("dragDrop");
  console.log(e.target.dataset.id);
  dropItem = e.target.dataset.id;

  if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData("text/html");
  }

  return false;
}

function dragEnd(e) {
  console.log("dragEnd");
  var listIts = document.querySelectorAll(".draggable");
  [].forEach.call(listIts, function (item) {
    item.classList.remove("over");
  });
  this.style.opacity = "1";
  if (dragItem !== dropItem && dragItem !== "") {
    console.log("dragItem, dropItem", dragItem, dropItem);
    var dragItemIndex = listItems.findIndex((item) => item.id == dragItem);
    var dropItemIndex = listItems.findIndex((item) => item.id == dropItem);
    console.log("dragItemIndex , dropItemIndex", dragItemIndex, dropItemIndex);
    [listItems[dragItemIndex], listItems[dropItemIndex]] = [
      listItems[dropItemIndex],
      listItems[dragItemIndex],
    ];
    localStorage.setItem("todoLists", JSON.stringify(listItems));
    renderList(listItems);
  }
}

function addEventsDragAndDrop(el) {
  el.addEventListener("dragstart", dragStart, false);
  el.addEventListener("dragenter", dragEnter, false);
  el.addEventListener("dragover", dragOver, false);
  el.addEventListener("dragleave", dragLeave, false);
  el.addEventListener("drop", dragDrop, false);
  el.addEventListener("dragend", dragEnd, false);
}

var listIts = document.querySelectorAll(".draggable");
[].forEach.call(listIts, function (item) {
  addEventsDragAndDrop(item);
});

function renderItem(item) {
  document.getElementById("content").value = "";
  document.getElementById("createdAt").value = "";

  var listItem = document.getElementById("list-item");

  var div = document.createElement("div");
  var attr = document.createAttribute("draggable");

  div.className = "draggable";
  div.dataset.id = item.id;
  attr.value = "true";
  div.setAttributeNode(attr);

  var text = document.createElement("div");
  text.appendChild(document.createTextNode(item.content));
  var find = listItems.filter((ele) => ele.id === item.id);
  if (find.length > 0) {
    if (find[0].complete) {
      // div.className = "draggable draggable-complete";
      div.style.backgroundColor = "#90ee90";
      text.className = "text-complete";
    } else {
      // div.className = "draggable";
      div.style.backgroundColor = "#e0ffff";
      text.className = "text-incomplete";
    }
  }

  var createdAt = document.createElement("div");
  createdAt.className = "created-at";
  createdAt.appendChild(document.createTextNode(item.createdAt));

  var action = document.createElement("i");
  action.className = "fa fa-trash";

  action.addEventListener("click", function () {
    var find = listItems.filter((ele) => ele.id === item.id);
    if (find.length > 0) {
      listItems = listItems.filter((ele) => ele.id !== item.id);
      localStorage.setItem("todoLists", JSON.stringify(listItems));
      renderList(listItems);
    }
  });

  var rightDiv = document.createElement("div");
  rightDiv.className = "right-div";

  rightDiv.appendChild(createdAt);
  rightDiv.appendChild(action);

  div.appendChild(text);
  div.appendChild(rightDiv);

  div.addEventListener("click", () => {
    var find = listItems.filter((ele) => ele.id === item.id);
    if (find.length > 0) {
      if (!find[0].complete) {
        // div.className = "draggable draggable-complete";
        div.style.backgroundColor = "#90ee90";
        text.className = "text-complete";
      } else {
        // div.className = "draggable";
        div.style.backgroundColor = "#e0ffff";
        text.className = "text-incomplete";
      }
      listItems = listItems.map((ele) => {
        if (ele.id === item.id) {
          return {
            ...ele,
            complete: !ele.complete,
          };
        }
        return ele;
      });
      localStorage.setItem("todoLists", JSON.stringify(listItems));
    }
  });

  listItem.appendChild(div);

  addEventsDragAndDrop(div);
}

function renderList(items) {
  var listItem = document.getElementById("list-item");

  listItem.innerHTML = "";

  for (let index = 0; index < items.length; index++) {
    if (items[index].content !== "") {
      renderItem(items[index]);
    }
  }
}

function compare(a, b) {
  if (Number(a.timestamp) > Number(b.timestamp)) {
    return -1;
  }
  if (Number(a.timestamp) < Number(b.timestamp)) {
    return 1;
  }
  return 0;
}

function handleAdd() {
  var newItemText = document.getElementById("content").value;
  var newItemCreatedAt = document.getElementById("createdAt").value || "";
  if (newItemText != "") {
    const timestamp =
      newItemCreatedAt !== ""
        ? new Date(newItemCreatedAt).getTime()
        : new Date().getTime();
    listItems.push({
      content: newItemText,
      createdAt:
        newItemCreatedAt !== ""
          ? new Date(newItemCreatedAt).getMonth() +
            "/" +
            new Date(newItemCreatedAt).getDate() +
            "/" +
            new Date(newItemCreatedAt).getFullYear() +
            ", " +
            new Intl.DateTimeFormat("default", {
              hour12: true,
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            }).format(new Date(newItemCreatedAt))
          : "",
      timestamp:
        newItemCreatedAt !== "" ? new Date(newItemCreatedAt).getTime() : 0,
      complete: false,
      id: timestamp,
    });
  }
  listItems.sort(compare);
  localStorage.setItem("todoLists", JSON.stringify(listItems));
  renderList(listItems);
}

btn.addEventListener("click", handleAdd);

function renderListInLocalStorage() {
  var listInLocalStorage = JSON.parse(localStorage.getItem("todoLists"));
  if (listInLocalStorage && listInLocalStorage.length > 0) {
    listItems = listInLocalStorage;
    console.log(listItems);
    renderList(listItems);
  }
}

renderListInLocalStorage();
