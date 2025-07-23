import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { students } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";

const studentsRouter = new Hono();

studentsRouter.get("/", async (c) => {
  const allStudent = await drizzle.select().from(students);
  return c.json(allStudent);
});

studentsRouter.get("/:studentId", async (c) => {
  const id = c.req.param("studentId");
  const result = await drizzle.query.students.findFirst({
    where: eq(students.studentId, id),
  });
  if (!result) {
    return c.json({ error: "Not found" }, 404);
  }
  return c.json(result);
});

studentsRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      studentId: z.string().min(1),
      name: z.string().min(1),
      lastname: z.string().min(1),
      birthday: z.string().transform((data) => dayjs(data).toDate()),
      gender: z.string().min(1),
    })
  ),
  async (c) => {
    const { studentId, name, lastname, birthday, gender } = c.req.valid("json");
    const result = await drizzle
      .insert(students)
      .values({
        studentId,
        name,
        lastname,
        birthday,
        gender,
      })
      .returning();
    return c.json({ success: true, students: result[0] }, 201);
  }
);

studentsRouter.patch(
  "/:studentId",
  zValidator(
    "json",
    z.object({
      studentId: z.string().min(1).optional(),
      name: z.string().min(1).optional(),
      lastname: z.string().min(1).optional(),
      gender: z.string().min(1).optional(),
      birthday: z
        .string()
        .optional()
        .transform((data) => (data ? dayjs(data).toDate() : undefined)),
    })
  ),
  async (c) => {
    const id = c.req.param("studentId");
    const data = c.req.valid("json");
    const updated = await drizzle.update(students).set(data).where(eq(students.studentId, id)).returning();
    if (updated.length === 0) {
      return c.json({ error: "Not found" }, 404);
    }
    return c.json({ success: true, student: updated[0] });
  }
);

studentsRouter.delete("/:studentId", async (c) => {
  const id = c.req.param("studentId");
  const deleted = await drizzle.delete(students).where(eq(students.studentId, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "Not found" }, 404);
  }
  return c.json({ success: true, student: deleted[0] });
});

export default studentsRouter;
