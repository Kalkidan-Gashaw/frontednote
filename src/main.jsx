import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Modal from "react-modal";

// Get a reference to the root element in your HTML
const rootElement = document.getElementById("root");

if (rootElement) {
  // Set the app element for react-modal
  Modal.setAppElement(rootElement);

  // Create a root and render your app
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("Could not find the root element.");
}
