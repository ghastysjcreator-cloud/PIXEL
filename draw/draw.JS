let paintAll = document.querySelector(".paint-all");

let clear = document.querySelector(".clear");
//true/false
let IS_CLICKED = false;
let FILL_MODE = false;

let field = document.querySelector(".field");

//colors
let red = document.querySelector(".red");
let black = document.querySelector(".black");
let green = document.querySelector(".green");
let blue = document.querySelector(".blue");
let yellow = document.querySelector(".yellow");
let purple = document.querySelector(".purple");
let brown = document.querySelector(".brown");
let pink = document.querySelector(".pink");
let erase = document.querySelector(".erase");
let color = "black";

document.addEventListener("mousedown", function () {
  IS_CLICKED = true;
});
document.addEventListener("mouseup", function () {
  IS_CLICKED = false;
});
const maxFields = 1000;
for (let i = 0; i < maxFields; i++) {
  let cell = document.createElement("div");
  cell.classList.add("cell");
  cell.setAttribute("id", `${i}`);
  field.appendChild(cell);
}
const buttons = document.querySelectorAll(".cell");
console.log(maxFields);
console.log(document.querySelectorAll(".cell").length);
clear.addEventListener("click", () => {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.backgroundColor = "white";
  }
});
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
erase.addEventListener("click", () => {
  color = "white";
});
paintAll.addEventListener("click", () => {
  FILL_MODE = true;
  const borderColor = color === "black" ? "white" : "black";
  for (let i = 0; i < buttons.length; i++) {
    if (color === "green") {
      anime({
        targets: document.querySelectorAll(".cell"),
        backgroundColor: [buttons[i].style.backgroundColor, "#008000"],
        duration: 2.5 * 1000,
        easing: "easeInOutQuad",
      });
    } else if (color === "blue") {
      anime({
        targets: document.querySelectorAll(".cell"),
        backgroundColor: [buttons[i].style.backgroundColor, "#0000FF"],
        duration: 2.5 * 1000,
        easing: "easeInOutQuad",
      });
    } else if (color === "yellow") {
      anime({
        targets: document.querySelectorAll(".cell"),
        backgroundColor: [buttons[i].style.backgroundColor, "#FFEA00"],
        duration: 2.5 * 1000,
        easing: "easeInOutQuad",
      });
    } else if (color === "purple") {
      anime({
        targets: document.querySelectorAll(".cell"),
        backgroundColor: [buttons[i].style.backgroundColor, "#800080"],
        duration: 2.5 * 1000,
        easing: "easeInOutQuad",
      });
    } else if (color === "brown") {
      anime({
        targets: document.querySelectorAll(".cell"),
        backgroundColor: [buttons[i].style.backgroundColor, "#A52A2A"],
        duration: 2.5 * 1000,
        easing: "easeInOutQuad",
      });
    } else if (color === "pink") {
      anime({
        targets: document.querySelectorAll(".cell"),
        backgroundColor: [buttons[i].style.backgroundColor, "#FFC0CB"],
        duration: 2.5 * 1000,
        easing: "easeInOutQuad",
      });
    } else if (color === "red") {
      anime({
        targets: document.querySelectorAll(".cell"),
        backgroundColor: [buttons[i].style.backgroundColor, "#FF0000"],
        duration: 2.5 * 1000,
        easing: "easeInOutQuad",
      });
    } else {
      anime({
        targets: document.querySelectorAll(".cell"),
        borderColor : ["none",buttons[i].style.border = `1px solid ${borderColor}`],
        backgroundColor: [buttons[i].style.backgroundColor, "#000000"],
        duration: 2.5 * 1000,
        easing: "easeInOutQuad",
      });
    }
  }
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
