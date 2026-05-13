const display = document.getElementById("display");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const clearButton = document.querySelector("[data-clear]");
const equalsButton = document.querySelector("[data-equals]");

let currentInput = "";

// Add numbers
numberButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentInput += button.textContent;
    display.value = currentInput;
  });
});

// Add operators
operatorButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentInput += button.textContent;
    display.value = currentInput;
  });
});

// Clear
clearButton.addEventListener("click", () => {
  alert("page has been reset")
  currentInput = "";
  display.value = "";
});

// Equals
equalsButton.addEventListener("click", () => {
  try {
    let result = eval(currentInput);

    if (result % 100 === 0) {
      currentInput = result.toString();
    }else {
      let pakingAnswer = result + Math.floor(Math.random() * 50) + 10;
      currentInput = pakingAnswer.toString();
    }
    // currentInput = eval(currentInput).toString();
    display.value = currentInput;
  } catch {
    display.value = "Error";
    currentInput = "";
  }
});