import * as uuid from 'uuid'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import {TodosAccess} from '../dataLayer/todosAccess'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'


const todosAccess = new TodosAccess()
//const bucketName = process.env.TODO_S3_BUCKET


export async function createTodoBL( newTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {

    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const done = false
    //const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`

    return await todosAccess.createTodoDAL({
        todoId,
        createdAt,
        userId,
        ...newTodo,
        done,
        //attachmentUrl : attachmentUrl
    }

    )
}

export async function getTodosBL(userId: string): Promise<any> {
    return await todosAccess.getTodosDAL(userId)
}

export async function updateTodoBL(todoId: string, updatedTodoRequest:UpdateTodoRequest): Promise<any> {
    return await todosAccess.updateTodoDAL(todoId, updatedTodoRequest)
}

export async function updateTodoAttachmentUrlBL(todoId: string, url:string): Promise<any> {
    return await todosAccess.updateTodoAttachmentUrlDAL(todoId, url)
}

export async function deleteTodoBL(todoId: string): Promise<any> {
    return await todosAccess.deleteTodoDAL(todoId)
}

