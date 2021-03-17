import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger'

const todoTable = process.env.TODO_TABLE
const logger = createLogger('Logger')
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const {todoId} = event.pathParameters
  logger.info(`event path parameters ${event.pathParameters}`)
  logger.info(`todoId =  ${todoId}`)

 await deleteTodoById(todoId)
 
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
    })
  } 
}


async function deleteTodoById(todoId: String){

  logger.info(`Deleteing a TODO by id : , ${todoId}`)

  return await docClient
  .delete({
    Key: { "todoId": todoId},
    TableName : todoTable
  })
  .promise()
}