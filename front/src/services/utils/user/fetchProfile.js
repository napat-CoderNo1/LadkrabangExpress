import axios from "axios";

const fetchProfile = async () => {
  const port = 5000;
  const url = `http://localhost:${port}/api/user/showUserProfile`;

  const res = await axios.post(url, {
    token: JSON.parse(localStorage.getItem("user")).token,
  });

  sessionStorage.setItem("ticketList", JSON.stringify(res.data));
  return res.data;
};

export default fetchProfile;
