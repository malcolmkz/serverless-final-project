import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'


import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'


const todoTable = process.env.TODO_TABLE
const bucketName = process.env.TODO_S3_BUCKET


const docClient = new AWS.DynamoDB.DocumentClient()

const logger = createLogger('Logger')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  logger.info('Caller event', event)

  // get the user ID from the authorizer
  const userId = event.requestContext.authorizer.principalId
  logger.info('User ID', userId)

  // generate a unique id for the new todo item
  const todoId = uuid.v4()

  // create the new todo 
  const newItem = await createTodo(todoId, userId, newTodo)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}

async function createTodo(todoId:string, userId:string, newTodo: CreateTodoRequest){
  const createdAt = new Date().toISOString()
  const done: boolean = false
  
  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
  logger.info(`Attachment URL : ${attachmentUrl}`)

  const newItem = {
    todoId,
    createdAt,
    userId,
    ...newTodo,
    done,
    attachmentUrl : attachmentUrl
  }

  logger.info("Creating a new Todo item:", newItem)

  await docClient
    .put({
      TableName: todoTable,
      Item: newItem
    })
    .promise()

  return newItem
}
