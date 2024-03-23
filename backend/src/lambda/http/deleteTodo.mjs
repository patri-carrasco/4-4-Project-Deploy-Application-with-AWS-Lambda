import "source-map-support/register.js";
import { deleteTodo, todoExists } from "../../businessLogic/todos.mjs";
import { createLogger } from "../../utils/logger.mjs";
import { getUserId } from "../utils.mjs";

const logger = createLogger("auth");

export async function handler(event) {
  console.log("entrando a deleteTodo")
  const todoId = event.pathParameters.todoId;

  const userId = getUserId(event);

  const todo = await todoExists(todoId);
  if (todo.Count == 0) {
    logger.info(
      `User with id ${userId} performed delete no existing todo id ${todoId} `
    );
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: "Todo does not exist",
      }),
    };
  }
  await deleteTodo(todoId);
  logger.info(`User with id ${userId} performed delete todo id ${todoId} `);
  return {
    statusCode: 202,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      Success: `Todo with id ${todoId} deleted succesffuly`,
    }),
  };
}
