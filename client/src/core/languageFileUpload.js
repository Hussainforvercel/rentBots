import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only allow JSON files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/json') {
    cb(null, true);
  } else {
    cb(new Error('Only JSON files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Function to remove file
const removeFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error removing file:', error);
  }
};

export default function languageFileUpload(app) {
  // Upload route
  app.post('/api/upload-language-file', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Validate JSON content
      const fileContent = fs.readFileSync(req.file.path, 'utf8');
      try {
        JSON.parse(fileContent);
      } catch (error) {
        removeFile(req.file.path);
        return res.status(400).json({ message: 'Invalid JSON file' });
      }

      // Return the file URL
      const fileURL = `/uploads/${req.file.filename}`;
      res.json({ fileURL });
    } catch (error) {
      console.error('Error uploading file:', error);
      if (req.file) {
        removeFile(req.file.path);
      }
      res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
  });

  // Delete route
  app.delete('/api/delete-language-file', bodyParser.json(), async (req, res) => {
    try {
      const { fileURL } = req.body;
      if (!fileURL) {
        return res.status(400).json({ message: 'File URL is required' });
      }

      const filename = fileURL.split('/').pop();
      const filePath = path.join(uploadDir, filename);

      removeFile(filePath);
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ message: 'Error deleting file', error: error.message });
    }
  });

  // Serve static files from uploads directory
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });
} 