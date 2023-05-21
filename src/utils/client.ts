import { Account, Client, Databases, Functions } from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "");

const account = new Account(client);
const databases = new Databases(client);
const functions = new Functions(client);

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE || "";
const functionsId = process.env.NEXT_PUBLIC_APPWRITE_FN || "";
const clientFunctionsId = process.env.NEXT_PUBLIC_APPWRITE_CLIENT_FN || "";
const stocksCollection = process.env.NEXT_PUBLIC_APPWRITE_STOCKS || "";
const clientsCollection = process.env.NEXT_PUBLIC_APPWRITE_CLIENTS || "";
const ordersCollection = process.env.NEXT_PUBLIC_APPWRITE_ORDERS || "";

export {
  client,
  account,
  functions,
  databases,
  databaseId,
  functionsId,
  clientFunctionsId,
  stocksCollection,
  clientsCollection,
  ordersCollection,
};
