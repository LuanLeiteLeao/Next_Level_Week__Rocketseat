import { Response, Request } from "express";
import knex from "../database/connection";

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.point_id")
      .whereIn("point_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    return response.json(points);
  }
  async show(request: Request, response: Response) {
    const { id } = request.params;
    const point = await knex("points").where("id", id).first();

    if (!point) {
      return response.status(400).json({ menssage: "Point not found." });
    }
    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id);

    return response.json({ point, items });
  }

  async create(request: Request, response: Response) {
    const trx = await knex.transaction();

    const {
      image,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const InsertIds = await trx("points").insert({
      image: "fake",
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    });

    const points_id = InsertIds[0];
    const pointsItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id: points_id,
      };
    });

    await trx("point_items").insert(pointsItems);
    await trx.commit();

    return response.json({ success: true });
  }
}

export default PointsController;
