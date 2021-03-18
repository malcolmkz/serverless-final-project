import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from '../models/TodoItem'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'


const AWSX = AWSXRay.captureAWS(AWS)

export class TodosAccess{

    constructor(
        private readonly docClient: DocumentClient = new AWSX.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODO_TABLE) {
        }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todo
        }).promise()
        
        return todo
    }

}
    

