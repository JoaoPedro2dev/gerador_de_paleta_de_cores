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
  baseRgb = toRgb(inputValue);
  const white = { r: 255, g: 255, b: 255 };
  let palette = [];

  for (let i = 0; i < 4; i++) {
    const percent = i / 4;
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

  createFrame(...colorArray);
  createWeb(...colorArray);
  createSpiral(...colorArray);
  createLandscape(...colorArray);
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

//CANVAS JavaScript

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

function createWeb(c1, c2, c3, c4) {
  const ctx = document.querySelector("#web").getContext("2d");
  ctx.clearRect(0, 0, 300, 300);
  ctx.fillStyle = c1;
  ctx.fillRect(0, 0, 300, 60);
  ctx.fillStyle = c2;
  ctx.fillRect(20, 80, 260, 40);
  ctx.fillStyle = c3;
  ctx.fillRect(20, 140, 120, 120);
  ctx.fillRect(160, 140, 120, 120);
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

function createLandscape(c1, c2, c3, c4) {
  const ctx = document.querySelector("#landscape").getContext("2d");
  ctx.clearRect(0, 0, 400, 700);
  ctx.fillStyle = c3; // céu
  ctx.fillRect(0, 0, 400, 500);
  ctx.fillStyle = c2; // Montanha
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.lineTo(100, 80);
  ctx.lineTo(200, 200);
  ctx.fill();
  ctx.fillStyle = c1; //Chão
  ctx.fillRect(0, 140, 800, 200);
}

createFrame("#006ed6", "#4092e0", "#80b7eb", "#ccc");
createWeb("#006ed6", "#4092e0", "#80b7eb", "#ccc");
createSpiral("#006ed6", "#4092e0", "#80b7eb", "#ccc");
createLandscape("#006ed6", "#4092e0", "#80b7eb", "#ccc");

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

//Saturação

const saturationColor = document.querySelector("#saturationInput");

function rgbToHsl(r, g, b) {
  r /= 255;
  b /= 255;
  g /= 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);

  let h,
    s,
    l = (max, min) / 2;

  if (max == min) {
    h = s = 0; //Avromatico
  } else {
    const d = max - min;

    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < h ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return { h, s, l };
}

function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // Acromático
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t++;
      if (t > 1) t--;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * 1 - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    h: Math.round(b * 255),
  };
}
