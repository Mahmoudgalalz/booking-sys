/**
 * Validate required fields
 */
export function validateRequired(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return "This field is required";
  }
  return undefined;
}

/**
 * Validate email format
 */
export function validateEmail(value: unknown) {
  if (typeof value !== "string") {
    return "Invalid email format";
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return "Invalid email format";
  }
  
  return undefined;
}

/**
 * Validate password strength
 */
export function validatePassword(value: unknown) {
  if (typeof value !== "string") {
    return "Invalid password format";
  }
  
  if (value.length < 8) {
    return "Password must be at least 8 characters";
  }
  
  return undefined;
}
