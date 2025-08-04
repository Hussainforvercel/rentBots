import Language from '../data/models/siteadmin/Language';
import { verifyJWTToken } from '../helpers/auth';
import { Op } from 'sequelize';

export default function languageRoutes(app) {
  // Get all languages
  app.get('/api/languages', async (req, res) => {
    try {
      const languages = await Language.findAll({
        order: [['createdAt', 'DESC']]
      });
      res.json(languages);
    } catch (error) {
      console.error('Error fetching languages:', error);
      res.status(500).json({ 
        message: 'Error fetching languages', 
        error: error.message 
      });
    }
  });

  // Create new language
  app.post('/api/languages', async (req, res) => {
    try {
      const { title, code, fileURL } = req.body;

      if (!title || !code) {
        return res.status(400).json({ message: 'Title and code are required' });
      }

      // Check if language code already exists
      const existingLanguage = await Language.findOne({ 
        where: { code: code.toLowerCase() } 
      });
      
      if (existingLanguage) {
        return res.status(400).json({ message: 'Language code already exists' });
      }

      const language = await Language.create({
        title,
        code: code.toLowerCase(),
        fileURL
      });

      res.status(201).json(language);
    } catch (error) {
      console.error('Error creating language:', error);
      res.status(500).json({ 
        message: 'Error creating language', 
        error: error.message 
      });
    }
  });

  // Update language
  app.put('/api/languages/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { title, code, fileURL } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid language ID' });
      }

      if (!title || !code) {
        return res.status(400).json({ message: 'Title and code are required' });
      }

      const language = await Language.findOne({ 
        where: { id } 
      });

      if (!language) {
        return res.status(404).json({ message: 'Language not found' });
      }

      // Check if new code conflicts with existing language
      if (code.toLowerCase() !== language.code) {
        const existingLanguage = await Language.findOne({ 
          where: { 
            code: code.toLowerCase(),
            id: { [Op.ne]: id } // Exclude current language
          } 
        });
        
        if (existingLanguage) {
          return res.status(400).json({ message: 'Language code already exists' });
        }
      }

      await language.update({
        title,
        code: code.toLowerCase(),
        fileURL
      });

      res.json(language);
    } catch (error) {
      console.error('Error updating language:', error);
      res.status(500).json({ 
        message: 'Error updating language', 
        error: error.message 
      });
    }
  });

  // Delete language
  app.delete('/api/languages/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid language ID' });
      }

      const language = await Language.findOne({ 
        where: { id } 
      });

      if (!language) {
        return res.status(404).json({ message: 'Language not found' });
      }

      await language.destroy();
      res.json({ message: 'Language deleted successfully' });
    } catch (error) {
      console.error('Error deleting language:', error);
      res.status(500).json({ 
        message: 'Error deleting language', 
        error: error.message 
      });
    }
  });
} 