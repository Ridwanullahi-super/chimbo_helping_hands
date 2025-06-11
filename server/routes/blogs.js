const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Helper function to generate slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Helper function to get author name
async function getAuthorName(authorId) {
  try {
    const [users] = await pool.execute(
      'SELECT first_name, last_name FROM users WHERE id = ?',
      [authorId]
    );
    
    if (users.length > 0) {
      return `${users[0].first_name} ${users[0].last_name}`;
    }
    return 'Unknown Author';
  } catch (error) {
    return 'Unknown Author';
  }
}

// Upload image endpoint
router.post('/upload-image', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const imageUrl = `/api/blogs/images/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Serve uploaded images
router.get('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(uploadsDir, filename);
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({
      success: false,
      message: 'Image not found'
    });
  }
});

// Get all blogs (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || 'published';
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE b.status = ?';
    let queryParams = [status];

    if (search) {
      whereClause += ' AND (b.title LIKE ? OR b.content LIKE ? OR b.excerpt LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Get blogs with author information
    const [blogs] = await pool.execute(`
      SELECT 
        b.id, b.title, b.slug, b.excerpt, b.featured_image, b.status,
        b.tags, b.meta_description, b.created_at, b.updated_at,
        CONCAT(u.first_name, ' ', u.last_name) as author
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
      ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `, [...queryParams, limit, offset]);

    // Get total count
    const [countResult] = await pool.execute(`
      SELECT COUNT(*) as total
      FROM blogs b
      ${whereClause}
    `, queryParams);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Parse tags JSON
    const blogsWithParsedTags = blogs.map(blog => ({
      ...blog,
      tags: blog.tags ? JSON.parse(blog.tags) : []
    }));

    res.json({
      success: true,
      data: {
        blogs: blogsWithParsedTags,
        pagination: {
          currentPage: page,
          totalPages,
          total,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blogs',
      error: error.message
    });
  }
});

// Get all blogs for admin (includes drafts)
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams = [];

    if (search) {
      whereClause = 'WHERE (b.title LIKE ? OR b.content LIKE ? OR b.excerpt LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Get blogs with author information
    const [blogs] = await pool.execute(`
      SELECT 
        b.id, b.title, b.slug, b.excerpt, b.featured_image, b.status,
        b.tags, b.meta_description, b.created_at, b.updated_at,
        CONCAT(u.first_name, ' ', u.last_name) as author
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
      ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `, [...queryParams, limit, offset]);

    // Get total count
    const [countResult] = await pool.execute(`
      SELECT COUNT(*) as total
      FROM blogs b
      ${whereClause}
    `, queryParams);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Parse tags JSON
    const blogsWithParsedTags = blogs.map(blog => ({
      ...blog,
      tags: blog.tags ? JSON.parse(blog.tags) : []
    }));

    res.json({
      success: true,
      data: {
        blogs: blogsWithParsedTags,
        pagination: {
          currentPage: page,
          totalPages,
          total,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Get admin blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blogs',
      error: error.message
    });
  }
});

// Get single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const [blogs] = await pool.execute(`
      SELECT 
        b.id, b.title, b.slug, b.content, b.excerpt, b.featured_image, 
        b.status, b.tags, b.meta_description, b.created_at, b.updated_at,
        CONCAT(u.first_name, ' ', u.last_name) as author_name,
        u.email as author_email
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.slug = ? AND b.status = 'published'
    `, [slug]);

    if (blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const blog = blogs[0];
    blog.tags = blog.tags ? JSON.parse(blog.tags) : [];
    blog.author = {
      name: blog.author_name,
      email: blog.author_email
    };
    delete blog.author_name;
    delete blog.author_email;

    res.json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blog post',
      error: error.message
    });
  }
});

// Get single blog by ID (admin)
router.get('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [blogs] = await pool.execute(`
      SELECT 
        b.id, b.title, b.slug, b.content, b.excerpt, b.featured_image, 
        b.status, b.tags, b.meta_description, b.created_at, b.updated_at,
        CONCAT(u.first_name, ' ', u.last_name) as author_name,
        u.email as author_email
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.id = ?
    `, [id]);

    if (blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const blog = blogs[0];
    blog.tags = blog.tags ? JSON.parse(blog.tags) : [];
    blog.author = {
      name: blog.author_name,
      email: blog.author_email
    };
    delete blog.author_name;
    delete blog.author_email;

    res.json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blog post',
      error: error.message
    });
  }
});

// Create new blog
router.post('/', authenticateToken, requireAdmin, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('excerpt').optional().trim(),
  body('featured_image').optional().trim(),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published']),
  body('meta_description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      content,
      excerpt,
      featured_image,
      tags,
      status = 'draft',
      meta_description
    } = req.body;

    // Generate unique slug
    let slug = generateSlug(title);
    const [existingSlugs] = await pool.execute(
      'SELECT slug FROM blogs WHERE slug LIKE ?',
      [`${slug}%`]
    );

    if (existingSlugs.length > 0) {
      const slugNumbers = existingSlugs
        .map(row => row.slug)
        .filter(existingSlug => existingSlug.startsWith(slug))
        .map(existingSlug => {
          const match = existingSlug.match(/-(\d+)$/);
          return match ? parseInt(match[1]) : 0;
        });

      const maxNumber = Math.max(0, ...slugNumbers);
      slug = `${slug}-${maxNumber + 1}`;
    }

    // Insert blog
    const [result] = await pool.execute(`
      INSERT INTO blogs (
        title, slug, content, excerpt, featured_image, author_id, 
        status, tags, meta_description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      slug,
      content,
      excerpt || null,
      featured_image || null,
      req.user.id,
      status,
      tags ? JSON.stringify(tags) : null,
      meta_description || null
    ]);

    // Get created blog with author info
    const [createdBlog] = await pool.execute(`
      SELECT 
        b.id, b.title, b.slug, b.content, b.excerpt, b.featured_image, 
        b.status, b.tags, b.meta_description, b.created_at, b.updated_at,
        CONCAT(u.first_name, ' ', u.last_name) as author
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.id = ?
    `, [result.insertId]);

    const blog = createdBlog[0];
    blog.tags = blog.tags ? JSON.parse(blog.tags) : [];

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: blog
    });

  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message
    });
  }
});

