const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'feedbacks.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize data file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    // File doesn't exist, create it with empty array
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
    console.log('📝 Created new feedbacks.json file');
  }
}

// Read data from file
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
}

// Write data to file
async function writeData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 AKB Feedback Server Running!',
    endpoints: {
      'GET /feedbacks': 'Get all feedbacks',
      'POST /feedbacks': 'Add new feedback',
      'DELETE /feedbacks/:id': 'Delete feedback by ID',
      'DELETE /feedbacks': 'Clear all feedbacks',
      'GET /stats': 'Get feedback statistics'
    }
  });
});

// Get all feedbacks
app.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await readData();
    console.log(`📊 Returning ${feedbacks.length} feedbacks`);
    res.json({
      success: true,
      data: feedbacks,
      count: feedbacks.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new feedback
app.post('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await readData();
    const newFeedback = {
      id: Date.now().toString(),
      ...req.body,
      timestamp: new Date().toISOString()
    };
    
    feedbacks.push(newFeedback);
    const success = await writeData(feedbacks);
    
    if (success) {
      console.log(`➕ Added feedback: "${newFeedback.text?.substring(0, 30)}..."`);
      res.json({
        success: true,
        data: newFeedback,
        count: feedbacks.length
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save feedback' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete feedback by ID
app.delete('/feedbacks/:id', async (req, res) => {
  try {
    const feedbacks = await readData();
    const initialCount = feedbacks.length;
    const filteredFeedbacks = feedbacks.filter(f => f.id !== req.params.id);
    
    if (filteredFeedbacks.length < initialCount) {
      const success = await writeData(filteredFeedbacks);
      if (success) {
        console.log(`🗑️ Deleted feedback ID: ${req.params.id}`);
        res.json({
          success: true,
          deleted: true,
          count: filteredFeedbacks.length
        });
      } else {
        res.status(500).json({ success: false, error: 'Failed to save after deletion' });
      }
    } else {
      res.status(404).json({ success: false, error: 'Feedback not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear all feedbacks
app.delete('/feedbacks', async (req, res) => {
  try {
    const success = await writeData([]);
    if (success) {
      console.log('🧹 Cleared all feedbacks');
      res.json({
        success: true,
        cleared: true,
        count: 0
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to clear feedbacks' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get statistics
app.get('/stats', async (req, res) => {
  try {
    const feedbacks = await readData();
    
    const stats = {
      total: feedbacks.length,
      positive: feedbacks.filter(f => f.sentiment === 'positive').length,
      negative: feedbacks.filter(f => f.sentiment === 'negative').length,
      neutral: feedbacks.filter(f => f.sentiment === 'neutral').length,
      anonymous: feedbacks.filter(f => f.isAnonymous).length,
      averageRating: feedbacks.length > 0 
        ? feedbacks.reduce((sum, f) => sum + (Number(f.rating) || 0), 0) / feedbacks.length
        : 0,
      categories: {}
    };
    
    // Count by category
    feedbacks.forEach(f => {
      stats.categories[f.category] = (stats.categories[f.category] || 0) + 1;
    });
    
    console.log(`📈 Stats requested: ${stats.total} total feedbacks`);
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
async function startServer() {
  await initializeDataFile();
  
  app.listen(PORT, () => {
    console.log('🚀 AKB Feedback Server Started!');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`📱 Android can connect to: http://192.168.1.XXX:${PORT}`);
    console.log(`🌐 Web can connect to: http://localhost:${PORT}`);
    console.log('📊 Data file:', DATA_FILE);
  });
}

startServer().catch(console.error);
