const { ipcRenderer } = require("electron");

const resetButton = document.getElementById("resetButton");
const loadingDiv = document.getElementById("loading");
const successMessage = document.getElementById("successMessage");
const finishButton = document.getElementById("finishButton");

resetButton.addEventListener("click", () => {
  resetButton.style.display = "none";
  loadingDiv.classList.remove("hidden");

  // Send a request to perform the reset
  ipcRenderer.invoke("perform-reset").then((result) => {
    setTimeout(() => {
      loadingDiv.classList.add("hidden");
      successMessage.classList.remove("hidden");
    }, 2000); // Simulated 2-second delay
  }).catch((error) => {
    console.error("Reset failed:", error);
  });
});

finishButton.addEventListener("click", () => {
  ipcRenderer.send("close-app");
});
