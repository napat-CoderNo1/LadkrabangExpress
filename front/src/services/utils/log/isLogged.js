const isLogged = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default isLogged;
