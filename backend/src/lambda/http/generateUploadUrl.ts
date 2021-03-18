import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { updateTodoAttachmentUrlBL } from '../../businessLogic/todos'


const bucketName = process.env.TODO_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const logger = createLogger('Logger')
  const todoId = event.pathParameters.todoId

  // DONE: Return a presigned URL to upload a file for a TODO item with the provided id

  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })
  
  const signedURL = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })

  await updateTodoAttachmentUrlBL(todoId,`https://${bucketName}.s3.amazonaws.com/${todoId}`)

  logger.info(`signed URL ${signedURL}`)
  logger.info("Generating an S3 signed URL")
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: signedURL
    })
  }
}
