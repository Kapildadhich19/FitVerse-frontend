export const genderOptions = [
  { value: "FEMALE", label: "Female" },
  { value: "MALE", label: "Male" },
  { value: "NON_BINARY", label: "Non-binary" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" }
] as const;

export const lengthUnitOptions = [
  { value: "CM", label: "Centimeters" },
  { value: "IN", label: "Inches" }
] as const;

export const weightUnitOptions = [
  { value: "KG", label: "Kilograms" },
  { value: "LB", label: "Pounds" }
] as const;

export const skinToneOptions = ["Porcelain", "Fair", "Light", "Medium", "Olive", "Tan", "Deep", "Rich"] as const;
export const hairColorOptions = ["Black", "Brown", "Blonde", "Auburn", "Red", "Gray", "White", "Other"] as const;
export const hairStyleOptions = ["Buzz cut", "Short", "Medium", "Long", "Curly", "Coily", "Bald", "Covered"] as const;
export const eyeColorOptions = ["Brown", "Black", "Blue", "Green", "Hazel", "Gray", "Amber"] as const;
export const facialHairOptions = ["None", "Stubble", "Mustache", "Goatee", "Short beard", "Full beard"] as const;
export const bodyTypeOptions = ["Straight", "Athletic", "Curvy", "Broad", "Petite", "Plus", "Tall"] as const;

export const clothingFitOptions = [
  { value: "SLIM", label: "Slim" },
  { value: "REGULAR", label: "Regular" },
  { value: "RELAXED", label: "Relaxed" },
  { value: "OVERSIZED", label: "Oversized" }
] as const;
