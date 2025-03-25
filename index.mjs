import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ap-south-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

const dynamodbTableName = "product-inventory";
const healthPath = "/health";
const productPath = "/product";
const productsPath = "/products";

export async function handler(event) {
  console.log("Request event:", event);
  let response;

  switch (true) {
    case event.httpMethod === "GET" && event.path === healthPath:
      response = buildResponse(200, "Health check OK");
      break;
    case event.httpMethod === "GET" && event.path === productPath:
      response = await getProduct(event.queryStringParameters.productId);
      break;
    case event.httpMethod === "GET" && event.path === productsPath:
      response = await getProducts();
      break;
    case event.httpMethod === "POST" && event.path === productPath:
      response = await saveProduct(JSON.parse(event.body));
      break;
    case event.httpMethod === "PATCH" && event.path === productPath:
      const { productId, updateKey, updateValue } = JSON.parse(event.body);
      response = await modifyProduct(productId, updateKey, updateValue);
      break;
    case event.httpMethod === "DELETE" && event.path === productPath:
      response = await deleteProduct(JSON.parse(event.body).productId);
      break;
    default:
      response = buildResponse(404, "Not Found");
  }
  return response;
}

async function getProduct(productId) {
  const params = { TableName: dynamodbTableName, Key: { productId } };
  try {
    const command = new GetCommand(params);
    const response = await dynamodb.send(command);
    return buildResponse(200, response.Item);
  } catch (error) {
    console.error("Error fetching product:", error);
    return buildResponse(500, { error: "Error fetching product" });
  }
}

async function getProducts() {
  const params = { TableName: dynamodbTableName };
  try {
    const allProducts = await scanDynamoRecords(params, []);
    return buildResponse(200, { products: allProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    return buildResponse(500, { error: "Error fetching products" });
  }
}

async function scanDynamoRecords(scanParams, itemArray) {
  try {
    const command = new ScanCommand(scanParams);
    const dynamoData = await dynamodb.send(command);
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch (error) {
    console.error("Error scanning records:", error);
    return [];
  }
}

async function saveProduct(requestBody) {
  const params = { TableName: dynamodbTableName, Item: requestBody };
  try {
    const command = new PutCommand(params);
    await dynamodb.send(command);
    return buildResponse(200, {
      Operation: "SAVE",
      Message: "SUCCESS",
      Item: requestBody,
    });
  } catch (error) {
    console.error("Error saving product:", error);
    return buildResponse(500, { error: "Error saving product" });
  }
}

async function modifyProduct(productId, updateKey, updateValue) {
  const params = {
    TableName: dynamodbTableName,
    Key: { productId },
    UpdateExpression: `set ${updateKey} = :value`,
    ExpressionAttributeValues: { ":value": updateValue },
    ReturnValues: "UPDATED_NEW",
  };
  try {
    const command = new UpdateCommand(params);
    const response = await dynamodb.send(command);
    return buildResponse(200, {
      Operation: "UPDATE",
      Message: "SUCCESS",
      UpdatedAttributes: response.Attributes,
    });
  } catch (error) {
    console.error("Error modifying product:", error);
    return buildResponse(500, { error: "Error modifying product" });
  }
}

async function deleteProduct(productId) {
  const params = {
    TableName: dynamodbTableName,
    Key: { productId },
    ReturnValues: "ALL_OLD",
  };
  try {
    const command = new DeleteCommand(params);
    const response = await dynamodb.send(command);
    return buildResponse(200, {
      Operation: "DELETE",
      Message: "SUCCESS",
      Item: response.Attributes,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return buildResponse(500, { error: "Error deleting product" });
  }
}

function buildResponse(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
