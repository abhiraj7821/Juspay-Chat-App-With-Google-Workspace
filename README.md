<h2 align="left">Hi 👋! This is a Google Docs RAG System with Pinecone & LangChain</h2>

###

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="30" alt="javascript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="30" alt="nodejs logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="30" alt="react logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="30" alt="html5 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="30" alt="css3 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" height="30" alt="github logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" height="30" alt="google logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" height="30" alt="vscode logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original-wordmark.svg" height="30" alt="tailwindcss logo"  />
</div>

###

<div align="left">
  <a href="mailto:abhiraj7821@gmail.com" target="_blank">
    <img src="https://img.shields.io/static/v1?message=Gmail&logo=gmail&label=&color=D14836&logoColor=white&labelColor=&style=for-the-badge" height="35" alt="gmail logo"  />
  </a>
  <a href="https://www.linkedin.com/in/abhiraj7821/" target="_blank">
    <img src="https://img.shields.io/static/v1?message=LinkedIn&logo=linkedin&label=&color=0077B5&logoColor=white&labelColor=&style=for-the-badge" height="35" alt="linkedin logo"  />
  </a>
</div>

###


<h4 align="left">📌 Project Overview</h4>

###

<p align="left">This project implements a sophisticated Retrieval-Augmented Generation (RAG) system that extracts knowledge from Google Docs, processes it with AI, and enables intelligent question-answering capabilities. The system:<br><br>Authenticates users via Google OAuth<br><br>Extracts and indexes document content from Google Workspace<br><br>Creates semantic embeddings using OpenAI's models<br><br>Stores vectors in Pinecone for efficient retrieval<br><br>Answers questions using LangChain's RAG pipeline<br><br>Built with a modern tech stack, this application showcases how to build production-ready AI systems that leverage both proprietary document stores and cutting-edge LLMs.</p>

###

<h4 align="left">🚀 Key Features</h4>

###

<p align="left">Secure Google OAuth 2.0 integration with proper session management<br><br>Document processing pipeline that handles Google Docs formatting<br><br>Chunking and embedding generation optimized for RAG<br><br>Pinecone vector database integration for low-latency semantic search<br><br>LangChain orchestration for retrieval and generation<br><br>Responsive frontend with chat interface<br><br>Source attribution showing document origins for answers</p>

###

<h4 align="left">🛠 Tech Stack</h4>

###

<p align="left">Backend<br>Node.js (v18+) - JavaScript runtime<br><br>Express - Web application framework<br><br>Passport.js - Authentication middleware<br><br>Google APIs - Docs and Drive integration<br><br>LangChain - RAG orchestration<br><br>OpenAI Embeddings (text-embedding-3-large) - Vector generation<br><br>Pinecone - Vector database<br><br>Express Session - Secure session management<br><br>CORS - Secure cross-origin requests<br><br>Frontend<br>React (v18) - UI framework<br><br>Vite - Modern build tool<br><br>Tailwind CSS - Utility-first styling<br><br>Font Awesome - Icon toolkit<br><br>Axios (though currently using Fetch API) - HTTP client<br><br>Infrastructure<br>Docker (for Pinecone local testing)<br><br>Environment variables via dotenv</p>

###

<h4 align="left">🔧 Project Architecture</h4>

###

<p align="left"></p>

###

<h4 align="left">🏗 System Flow</h4>

###

<p align="left">

1. **Authentication**
   - User logs in via Google OAuth
   - Session established with access tokens
   - Permissions granted for Google Docs access

2. **Document Processing**
   - User links Google Docs via `/api/list-docs`
   - System retrieves and chunks document content
   - Generates embeddings via OpenAI
   - Stores vectors in Pinecone with metadata

3. **Question Answering**
   - User submits question via frontend
   - System:
     - Embeds question
     - Retrieves relevant document chunks
     - Generates answer with context
     - Returns response with sources
</p>

###


## 💻 Development Setup

### Prerequisites
- Node.js v18+
- Google OAuth credentials
- Pinecone API key
- OpenAI API key

### Installation
1. Clone repository:
   ```bash
   git clone https://github.com/yourusername/google-docs-rag.git
   cd google-docs-rag
   ```
2. Install dependencies:
   ```bash
   #Backend
   cd Backend
   npm install

   #Frontend
   cd Frontend
   npm install
   ```
3. Configure environment:
    ```bash
    # Backend .env
    GOOGLE_CLIENT_ID=your-client-id
    GOOGLE_CLIENT_SECRET=your-client-secret
    PINECONE_API_KEY=your-pinecone-key
    PINECONE_ENVIRONMENT=your-pinecone-env
    OPENAI_API_KEY=your-openai-key
    SESSION_SECRET=your-session-secret
    ```
4. Run the system:
    ```bash
    # In separate terminals
    cd backend && npm start
    cd frontend && npm run dev
    ```

## 🏆 Key Technical Achievements

- **Optimized Document Processing**  
  Special handling of Google Docs API responses to preserve formatting and structure while extracting clean text.

- **Efficient Chunking**  
  Implemented dynamic chunking that respects document structure while maintaining optimal chunk sizes for embedding.

- **Production-ready RAG Pipeline**  
  Built a robust question-answering system that:
  - Handles rate limiting  
  - Manages API failures gracefully  
  - Provides source attribution  
  - Maintains session context

- **Secure Authentication Flow**  
  Implemented proper session management with:
  - HttpOnly cookies  
  - CSRF protection  
  - Secure flag in production  
  - Session expiry

---

## 📈 Potential Enhancements

- **Conversational Memory** – Add chat history to enable follow-up questions  
- **Document Versioning** – Track document changes and update embeddings  
- **Hybrid Search** – Combine semantic and keyword search  
- **Query Understanding** – Implement query rewriting/expansion  
- **Admin Dashboard** – For monitoring and system management

---

## 🤝 Contributing

Contributions are welcome!  
Please fork the repository and submit a pull request.  
For major changes, open an issue first to discuss your proposed changes.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
