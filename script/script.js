const colorPalette = document.querySelectorAll(".color");

document.querySelector("#colorInput").addEventListener("input", (e) => {
  teste(e);
});

document.querySelector("#colorBoxInput").addEventListener("change", (e) => {
  teste(e);
  document.querySelector("label[for='colorBoxInput']").style.backgroundColor =
    e.target.value;
});

const inputSecondaryArray = document.querySelectorAll(".inputColorSecondary");

inputSecondaryArray.forEach((input) => {
  input.addEventListener("input", (e) => {
    input.closest(".color").style.backgroundColor = e.target.value;
  });
});

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

function createDegrade(e) {
  baseRgb = toRgb(e.target.value);
  const white = { r: 255, g: 255, b: 255 };
  let degrade = [];

  for (let i = 0; i < 4; i++) {
    const percent = i / 4;
    const r = Math.round(baseRgb.r + (white.r - baseRgb.r) * percent);
    const g = Math.round(baseRgb.g + (white.g - baseRgb.g) * percent);
    const b = Math.round(baseRgb.b + (white.b - baseRgb.b) * percent);

    degrade.push(toHex(r, g, b));
  }

  return degrade;
}

function teste(e) {
  const colortoadd = createDegrade(e);

  colorPalette.forEach((card, i) => {
    card.style.backgroundColor = colortoadd[i];
    card.querySelector("input").value = colortoadd[i];
  });
}
