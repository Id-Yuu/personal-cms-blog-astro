import jsonServer from 'json-server';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const routerDb = jsonServer.router(path.join(__dirname, 'db.json'));
const routerPosts = jsonServer.router(path.join(__dirname, 'posts.json'));
const routerUsers = jsonServer.router(path.join(__dirname, 'users.json'));
const middlewares = jsonServer.defaults();

// Configure where and how to save the uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save directly to Astro's public/img folder
    const uploadDir = path.join(__dirname, 'public', 'img');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Rename file to ensure uniqueness (e.g., 169123456.png)
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

server.use(middlewares);
// Enable CORS for frontend communication
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

server.use(jsonServer.bodyParser);

// Custom Login Endpoint
server.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = routerUsers.db; // underlying lowdb instance for users.json
  
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  const user = db.get('users').find({ username, password: hashedPassword }).value();

  if (user) {
    // Generate a simple mock token based on user id and role
    const token = `mock-jwt-token-${user.id}-${user.role}-${Date.now()}`;
    res.status(200).json({ token, role: user.role });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Authentication Middleware
server.use((req, res, next) => {
  // Allow OPTIONS, /login, and non-users GET requests
  const isAuthRequired = !(
    req.method === 'OPTIONS' || 
    req.path === '/login' || 
    (req.method === 'GET' && !req.path.startsWith('/users'))
  );

  if (isAuthRequired) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer mock-jwt-token-')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }
  }

  // Intercept POST/PUT/PATCH to /users to automatically hash passwords before JsonServer saves them
  if (req.path.startsWith('/users') && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (req.body && req.body.password) {
      if (req.body.password.length !== 64) { // Only hash if it's not already a 64-char hex hash
        req.body.password = crypto.createHash('sha256').update(req.body.password).digest('hex');
      }
    }
  }

  next();
});

// Custom Image Upload Endpoint
server.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    // Return the public path so the frontend can save it to db.json
    res.status(200).json({ imageUrl: `/img/${req.file.filename}` });
  } else {
    res.status(400).json({ error: 'Upload failed' });
  }
});

// Middleware to delete images physically when posts are deleted or their images are changed
server.use((req, res, next) => {
  const match = req.path.match(/^\/posts\/([^/]+)$/);
  if (match && ['DELETE', 'PUT', 'PATCH'].includes(req.method)) {
    const postId = match[1];
    const post = routerPosts.db.get('posts').find({ id: postId }).value();
    
    if (post && post.image) {
      const deleteImage = () => {
        try {
          const imageRelativePath = post.image.startsWith('/') ? post.image.substring(1) : post.image;
          const imgPath = path.join(__dirname, 'public', imageRelativePath);
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
          }
        } catch(e) { console.error('Error deleting image', e); }
      };

      if (req.method === 'DELETE') {
        // Post is being deleted, remove the image
        deleteImage();
      } else if (req.body && req.body.image !== undefined && req.body.image !== post.image) {
        // Post is updated and the image has changed or is explicitly removed
        deleteImage();
      }
    }
  }
  next();
});

// Route requests to the appropriate JSON Server router
server.use((req, res, next) => {
  if (req.path.startsWith('/posts')) {
    routerPosts(req, res, next);
  } else if (req.path.startsWith('/users')) {
    routerUsers(req, res, next);
  } else {
    routerDb(req, res, next);
  }
});

server.listen(4000, () => {
  console.log('JSON Server + Upload API running on port 4000');
});