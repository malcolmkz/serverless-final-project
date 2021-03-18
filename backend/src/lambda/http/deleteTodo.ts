import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { deleteTodoBL } from '../../businessLogic/todos'

const logger = createLogger('Logger')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const {todoId} = event.pathParameters
  logger.info(`event path parameters ${event.pathParameters}`)
  logger.info(`todoId =  ${todoId}`)

 await deleteTodoBL(todoId)
 
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
    })
  } 
}
