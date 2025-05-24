function createImages(array) {
  const functions = [createFrame, createSpiral];

  functions.forEach((fn) => fn(...array));
}
createImages(["#006ed6", "#4092e0", "#80b7eb", "#ccc"]);

const setColors = (color1, color2, color3) => {
  document.documentElement.style.setProperty("--cor-primaria", color1);
  document.documentElement.style.setProperty("--cor-secundaria", color2);
  document.documentElement.style.setProperty("--cor-terciaria", color3);
};

function toHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function toRgb(hex) {
  hex = hex.replace("#", "");
  const rgbNum = parseInt(hex, 16);

  return {
    r: (rgbNum >> 16) & 255,
    g: (rgbNum >> 8) & 255,
    b: rgbNum & 255,
  };
}

function createPalette(inputValue) {
  const cardQnt = document.querySelectorAll(".color").length;
  baseRgb = toRgb(inputValue);
  const white = { r: 255, g: 255, b: 255 };
  let palette = [];

  console.log(cardQnt);

  for (let i = 0; i < cardQnt; i++) {
    const percent = i / cardQnt;
    const r = Math.round(baseRgb.r + (white.r - baseRgb.r) * percent);
    const g = Math.round(baseRgb.g + (white.g - baseRgb.g) * percent);
    const b = Math.round(baseRgb.b + (white.b - baseRgb.b) * percent);

    palette.push(toHex(r, g, b));
  }

  return palette;
}

const colorPalette = document.querySelectorAll(".color");
function addPallet(inputValue) {
  const colorArray = createPalette(inputValue);

  colorPalette.forEach((card, i) => {
    card.style.backgroundColor = colorArray[i];
    card.querySelector("input").value = colorArray[i];
  });

  createImages(colorArray);
  setColors(...colorArray);
}

const linearBox = document.querySelector(".linearBox");
function linear() {
  const colors = Array.from(document.querySelectorAll(".inputColorSecondary"))
    .map((input) => {
      return input.value;
    })
    .join(", ");

  linearBox.style.display = "flex";
  linearBox.style.backgroundImage = "linear-gradient(90deg, " + colors + ")";
}

function copyText(btn) {
  const input = btn.previousElementSibling;
  if (navigator.clipboard.writeText(input.value)) {
    btn.classList.add("copied");
    btn.textContent = "Copiado!";
    btn.disabled = true;

    setTimeout(() => {
      btn.classList.remove("copied");
      btn.textContent = "Copiar";
      btn.disabled = false;
    }, 1200);
    console.log("Copiado");
  }
}

function createFrame(c1, c2, c3, c4) {
  const ctx = document.querySelector("#quadro").getContext("2d");
  ctx.clearRect(0, 0, 300, 300);
  ctx.fillStyle = c1;
  ctx.fillRect(0, 0, 300, 300);
  ctx.fillStyle = c2;
  ctx.beginPath();
  ctx.arc(150, 150, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = c3;
  ctx.fillRect(120, 120, 60, 60);

  console.log(c4);
}

function createSpiral(c1, c2, c3, c4) {
  const ctx = document.querySelector("#spiral").getContext("2d");
  const grad = ctx.createRadialGradient(200, 100, 10, 200, 100, 200);
  grad.addColorStop(0, c1);
  grad.addColorStop(0.5, c2);
  grad.addColorStop(1, c3);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 400, 200);
}

const colorInput = document.querySelector("#colorInput");
colorInput.addEventListener("input", (e) => {
  addPallet(e.target.value);
});

const colorBoxInput = document.querySelector("#colorBoxInput");
colorBoxInput.addEventListener("change", (e) => {
  addPallet(e.target.value);

  const colorBoxInputLabel = document.querySelector(
    "label[for='colorBoxInput']"
  );

  colorBoxInputLabel.style.backgroundColor = e.target.value;
  colorInput.value = e.target.value;
});

const inputSecondaryArray = document.querySelectorAll(".inputColorSecondary");
inputSecondaryArray.forEach((input) => {
  input.addEventListener("input", (e) => {
    input.closest(".color").style.backgroundColor = e.target.value;

    let newArray = Array.from(inputSecondaryArray).map((x) => x.value);

    createImages(newArray);
  });
});

const linearInput = document.querySelector("#degradeInputChoosing");
let lastChecked = null;

linearInput.addEventListener("click", (e) => {
  if (lastChecked === e.target) {
    linearInput.checked = false;
    lastChecked = null;
    colorInput.removeEventListener("input", linear);
    colorBoxInput.removeEventListener("change", linear);
    linearBox.style.display = "none";
  } else {
    lastChecked = e.target;
    colorInput.addEventListener("input", linear);
    colorBoxInput.addEventListener("change", linear);
    linearBox.style.display = "flex";
    linear();
  }
});

const copyBtn = document.querySelectorAll(".copyButton");

copyBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    copyText(btn);
  });
});
