let lightMode = localStorage.getItem("lightMode");

const lightModeToggleButton = document.querySelector(".button__switch");

const enableLightMode = () => {
  document.body.classList.add("lightMode");
  localStorage.setItem("lightMode", "enabled");
};

const disableLightMode = () => {
  document.body.classList.remove("lightMode");
  localStorage.setItem("lightMode", null);
};

if (lightMode === "enabled") {
    enableLightMode()
}

lightModeToggleButton.addEventListener("click", () => {
    lightMode = localStorage.getItem("lightMode");
    if (lightMode !== 'enabled') {
        enableLightMode();
    } else {
        disableLightMode();
    }
});

const listsContainer = document.querySelector('.lists-container');
const container = document.querySelector('.button-left-container');
 const containerHandler = () => {
    container.appendChild(listsContainer);
 }
 if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  containerHandler();
  }
