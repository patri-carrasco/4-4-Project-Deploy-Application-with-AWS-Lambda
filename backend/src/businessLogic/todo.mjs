import * as uuid from "uuid";
import { TodoAccess } from "../dataLayer/todoAccess.mjs";
import { createLogger } from "../utils/logger.mjs"
import { parseUserId } from "../auth/utils.mjs";

const todoAccess = new TodoAccess()
const logger = createLogger('auth')


export async function createTodo(createTodoRequest, jwtToken) {
  const todoId = uuid.v4();
  const userId = parseUserId(jwtToken)

  logger.info(`Create todo for user ${userId}`)

  return await todoAccess.createTodo({
    todoId: todoId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: true,
  });
  

}