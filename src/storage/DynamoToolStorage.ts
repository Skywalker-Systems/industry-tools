import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DeleteCommand,
    DeleteCommandInput,
    DynamoDBDocumentClient,
    GetCommand,
    GetCommandInput,
    PutCommand,
    PutCommandInput,
    QueryCommand,
    ScanCommand,
    UpdateCommand,
    UpdateCommandInput
} from "@aws-sdk/lib-dynamodb";

import { ToolStorage } from "./ToolStorage";

interface QueryExpression {
    condition: string;
    values: Record<string, unknown>;
}

interface ScanExpression {
    filter: string;
    values: Record<string, unknown>;
}

export class DynamoToolStorage extends ToolStorage {
    private client: DynamoDBDocumentClient;
    private tableName: string;

    constructor(region: string, tableName: string) {
        super();
        const dbClient = new DynamoDBClient({ region });
        this.client = DynamoDBDocumentClient.from(dbClient, {
            marshallOptions: {
                convertEmptyValues: true,
                removeUndefinedValues: true,
                convertClassInstanceToMap: true,
            },
        });
        this.tableName = tableName;
    }

    async getItem<T>(pk: string, sk: string): Promise<T | null> {
        const params: GetCommandInput = {
            TableName: this.tableName,
            Key: { PK: pk, SK: sk },
        };
        return (await this.client.send(new GetCommand(params))).Item as T | null;
    }

    async createItem<T>(
        pk: string,
        sk: string,
        props: T
    ): Promise<void> {
        const params: PutCommandInput = {
            TableName: this.tableName,
            Item: { PK: pk, SK: sk, ...props },
        };
        await this.client.send(new PutCommand(params));
    }

    async deleteItem(pk: string, sk: string): Promise<void> {
        const params: DeleteCommandInput = {
            TableName: this.tableName,
            Key: { PK: pk, SK: sk },
        };
        await this.client.send(new DeleteCommand(params));
    }

    async updateItem<T>(
        pk: string,
        sk: string,
        updateValues: T & Record<string, unknown>
    ): Promise<void> {
        let updateExpression = "set ";
        const expressionAttributeNames: Record<string, string> = {};
        const expressionAttributeValues: Record<string, unknown> = {};

        for (const [k, v] of Object.entries(updateValues)) {
            updateExpression += `#${k} = :${k}, `;
            expressionAttributeNames[`#${k}`] = k;
            expressionAttributeValues[`:${k}`] = v;
        }

        updateExpression = updateExpression.slice(0, -2);

        const params: UpdateCommandInput = {
            TableName: this.tableName,
            Key: { PK: pk, SK: sk },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
        };

        await this.client.send(new UpdateCommand(params));
    }

    async query<T>(expression: QueryExpression): Promise<Array<T>> {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: expression.condition,
            ExpressionAttributeValues: expression.values,
        };
        const data = await this.client.send(new QueryCommand(params));
        return data.Items as T[];
    }

    async scan<T>(expression: ScanExpression): Promise<Array<T>> {
        const params = {
            TableName: this.tableName,
            FilterExpression: expression.filter,
            ExpressionAttributeValues: expression.values,
        };
        const data = await this.client.send(new ScanCommand(params));
        return data.Items as T[];
    }
}
