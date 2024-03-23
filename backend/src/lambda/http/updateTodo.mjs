import "source-map-support/register.js";
import { todoExists, updateTodo } from "../../businessLogic/todos.mjs";
import { createLogger } from "../../utils/logger.mjs";
import { getUserId } from "../utils.mjs";

const logger = createLogger("auth");

export async function handler(event) {
  const todoId = event.pathParameters.todoId;
  const updatedTodo = JSON.parse(event.body);

  const userId = getUserId(event);

  const validTodo = await todoExists(todoId);
  if (validTodo.Count == 0) {
    logger.info(
      `User with id ${userId} performed update no existing todo id ${todoId} `
    );
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        error: "Todo does not exist",
      }),
    };
  }
  const todo = await updateTodo(todoId, updatedTodo);
  logger.info(`User with id ${userId} performed update todo id ${todoId} `);
  return {
    statusCode: 200,
    body: JSON.stringify({
      item: todo,
    }),
  };
}
