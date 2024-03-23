import * as uuid from "uuid";
import { TodoAccess } from "../dataLayer/todoAccess.mjs";
import { createLogger } from "../utils/logger.mjs"
import { parseUserId } from "../auth/utils.mjs";
import { getTodoAttachmentUrl } from "../fileStorage/attachmentUtils.mjs";

const todoAccess = new TodoAccess()
const logger = createLogger('auth')

export async function getTodosUser(jwtToken) {
  const userId = parseUserId(jwtToken);

  logger.info(`Get all todos for user ${userId}`);
  

  const todos = await todoAccess.getTodosForUser(userId);

  for (const todo of todos) {
    todo.attachmentUrl = await getTodoAttachmentUrl(todo.todoId);
  }
  return todos;
}



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

export async function deleteTodo(todoId) {
  return await todoAccess.deleteTodo(todoId);
}

export async function todoExists(todoId) {
  return await todoAccess.getTodo(todoId);
}
export async function updateTodo(todoId, updateTodoRequest) {
  return await todoAccess.updateTodo(todoId, updateTodoRequest);
}