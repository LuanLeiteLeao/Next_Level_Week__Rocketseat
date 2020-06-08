import express, { request, response } from "express";
import knex from "./database/connection";
import PointsController from "./controller/PointsController";

const routers = express.Router();
const pointsController = new PointsController();

//index , show, create , update, delete

routers.get("/items", async (request, response) => {
  const items = await knex("items").select("*");

  const serializedItems = items.map((item) => {
    return {
      id: item.id,
      title: item.title,
      imagens_url: "httl:title//localhost:3333/uploads/${item.image}",
    };
  });

  return response.json(serializedItems);
});

routers.post("/points", pointsController.create);
routers.get("/points/:id", pointsController.show);
routers.get("/points", pointsController.index);
export default routers;
