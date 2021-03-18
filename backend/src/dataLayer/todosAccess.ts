import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from '../models/TodoItem'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'



const AWSX = AWSXRay.captureAWS(AWS)

export class TodosAccess{

    constructor(
        private readonly docClient: DocumentClient = new AWSX.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODO_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX
        ) {
        }

    async createTodoDAL(todo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todo
        }).promise()
        
        return todo
    }


    async getTodosDAL(userId: string): Promise<AWS.DynamoDB.DocumentClient.ItemList> {
  
        const result = await this.docClient.query({
          TableName: this.todoTable,
          IndexName: this.userIdIndex,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          },
          ScanIndexForward: false
        }).promise()
      
        return result.Items
    }

    async updateTodoDAL(todoId: string, updatedTodoRequest:UpdateTodoRequest): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> {
        return await this.docClient.update({
            TableName: this.todoTable,
            Key:{
              "todoId": todoId
             },
            UpdateExpression: "set todoName = :todoName, dueDate = :dueDate, done = :done",
            ExpressionAttributeValues:{
                ":todoName": updatedTodoRequest.todoName,
                ":dueDate": updatedTodoRequest.dueDate,
                ":done": updatedTodoRequest.done
            },
          ReturnValues:"UPDATED_NEW"
        }).promise()
    }

    async updateTodoAttachmentUrlDAL(todoId: string, url:string): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> {
        return await this.docClient.update({
            TableName: this.todoTable,
            Key:{
              "todoId": todoId
             },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues:{
                ":attachmentUrl":url
        },
          ReturnValues:"UPDATED_NEW"
        }).promise()
    }

    async deleteTodoDAL(todoId: string): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput>{
        return await this.docClient.delete({
          Key: { "todoId": todoId},
          TableName : this.todoTable
        })
        .promise()
    }
}
    

