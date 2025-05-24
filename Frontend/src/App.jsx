import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp ,faPaperclip} from '@fortawesome/free-solid-svg-icons';
import { Avatar, AvatarImage } from "@/components/ui/avatar"


function App() {

  const [authmessage, setAuthMessage] = useState('');

  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', isUser: false }
  ]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [areDocsLinked, setAreDocsLinked] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true
    };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // API call to RAG pipeline
      const response = await fetch(
          `http://localhost:3000/api/ask-llm?question=${encodeURIComponent(inputMessage)}`,
          {
            credentials: 'include',
            mode: 'cors'
          }
      );

      console.log(response);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response with sources
      const aiResponse = {
        id: messages.length + 2,
        text: data.answer,
        isUser: false,
        sources: data.sources
      };
      
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        text: 'Failed to get response from AI',
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('API call failed:', error);
      
    } finally {
      setIsLoading(false);
    }
  };


  const handleDoc = async () => {
    
    if (areDocsLinked) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: 'Documents already linked',
        isUser: false
      }]);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/list-docs', {
        credentials: 'include'
      });
      const response2 = await fetch('http://localhost:3000/preprocess-docs', {
        credentials: 'include'
      });
      const response3 = await fetch('http://localhost:3000/generate-embeddings', {
        credentials: 'include'
      });
      
      if (response.ok & response2.ok & response3.ok) {
        setAreDocsLinked(true);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: 'Documents linked successfully!',
          isUser: false
        }]);
      }
    } catch (error) {
      console.error('Document linking failed:', error);
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/session-check', {
          credentials: 'include'
        });
        const { authenticated, hasDocuments } = await response.json();
        setIsAuthenticated(authenticated);
        setAreDocsLinked(hasDocuments);
      } catch (error) {
        console.error('Status check failed:', error);
      }
    };
    checkStatus();
  }, []);

  const handleAuth = async () => {
    if (isAuthenticated) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: 'Already logged in',
        isUser: false
      }]);
      return;
    }
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="flex flex-col h-screen bg-black">

      {/* AUTHENTICATION */}

      <div onClick={handleAuth} className="flex justify-end">
        <Avatar className="mt-[2rem] mr-[2rem] bg-white p-[0.3em]">
          <AvatarImage src="https://techdocs.akamai.com/identity-cloud/img/social-login/identity-providers/iconfinder-new-google-favicon-682665.png" />
        </Avatar>
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex-1 mx-[20rem] mt-[2rem] overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-white text-gray-800'
                  : 'bg-[#18181B] text-white shadow-md'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#303030] text-gray-800 shadow-md px-4 py-2 rounded-lg">
              <div className="flex space-x-2 items-center">
                <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full delay-100"></div>
                <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT SECTION */}
      <form onSubmit={handleSubmit} className="p-4 mx-[20rem] mt-[2rem] bg-black relative">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 border pb-[3em] w-0.5 rounded-[1.2em] focus:outline-none focus:ring-1 bg-black text-white"
          />

          <button
            onClick={handleDoc}
            className="px-[0.5em] py-[0.2em] bg-white text-black rounded-full absolute bottom-7 left-7 ronded transition-colors focus:outline-none cursor-pointer"
          >
            <FontAwesomeIcon icon={faPaperclip} />
          </button>

          <button
            type="submit"
            className="px-[0.5em] py-[0.2em] bg-white text-black rounded-full absolute bottom-7 right-10 ronded transition-colors focus:outline-none cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default App
