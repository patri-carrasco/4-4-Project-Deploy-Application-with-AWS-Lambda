import "source-map-support/register.js";
import { createAttachmentPresignedUrl } from "../../fileStorage/attachmentUtils.mjs";
import { todoExists } from "../../businessLogic/todos.mjs";
import { createLogger } from "../../utils/logger.mjs";
import { getUserId } from "../utils.mjs";

const logger = createLogger("auth");

export async function handler(event) {
  const todoId = event.pathParameters.todoId;

  const userId = getUserId(event);

  const validTodo = await todoExists(todoId);
  if (validTodo.Count == 0) {
    logger.info(
      `User with id ${userId} performed generate upload url no existing todo id ${todoId}`
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

  logger.info(
    `User with id ${userId} performed generate upload url existing todo id ${todoId}`
  );

  const url = createAttachmentPresignedUrl(todoId);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      uploadUrl: url,
    }),
  };
}
