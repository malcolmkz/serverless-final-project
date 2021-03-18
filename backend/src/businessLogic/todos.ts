import * as uuid from 'uuid'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import {TodosAccess} from '../dataLayer/todosAccess'
import { TodoItem } from '../models/TodoItem'

const todosAccess = new TodosAccess()
//const bucketName = process.env.TODO_S3_BUCKET


export async function createTodoAccess( newTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {

    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const done = false
    //const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`

    return await todosAccess.createTodo({
        todoId,
        createdAt,
        userId,
        ...newTodo,
        done,
        //attachmentUrl : attachmentUrl
    }

    )
}

