function toRgb(hex) {
  hex = hex.replace("#", "");
  const rgbNum = parseInt(hex, 16);

  return {
    r: (rgbNum >> 16) & 255,
    g: (rgbNum >> 8) & 255,
    b: rgbNum & 255,
  };
}

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
    linear();

    colorInput.removeEventListener("input", linear);
    colorBoxInput.removeEventListener("change", linear);
    linearBox.style.display = "none";
  } else {
    lastChecked = e.target;

    colorInput.addEventListener("input", linear);

    colorBoxInput.addEventListener("change", linear);

    linear();
    linearBox.style.display = "flex";
  }
});

const copyBtn = document.querySelectorAll(".copyButton");

copyBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    copyText(btn);
  });
});
