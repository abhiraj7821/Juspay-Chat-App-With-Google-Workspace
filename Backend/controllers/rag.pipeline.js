// rag.route.js
const express = require('express');
const { OpenAIEmbeddings } = require("@langchain/openai");
const { ChatOpenAI } = require("@langchain/openai");
const { getPineconeIndex } = require('./pinecone.client.js');
const router = express.Router();
const cors = require('cors');

// CORS configuration
router.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialize models
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY
});

const llm = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7
});

// Modified RAG Pipeline with GET method
router.get('/ask-llm', async (req, res) => {
  try {
    const { question } = req.query; // Now getting question from query params
    
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // 1. Embed the question
    const queryEmbedding = await embeddings.embedQuery(question);

    // 2. Semantic search in Pinecone
    const index = await getPineconeIndex();
    const results = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true
    });

    // 3. Format context
    const context = results.matches
      .map(match => match.metadata.text)
      .join("\n\n");

    // 4. Generate answer with LLM
    const prompt = `Answer the question based on the context below.\n
                    Context:\n${context}\n
                    Question: ${question}\n
                    Answer:`;

    const answer = await llm.invoke(prompt);

    res.json({
      question,
      answer: answer.content,
      sources: results.matches.map(m => ({
        source: m.metadata.source,
        title: m.metadata.title
      }))
    });

  } catch (error) {
    console.error("RAG pipeline error:", error);
    res.status(500).json({
      error: "Failed to process question",
      details: error.message
    });
  }
});

module.exports = router;