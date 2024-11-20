// src/utils/authUtils.ts

export const logout = () => {
  // Remove the user from localStorage
  localStorage.removeItem("user");

  // Redirect to the login page
  window.location.href = "/"; // or use a routing method
};
