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

# 📄 Google Docs RAG System with Pinecone & LangChain

[![Watch the demo](https://i.ytimg.com/vi/Vgz3LRyb7_E/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCmvuWk7HPX2XdE7ExSKIkRFs9PrQ)](https://youtu.be/Vgz3LRyb7_E?si=PHVVzjHupBN1-u8p)


## 📌 Project Overview

This project implements a sophisticated **Retrieval-Augmented Generation (RAG)** system that extracts knowledge from Google Docs, processes it with AI, and enables intelligent question-answering capabilities. The system:

- Authenticates users via **Google OAuth**
- Extracts and indexes document content from **Google Workspace**
- Creates semantic embeddings using **OpenAI**
- Stores vectors in **Pinecone** for efficient retrieval
- Answers questions using **LangChain's RAG pipeline**

Built with a modern tech stack, this application showcases how to build production-ready AI systems that combine proprietary document stores with cutting-edge LLMs.

---

## 🚀 Key Features

- 🔐 Secure **Google OAuth 2.0** integration with session management  
- 📄 Document processing pipeline that handles Google Docs formatting  
- ✂️ Intelligent chunking and optimized embedding generation  
- 📦 Integration with **Pinecone** for low-latency vector search  
- 🧠 Retrieval and generation orchestration using **LangChain**  
- 💬 Responsive **chat interface** on the frontend  
- 📚 Source attribution for answer transparency  

---

## 🛠 Tech Stack

### Backend
- **Node.js (v18+)** – JavaScript runtime
- **Express** – Web framework
- **Passport.js** – Authentication middleware
- **Google APIs** – Docs and Drive access
- **LangChain** – RAG orchestration
- **OpenAI (text-embedding-3-large)** – Embeddings
- **Pinecone** – Vector database
- **Express Session** – Secure session management
- **CORS** – Cross-origin resource handling

### Frontend
- **React (v18)** – UI framework
- **Vite** – Modern build tool
- **Tailwind CSS** – Utility-first styling
- **Font Awesome** – Icons
- **Axios / Fetch API** – HTTP requests

### Infrastructure
- **Docker** (for local Pinecone testing)
- **dotenv** – Environment configuration

---

## 🔧 Project Architecture

  ```
  google-docs-rag/
  ├── backend/
  │   ├── controllers/
  │   │   ├── ai.controllers.js       # Document processing logic
  │   │   ├── rag.pipeline.js         # RAG question-answering
  │   │   └── pinecone.client.js      # Vector DB interface
  │   ├── routes/
  │   │   └── auth.routes.js          # Authentication endpoints
  │   └── server.js                   # Main application entry
  ├── frontend/
  │   ├── src/
  │   │   ├── App.jsx                 # Main React component
  │   │   └── main.jsx                # React entry point
  ├── .env                            # Environment configuration
  └── README.md                       # This file
  ```

---

## 🏗 System Flow

### 🔐 Authentication
- User logs in via Google OAuth
- Session established with tokens
- Permissions granted for Docs access

### 📄 Document Processing
- User links docs via `/api/list-docs`
- System retrieves and chunks content
- Generates embeddings using OpenAI
- Stores vectors in Pinecone with metadata

### 💬 Question Answering
- User submits a question from frontend
- System:
  - Embeds the question
  - Retrieves relevant chunks from Pinecone
  - Uses LangChain + OpenAI to generate an answer
  - Returns response with source citations

---

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


