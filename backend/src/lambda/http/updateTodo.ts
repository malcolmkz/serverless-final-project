import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodoBL } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('Logger')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  logger.info(`updating TODO : ${todoId}`)
  await updateTodoBL(todoId, updatedTodo)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
    })
  }
}

