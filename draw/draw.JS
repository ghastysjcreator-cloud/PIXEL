let paintAll = document.querySelector(".paint-all");
let clear = document.querySelector(".clear");

let IS_CLICKED = false;
let FILL_MODE = false;
let maxFields = 1000;

let workspace = document.querySelector(".workspace");
let field = workspace.querySelector(".field");

let red = document.querySelector(".red");
let black = document.querySelector(".black");
let green = document.querySelector(".green");
let blue = document.querySelector(".blue");
let yellow = document.querySelector(".yellow");
let purple = document.querySelector(".purple");
let brown = document.querySelector(".brown");
let pink = document.querySelector(".pink");
let erase = document.querySelector(".erase");

let color = "white";
let cells = [];

red.addEventListener("click", () => {
  color = "red";
});
black.addEventListener("click", () => {
  color = "black";
});
green.addEventListener("click", () => {
  color = "green";
});
blue.addEventListener("click", () => {
  color = "blue";
});
yellow.addEventListener("click", () => {
  color = "yellow";
});
purple.addEventListener("click", () => {
  color = "purple";
});
brown.addEventListener("click", () => {
  color = "brown";
});
pink.addEventListener("click", () => {
  color = "pink";
});

document.addEventListener("pointerdown", function () {
  IS_CLICKED = true;
});

document.addEventListener("pointerup", function () {
  IS_CLICKED = false;
});
for (let i = 0; i < maxFields; i++) {
  let cell = document.createElement("div");
  cell.classList.add("cell");
  cell.setAttribute("id", `${i}`);
  field.appendChild(cell);
  cells.push(cell);

  cell.addEventListener("pointerdown", function () {
      if (targetColor === "white") {
        cell.style.borderColor = "#000000";
        cell.style.backgroundColor = "ffffff";
      } else if (targetColor === "black") {
        cell.style.backgroundColor = "black";
      } else {
        cell.style.borderColor = "#000000";
        cell.style.backgroundColor = color;
      }
  });

  cell.addEventListener("pointerenter", function () {
    if (IS_CLICKED) {
      cell.style.backgroundColor = color;
      if(color == "white") {
        cell.style.borderColor = "#000000";
      } else if(color != "white") {
        cell.style.borderColor = "#000000";
      }
    }
  });
}

const buttons = document.querySelectorAll(".cell");
console.log(maxFields);
console.log(document.querySelectorAll(".cell").length);

clear.addEventListener("click", function () {
  FILL_MODE = false;
  for (let i = 0; i < cells.length; i++) {
    cells[i].style.backgroundColor = "white";
    cells[i].style.borderColor = "#000000";
  }
});

erase.addEventListener("click", function () {
  color = "white";
});

paintAll.addEventListener("click", function () {
  FILL_MODE = true;
  let targetColor = color;
  let borderColor = "#000000";
  if (targetColor === "white") {
    targetColor = "white";
    borderColor = "#000000";
  } else if (targetColor === "black") {
    targetColor = "black";
  } else {
    targetColor = color;
  }

  anime({
    targets: cells,
    backgroundColor: targetColor,
    duration: 1200,
    easing: "easeInOutQuad",
    complete: function () {
      for (let i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = targetColor;
        cells[i].style.borderColor = borderColor;
      }
    },
  });
});

// const colorBefore = "white";
// anime({
//   targets: document.querySelector(".cell"),
//   backgroundColor: ["#FFFFFF", "#008000"],
//   duration: 2.5 * 1000,
//   easing: "easeInOutQuad",
//   begin: () => console.log(document.querySelector(".cell").style.backgroundColor),
//   complete: () => {
//     console.log("Анимация завершена для элемента:");
//     console.log(document.querySelector(".cell").style.backgroundColor);
//   },
// });
