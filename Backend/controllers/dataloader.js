import { getPineconeIndex } from './pinecone.client.js';

export async function loadToPinecone(embeddedDocs) {
  try {
    const index = await getPineconeIndex();
    const vectors = [];
    
    // Format documents for Pinecone
    embeddedDocs.forEach(doc => {
      doc.chunks.forEach((chunk, chunkIndex) => {
        vectors.push({
          id: `${doc.id}_${chunkIndex}`,
          values: doc.embeddings[chunkIndex],
          metadata: {
            text: chunk,
            title: doc.title,
            source: doc.metadata.source,
            lastModified: doc.metadata.lastModified
          }
        });
      });
    });

    // Upsert in batches of 100
    const BATCH_SIZE = 100;
    for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
      const batch = vectors.slice(i, i + BATCH_SIZE);
      await index.upsert(batch);
    }

    return { success: true, count: vectors.length };
  } catch (error) {
    console.error("Data loading failed:", error);
    return { success: false, error: error.message };
  }
}