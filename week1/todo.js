var btn = document.querySelector(".submit");
var remove = document.querySelector(".draggable");
var listItems = [];

function dragStart(e) {
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
  if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData("text/html");
  }
  return false;
}

function dragEnd(e) {
  var listItens = document.querySelectorAll(".draggable");
  [].forEach.call(listItens, function (item) {
    item.classList.remove("over");
  });
  this.style.opacity = "1";
}

function addEventsDragAndDrop(el) {
  el.addEventListener("dragstart", dragStart, false);
  el.addEventListener("dragenter", dragEnter, false);
  el.addEventListener("dragover", dragOver, false);
  el.addEventListener("dragleave", dragLeave, false);
  el.addEventListener("drop", dragDrop, false);
  el.addEventListener("dragend", dragEnd, false);
}

var listItens = document.querySelectorAll(".draggable");
[].forEach.call(listItens, function (item) {
  addEventsDragAndDrop(item);
});

function renderItem(item) {
  document.getElementById("content").value = "";
  var listItem = document.getElementById("list-item");

  var div = document.createElement("div");

  var attr = document.createAttribute("draggable");

  div.className = "draggable";
  attr.value = "true";
  div.setAttributeNode(attr);

  var text = document.createElement("div");
  text.appendChild(document.createTextNode(item.content));

  var createdAt = document.createElement("div");
  createdAt.className = "created-at";
  createdAt.appendChild(document.createTextNode(item.createdAt));

  var action = document.createElement("i");
  action.className = "fa fa-trash";

  action.onclick = function () {
    var find = listItems.filter((ele) => ele.id === item.id);
    if (find.length > 0) {
      listItems = listItems.filter((ele) => ele.id !== item.id);
      renderList(listItems);
    }
  };

  var rightDiv = document.createElement("div");
  rightDiv.className = "right-div";

  rightDiv.appendChild(createdAt);
  rightDiv.appendChild(action);

  div.appendChild(text);
  div.appendChild(rightDiv);

  div.addEventListener("click", () => {
    console.log("dsdsds");
    console.log(listItems);
    var find = listItems.filter((ele) => ele.id === item.id);
    if (find.length > 0) {
      if (!find[0].complete) {
        div.className = "draggable-complete";
        text.className = "text-complete";
      } else {
        div.className = "draggable";
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

function addNewItem() {
  var newItemText = document.getElementById("content").value;
  var newItemCreatedAt = document.getElementById("createdAt").value || "";
  if (newItemText != "") {
    const timestamp =
      newItemCreatedAt !== ""
        ? new Date(newItemCreatedAt).getTime()
        : new Date().getTime();
    listItems.push({
      content: newItemText,
      createdAt: newItemCreatedAt,
      timestamp:
        newItemCreatedAt !== "" ? new Date(newItemCreatedAt).getTime() : 0,
      complete: false,
      id: timestamp,
    });
  }
  listItems.sort(compare);
  renderList(listItems);
}

var list = document.getElementById("list-item");

btn.addEventListener("click", addNewItem);
