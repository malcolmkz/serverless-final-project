import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger'

const todoTable = process.env.TODO_TABLE
const logger = createLogger('Logger')
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  await updateTodo(todoId, updatedTodo)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
    })
  }
}

async function updateTodo(todoId: String, updatedTodo:UpdateTodoRequest){
  const params = {
    TableName:todoTable,
    Key:{
        "todoId": todoId
    },
    UpdateExpression: "set name = :name, dueDate=:dueDate, done=:done",
    ExpressionAttributeValues:{
        ":name":updatedTodo.name,
        ":dueDate": updatedTodo.dueDate,
        ":done":updatedTodo.done
    },
    ReturnValues:"UPDATED_NEW"
};

logger.info("Updating todo", todoId)

return docClient.update(params, function(err, data) {
    if (err) {
        logger.info("Unable to update item. Error JSON:", JSON.stringify(err, null, 2))
    } else {
        logger.info("UpdateItem succeeded:", JSON.stringify(data, null, 2))
    }
})

}