const classToggle = (type, element, className) => {
  if (type === "tag") {
    document.getElementsByTagName(element)[0].classList.toggle(className);
  } else if (type === "id") {
    document.getElementById(element).classList.toggle(className);
  } else if (type === "class") {
    document.getElementsByClassName(element)[0].classList.toggle(className);
  }
};

export default classToggle;
