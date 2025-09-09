import { TodoController } from "../controllers/TodoControllers.ts"
import { body, param } from "express-validator";

const controller = new TodoController();

export const TodoRoutes = [
    {
        method: "get",
        route: "/todolist",
        action: controller.getTodos,
        validation: []
    },
    {
        method: "post",
        route: "/todolist",
        action: controller.postTodos,
        validation: [
            body("task").isString(),
            body("urgent").isBoolean().optional()
        ]
    },
    {
        method: "put",
        route: "/todolist/:id",
        action: controller.putTodos,
        validation: [
            param("id").isMongoId(),
            body("task").isString(),
            body("urgent").isBoolean().optional()
        ]
    },
    {
        method: "delete",
        route: "/todolist/:id",
        action: controller.deleteTodos,
        validation: [
            param("id").isMongoId()
        ]
    }
]