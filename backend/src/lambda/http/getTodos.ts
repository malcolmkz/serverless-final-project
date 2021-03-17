import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const todoTable = process.env.TODO_TABLE
const userIdIndex = process.env.USER_ID_INDEX
const logger = createLogger('Logger')
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // Get the current user id
  const userId = event.requestContext.authorizer.principalId
  logger.info("User id =", userId)
  
  // Get all todos for the current user
  const todos = await getTodosByUser(userId)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: todos
    })
  }
}


async function getTodosByUser(userId: string) {
  
  logger.info("Getting all todos for the user", userId)
  
  const result = await docClient.query({
    TableName: todoTable,
    IndexName: userIdIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false
  }).promise()

  return result.Items
}
