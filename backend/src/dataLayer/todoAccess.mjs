import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import AWSXRay from "aws-xray-sdk-core";

export class TodoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todoTable = process.env.TODOS_TABLE,
    userIdIndex = process.env.TODOS_CREATED_AT_INDEX
  ) {
    this.documentClient = documentClient;
    this.todoTable = todoTable;
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient);
  }

  // async getAllGroups() {
  //   console.log("Getting all groups");

  //   const result = await this.dynamoDbClient.scan({
  //     TableName: this.groupsTable,
  //   });
  //   return result.Items;
  // }

  async createTodo(todoItem) {
    console.log(`Creating a todo  ${todoItem}`);

    await this.dynamoDbClient.put({
      TableName: this.todoTable,
      Item: todoItem,
    });

    return todoItem;
  }
}
