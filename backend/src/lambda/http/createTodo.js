
import { createTodo } from '../../businessLogic/todo.mjs'
import {getToken} from '../auth/auth0Authorizer.mjs'

export async function handler(event) {

  const newTodo = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  const jwtToken = getToken(event.headers.Authorization);
  const newItem = await createTodo(newTodo,jwtToken)
  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      item: newItem
    })
  };
}

