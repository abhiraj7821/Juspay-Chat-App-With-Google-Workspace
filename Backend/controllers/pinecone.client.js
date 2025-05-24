import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from 'dotenv';
dotenv.config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

export async function getPineconeIndex() {
  const indexName = process.env.PINECONE_INDEX_NAME || 'genai-index';
  try {
    return pinecone.Index(indexName);
  } catch (error) {
    console.error("Pinecone initialization error:", error);
    throw error;
  }
}























// import {PineconeClient} from "@pinecone-database/pinecone"
// require('dotenv').config();

// let pineconeClientInstance=PineconeClient;

// async function createIndex(client=PineconeClient,indexName=string){
//     await PineconeClient.createIndex({
//         createRequest:{
//             name:indexName,
//             dimension:1536,
//             metric:'cosine',
//         },
//     });
// }



// async function initPineconeClient(){
//     try {
//         const pineconeClient=new PineconeClient()
//         await pineconeClient.init({
//             apiKey : process.env.PINECONE_API_KEY,
//         });
//         const indexName=process.env.PINECONE_INDEX_NAME;

//         const exixtingIndexes=await pineconeClient.listIndexes();

//         if(!exixtingIndexes.includes(indexName)){
//             console.log("Create Pinecone Index");
//         }
//         else{
//             console.log("Your index already exists. nice!!");
//         }
//         return pineconeClient;
//     } catch (error) {
//         console.error("Error",error);
//         throw new Error("Failed to initialize Pinecone Client");
//     }
// }

// export async function getPineconeClient(){
//     if(!pineconeClientInstance){
//         pineconeClientInstance=await initPineconeClient();
//     }
//     return pineconeClientInstance;
// }

