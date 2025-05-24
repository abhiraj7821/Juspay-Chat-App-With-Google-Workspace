// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const ragRouter = require('./controllers/rag.pipeline');
const cors = require('cors');
const app = express();

const aiProcessingRouter = require('./controllers/ai.controllers');

// isLoggedIn middleware
function isLoggedIn(req, res, next) {
  // Check for API token in header
  if (req.headers['x-api-key'] === process.env.API_SECRET) {
    return next();
  }
  
  // Fall back to session auth
  if (req.isAuthenticated()) return next();
  
  res.status(401).json({ error: "Authentication required" });
}

// Configure middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));

app.use(cors({
  origin: 'http://localhost:5173', // Frontend origin
  credentials: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Configure Passport
passport.use(new GoogleStrategy({
    clientID: '1017825000593-3o7gfs0b1974bej23nif0jb2b3mp4nc2.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback:true
  },
  function(request,accessToken, refreshToken,profile,done) {
    const user = {
    id: profile.id,
    displayName: profile.displayName,
    email: profile.emails[0].value,
    accessToken: accessToken
  };
    return done(null,user)
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate using Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', {
    session:true,
    scope: [
      "profile", "email",
      "https://www.googleapis.com/auth/documents.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
    accessType: 'offline',
    prompt: 'consent'
  })
);

app.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:5173/',
    failureRedirect: '/auth/failure'
  })
);

app.get('/auth/failure', (req, res) => {
  res.status(401).send('Google authentication failed');
});

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send('Not authenticated');
  res.send('Successfully authenticated! You can now access Google Docs');
});

app.get('/api/session-check', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    hasDocuments: !!req.session.embeddedDocs
  });
});

// Access Docs
app.get("/api/list-docs", isLoggedIn, async (req, res) => {
  try {
    const accessToken = req.user.accessToken;
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const result = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.document'",
      fields: "files(id, name, modifiedTime)",
      pageSize: 100
    });
    
    // Store doc IDs in session for validation
    req.session.docList = result.data.files.map(doc => doc.id);
    res.redirect('/retrieve-docs');
    
  } catch (err) {
    console.error("Google Drive fetch error:", err);
    res.status(500).json({ error: "Failed to fetch Google Docs list", details: err.message });
  }
});

app.get('/retrieve-docs', isLoggedIn, async (req, res) => {
  try {
    if (!req.session.docList || req.session.docList.length === 0) {
      return res.status(400).json({ error: "No documents found in session. Please list documents first." });
    }

    const oAuth2Client = new OAuth2Client();
    oAuth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken
    });

    const docs = google.docs({ version: 'v1', auth: oAuth2Client });
    const documents = [];

    // Process each document in parallel
    const documentPromises = req.session.docList.map(async (docId) => {
      try {
        const response = await docs.documents.get({ documentId: docId });
        return {
          id: docId,
          title: response.data.title,
          content: parseDocumentContent(response.data.body.content)
        };
        ;
      } catch (error) {
        console.error(`Error fetching document ${docId}:`, error);
        return {
          id: docId,
          error: "Failed to fetch document",
          details: error.message
        };
      }
    });

    // Wait for all documents to be processed
    const results = await Promise.all(documentPromises);
    documents.push(...results);

    // Store all retrieved documents in session
    req.session.retrievedDocs = documents;

    res.json({
      count: documents.length,
      documents: documents
    });

  } catch (error) {
    console.error('Error in retrieve-docs:', error);
    res.status(500).json({ 
      error: "Failed to retrieve documents",
      details: error.message 
    });
  }
});

// Get all stored documents from session
app.get('/get-all-docs', isLoggedIn, (req, res) => {
  try {
    if (!req.session.retrievedDocs) {
      return res.status(404).json({ 
        error: "No documents found in session",
        suggestion: "Call /retrieve-docs first to fetch and store documents"
      });
    }

    res.json({
      count: req.session.retrievedDocs.length,
      documents: req.session.retrievedDocs
    });

  } catch (error) {
    console.error('Error in get-all-docs:', error);
    res.status(500).json({ 
      error: "Failed to get documents from session",
      details: error.message 
    });
  }
});

function parseDocumentContent(content) {
  const result = {
    text: '',
    elements: []
  };

  content.forEach(section => {
    if (section.paragraph) {
      const paragraph = {
        type: 'paragraph',
        content: []
      };

      section.paragraph.elements.forEach(element => {
        if (element.textRun) {
          const textContent = element.textRun.content;
          result.text += textContent;
          paragraph.content.push({
            text: textContent,
            styles: element.textRun.textStyle || {}
          });
        }
      });

      result.elements.push(paragraph);
    }
    // Add support for other element types (tables, images, etc.)
  });

  return result;
}


// -----------------------
// AI-Rag Implimentation
// -----------------------


app.use('/', aiProcessingRouter);
app.use('/api', ragRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

