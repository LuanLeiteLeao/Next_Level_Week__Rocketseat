import express from "express";
const routers = express.Router();

routers.get("/", (request, response) => {
  return response.json({ message: "Hello World" });
});

export default routers;
