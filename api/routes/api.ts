import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { env } from "hono/adapter";
import studentsRouter from "./students.js";

const apiRouter = new Hono();

apiRouter.get("/", (c) => {
  return c.json({ message: "Student Table API" });
});

apiRouter.use(
  "*",
  bearerAuth({
    verifyToken: async (token, c) => {
      const { API_SECRET } = env<{ API_SECRET: string }>(c);
      return token === API_SECRET;
    },
  })
);

apiRouter.route("/students", studentsRouter);

export default apiRouter;
