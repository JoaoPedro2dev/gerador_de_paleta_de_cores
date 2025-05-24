function createImages(array) {
  const functions = [createFrame, createSpiral];

  functions.forEach((fn) => fn(...array));
}
createImages(["#006ed6", "#4092e0", "#80b7eb", "#ccc", "#80b7eb", "#bfdbf5  "]);

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
function addPalette(inputValue) {
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
  }
}

function createFrame(c1, c2, c3, c4, c5, c6) {
  const ctx = document.querySelector("#quadro").getContext("2d");
  ctx.clearRect(0, 0, 300, 300);

  const grad = ctx.createLinearGradient(0, 0, 300, 300);
  grad.addColorStop(0, c1);
  grad.addColorStop(0.5, c2);
  grad.addColorStop(1, c3);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 300, 300);

  ctx.save();
  ctx.shadowColor = c4;
  ctx.shadowBlur = 20;
  ctx.fillStyle = c4;
  ctx.beginPath();
  ctx.arc(150, 150, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(150, 150);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = c5;
  ctx.fillRect(-40, -40, 80, 80);
  ctx.restore();

  ctx.strokeStyle = c6;
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 280, 280);
}

function lerpColor(colorA, colorB, t) {
  return {
    r: Math.round(colorA.r + (colorB.r - colorA.r) * t),
    g: Math.round(colorA.g + (colorB.g - colorA.g) * t),
    b: Math.round(colorA.b + (colorB.b - colorA.b) * t),
  };
}

function createSpiral(c1, c2, c3, c4, c5, c6) {
  const canvas = document.querySelector("#spiral");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const color1 = toRgb(c1);
  const color2 = toRgb(c2);
  const color3 = toRgb(c3);
  const color4 = toRgb(c4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - width / 2;
      const dy = y - height / 2;
      const radius =
        Math.sqrt(dx * dx + dy * dy) / (Math.min(width, height) / 2);
      let angle = Math.atan2(dy, dx);

      let angleNorm = angle / (2 * Math.PI) + 0.5;

      const colorRadius = lerpColor(color1, color2, radius);

      const colorAngle = lerpColor(color3, color4, angleNorm);

      const r = Math.round((colorRadius.r + colorAngle.r) / 2);
      const g = Math.round((colorRadius.g + colorAngle.g) / 2);
      const b = Math.round((colorRadius.b + colorAngle.b) / 2);

      const index = (y * width + x) * 4;
      data[index] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

const enterBtn = document.querySelector("#enterBtn");
const colorInput = document.querySelector("#colorInput");

enterBtn.addEventListener("click", () => {
  addPalette(colorInput.value);
});

const colorBoxInput = document.querySelector("#colorBoxInput");
colorBoxInput.addEventListener("change", (e) => {
  addPalette(e.target.value);
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
    enterBtn.removeEventListener("click", linear);
    colorBoxInput.removeEventListener("change", linear);
    linearBox.style.display = "none";
  } else {
    lastChecked = e.target;
    enterBtn.addEventListener("click", linear);
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
