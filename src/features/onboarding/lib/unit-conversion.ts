export function convertLength(value: number, from: "CM" | "IN", to: "CM" | "IN") {
  if (from === to) {
    return value;
  }

  return to === "CM" ? value * 2.54 : value / 2.54;
}

export function convertWeight(value: number, from: "KG" | "LB", to: "KG" | "LB") {
  if (from === to) {
    return value;
  }

  return to === "KG" ? value / 2.2046226218 : value * 2.2046226218;
}

export function roundMeasurement(value: number) {
  return Number(value.toFixed(1));
}
