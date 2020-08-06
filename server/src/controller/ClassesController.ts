import { Request, Response, response } from "express";

import db from "../database/connection";
import convertTimeToMinutes from "../utils/convertTimeToMinutes";

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
  async index(req: Request, res: Response) {
    const filters = req.query;

    const subject = filters.subject as string;
    const week_day = filters.week_day as string;
    const time = filters.time as string;

    if (!week_day || !subject || !time) {
      return response.status(400).json({
        error: "Missing filters to search classes",
      });
    }

    const timeInMinutes = convertTimeToMinutes(time);

    const classes = await db("classes")
      .whereExists(function () {
        this.select("class_schedule.*")
          .from("class_schedule")
          .whereRaw("`class_schedule`.`class_id` = `classes`.`id`")
          .whereRaw("`class_schedule`.`week_day` = ??", [Number(week_day)])
          .whereRaw("`class_schedule`.`from` <= ??", [timeInMinutes])
          .whereRaw("`class_schedule`.`to` > ??", [timeInMinutes]);
      })
      .where("classes.subject", "=", subject)
      .join("users", "classes.user_id", "=", "users.id")
      .select(["classes.*", "users.*"]);

    res.json(classes);
  }

  async store(req: Request, res: Response) {
    const {
      name,
      avatar,
      whatsapp,
      biography,
      subject,
      cost,
      schedule,
    } = req.body;

    const trx = await db.transaction();

    try {
      const insertedUsersIds = await trx("users").insert({
        name,
        avatar,
        whatsapp,
        biography,
      });

      const user_id = insertedUsersIds[0];

      const insertedClassesIds = await trx("classes").insert({
        subject,
        cost,
        user_id,
      });

      const class_id = insertedClassesIds[0];

      const classSchedule = schedule.map((item: ScheduleItem) => {
        return {
          class_id,
          week_day: item.week_day,
          from: convertTimeToMinutes(item.from),
          to: convertTimeToMinutes(item.to),
        };
      });

      await trx("class_schedule").insert(classSchedule);

      await trx.commit();

      return res.status(201).send();
    } catch (err) {
      await trx.rollback();

      console.log(err);

      return res.status(500).json({
        error: "Unexpected error while creating new class",
      });
    }
  }
}
