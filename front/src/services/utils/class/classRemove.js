const classRemove = (type, element, className) => {
  if (type === "tag") {
    if (document.getElementsByTagName(element)[0].classList.contains(className))
      document.getElementsByTagName(element)[0].classList.remove(className);
  } else if (type === "id") {
    if (document.getElementById(element).classList.contains(className))
      document.getElementById(element).classList.remove(className);
  } else if (type === "class") {
    if (
      document.getElementsByClassName(element)[0].classList.contains(className)
    )
      document.getElementsByClassName(element)[0].classList.remove(className);
  }
};

export default classRemove;
