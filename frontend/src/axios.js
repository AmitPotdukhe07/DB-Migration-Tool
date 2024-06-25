import axios from "axios";

const customAxios = axios.create({
    baseURL: "http://localhost:5000",
    // baseURL: "https://dj-indianjwelery-backend.onrender.com/",
});

export default customAxios;