// Update blog
router.put('/:id', authenticateToken, requireAdmin, [
  body('title').optional().trim().isLength({ min: 1 }),
  body('content').optional().trim().isLength({ min: 1 }),
  body('excerpt').optional().trim(),
  body('featured_image').optional().trim(),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published']),
  body('meta_description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      featured_image,
      tags,
      status,
      meta_description
    } = req.body;

    // Check if blog exists
    const [existingBlog] = await pool.execute(
      'SELECT id, title, slug FROM blogs WHERE id = ?',
      [id]
    );

    if (existingBlog.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const updates = {};
    const setParts = [];
    const values = [];

    if (title !== undefined) {
      updates.title = title;
      setParts.push('title = ?');
      values.push(title);

      // Update slug if title changed
      if (title !== existingBlog[0].title) {
        let newSlug = generateSlug(title);
        const [existingSlugs] = await pool.execute(
          'SELECT slug FROM blogs WHERE slug LIKE ? AND id != ?',
          [`${newSlug}%`, id]
        );

        if (existingSlugs.length > 0) {
          const slugNumbers = existingSlugs
            .map(row => row.slug)
            .filter(existingSlug => existingSlug.startsWith(newSlug))
            .map(existingSlug => {
              const match = existingSlug.match(/-(\d+)$/);
              return match ? parseInt(match[1]) : 0;
            });

          const maxNumber = Math.max(0, ...slugNumbers);
          newSlug = `${newSlug}-${maxNumber + 1}`;
        }

        updates.slug = newSlug;
        setParts.push('slug = ?');
        values.push(newSlug);
      }
    }

    if (content !== undefined) {
      updates.content = content;
      setParts.push('content = ?');
      values.push(content);
    }

    if (excerpt !== undefined) {
      updates.excerpt = excerpt;
      setParts.push('excerpt = ?');
      values.push(excerpt || null);
    }

    if (featured_image !== undefined) {
      updates.featured_image = featured_image;
      setParts.push('featured_image = ?');
      values.push(featured_image || null);
    }

    if (tags !== undefined) {
      updates.tags = tags;
      setParts.push('tags = ?');
      values.push(tags ? JSON.stringify(tags) : null);
    }

    if (status !== undefined) {
      updates.status = status;
      setParts.push('status = ?');
      values.push(status);
    }

    if (meta_description !== undefined) {
      updates.meta_description = meta_description;
      setParts.push('meta_description = ?');
      values.push(meta_description || null);
    }

    if (setParts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(id);

    await pool.execute(
      `UPDATE blogs SET ${setParts.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    // Get updated blog with author info
    const [updatedBlog] = await pool.execute(`
      SELECT 
        b.id, b.title, b.slug, b.content, b.excerpt, b.featured_image, 
        b.status, b.tags, b.meta_description, b.created_at, b.updated_at,
        CONCAT(u.first_name, ' ', u.last_name) as author
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.id = ?
    `, [id]);

    const blog = updatedBlog[0];
    blog.tags = blog.tags ? JSON.parse(blog.tags) : [];

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: blog
    });

  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog post',
      error: error.message
    });
  }
});

// Delete blog
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if blog exists
    const [existingBlog] = await pool.execute(
      'SELECT id, featured_image FROM blogs WHERE id = ?',
      [id]
    );

    if (existingBlog.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Delete the blog
    await pool.execute('DELETE FROM blogs WHERE id = ?', [id]);

    // Delete associated image file if it's a local upload
    const blog = existingBlog[0];
    if (blog.featured_image && blog.featured_image.startsWith('/api/blogs/images/')) {
      const filename = blog.featured_image.split('/').pop();
      const imagePath = path.join(uploadsDir, filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });

  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog post',
      error: error.message
    });
  }
});

// Delete uploaded image
router.delete('/images/:filename', authenticateToken, requireAdmin, (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(uploadsDir, filename);
    
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

module.exports = router;