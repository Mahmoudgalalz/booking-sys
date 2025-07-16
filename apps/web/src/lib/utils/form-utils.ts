import { FieldApi, useForm } from "@tanstack/react-form";

/**
 * Custom error display component for form fields
 */
export function FieldError({ field }: { field: FieldApi<any, any, any, any> }) {
  return field.state.meta.touchedErrors ? (
    <div className="text-sm text-red-500">{field.state.meta.touchedErrors}</div>
  ) : null;
}

/**
 * Create a form with default configuration
 */
export function createForm<TValues>(config: Parameters<typeof useForm<TValues>>[0]) {
  return useForm<TValues>({
    ...config,
    defaultValues: config.defaultValues,
  });
}

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
