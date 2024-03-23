import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import AWSXRay from "aws-xray-sdk-core";

export class TodoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todoTable = process.env.TODOS_TABLE,
    userIdIndex = process.env.TODOS_CREATED_AT_INDEX
  ) {

    console.log("TodoTable:", todoTable);
    console.log("UserIdIndex:", userIdIndex);
    this.documentClient = documentClient;
    this.todoTable = todoTable;
    this.userIdIndex = userIdIndex;
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient);
  }


  async getTodosForUser(userId) {
    console.log("Getting all todos");
    console.log("tabla",this.todoTable)
    const result = await this.dynamoDbClient
      .query({
        TableName: this.todoTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      });
    console.log("Returning todos for user: " +userId +", and items: " +JSON.stringify({ result }));
    return result.Items;
  }

  async createTodo(todoItem) {
    console.log(`Creating a todo  ${todoItem}`);

    await this.dynamoDbClient.put({
      TableName: this.todoTable,
      Item: todoItem,
    });

    return todoItem;
  }
}
