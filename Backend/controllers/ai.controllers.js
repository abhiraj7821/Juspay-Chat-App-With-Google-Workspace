// ai-processing.js
const express = require('express');
const { OpenAIEmbeddings } = require("@langchain/openai");
const router = express.Router();
const { loadToPinecone } = require('./dataloader.js');


router.get('/preprocess-docs', async (req, res) => {
  try {
    const rawDocuments = req.session.retrievedDocs;
    
    // 1. Clean and chunk documents
    const processedDocs = rawDocuments.map(doc => ({
      id: doc.id,
      title: doc.title,
      content: cleanContent(doc.content.text), // Remove special chars, normalize
      chunks: splitIntoChunks(doc.content.text, 1000), // 1000 chars per chunk
      metadata: {
        source: 'google-docs',
        lastModified: doc.lastModified
      }
    }));

    req.session.processedDocs = processedDocs;
    res.json({ status: "success", count: processedDocs.length });

  } catch (error) {
    console.error('Preprocessing error:', error);
    res.status(500).json({ error: "Preprocessing failed" });
  }
});

// Helper functions
function cleanContent(text) {
  return text.replace(/[^\w\s.]/g, ' ').replace(/\s+/g, ' ').trim();
}

function splitIntoChunks(text, chunkSize) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  return chunks;
}

// GET /generate-embeddings
router.get('/generate-embeddings', async (req, res) => {
  try {
    if (!req.session.processedDocs) {
      return res.status(400).json({ error: "No processed documents found. Call /preprocess-docs first" });
    }

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY
    });

    const docsWithEmbeddings = await Promise.all(
      req.session.processedDocs.map(async doc => ({
        ...doc,
        embeddings: await embeddings.embedDocuments(doc.chunks)
      }))
    );

    req.session.embeddedDocs = docsWithEmbeddings;
    // Add Pinecone loading
    const loadResult = await loadToPinecone(docsWithEmbeddings);
    
    if (!loadResult.success) {
      throw new Error(`Pinecone loading failed: ${loadResult.error}`);
    }

    res.json({ 
      status: "success",
      documentCount: docsWithEmbeddings.length,
      chunkCount: loadResult.count,
      pineconeIndex: process.env.PINECONE_INDEX_NAME
    });


  } catch (error) {
    console.error('Embedding generation error:', error);
    res.status(500).json({ 
      error: "Embedding generation failed",
      details: error.message 
    });
  }
});

module.exports = router;