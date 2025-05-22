const colorPalette = document.querySelectorAll(".color");

document.querySelector("#colorInput").addEventListener("input", (e) => {
  changeColor(e);
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

function changeColor(e) {
  value = e.target.value;

  let color = [];

  const colorBase = value;

  colorPalette.forEach((card) => {
    card.style.backgroundColor = value;
  });

  console.log(value);
}

// console.log("RGB " + toRgb("#f2f2f2"));
console.log("HEX " + toHex(242, 242, 242));
