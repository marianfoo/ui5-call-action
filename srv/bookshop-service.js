const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
  const { Books, Chapters } = this.entities;

  // DEMO ACTIONS - 4 types of actions for demonstration

  // 1. Bound action WITHOUT parameters
  this.on('promoteBook', async (req) => {
    const books = await cds.read(Books).where({ ID: req.params[0].ID });
    const book = books[0];
    
    if (!book) {
      req.error(`Book with ID ${req.params[0].ID} not found`);
      return { message: 'Book not found', promoted: false };
    }
    
    req.info(`Book "${book.title}" has been promoted successfully`);
    return {
      message: `Book "${book.title}" has been promoted to featured status`,
      promoted: true
    };
  });

  // 2. Bound action WITH parameters
  this.on('setDiscount', async (req) => {
    const { percentage, reason } = req.data;
    const books = await cds.read(Books).where({ ID: req.params[0].ID });
    const book = books[0];
    
    if (!book) {
      req.error(`Book with ID ${req.params[0].ID} not found`);
      return { message: 'Book not found', newPrice: 0 };
    }
    
    if (percentage < 0 || percentage > 100) {
      req.error('Discount percentage must be between 0 and 100');
      return { message: 'Invalid discount percentage', newPrice: book.price };
    }
    
    const newPrice = book.price * (1 - percentage / 100);
    
    // Update the book price
    await cds.update(Books)
      .set({ price: newPrice })
      .where({ ID: req.params[0].ID });
    
    req.info(`Applied ${percentage}% discount to "${book.title}" - Reason: ${reason}`);
    return {
      message: `${percentage}% discount applied to "${book.title}" - Reason: ${reason}`,
      newPrice: newPrice
    };
  });

  // NEW ACTIONS - Implementation for addChapter, halfPrice, showCoverPicture

  // 3. NEW: Add Chapter action WITH parameters
  this.on('addChapter', async (req) => {
    const { title, pageNumber, content } = req.data;
    const bookId = req.params[0].ID;
    
    // Verify the book exists
    const books = await cds.read(Books).where({ ID: bookId });
    const book = books[0];
    
    if (!book) {
      req.error(`Book with ID ${bookId} not found`);
      return;
    }
    
    // Create new chapter
    const newChapter = await cds.create(Chapters).entries({
      title: title,
      pageNumber: pageNumber,
      content: content,
      book_ID: bookId
    });
    
    req.info(`Chapter "${title}" added to book "${book.title}"`);
    return {
      ID: newChapter.ID,
      title: title,
      pageNumber: pageNumber,
      content: content
    };
  });

  // 4. NEW: Half Price action WITHOUT parameters
  this.on('halfPrice', async (req) => {
    const bookId = req.params[0].ID;
    const books = await cds.read(Books).where({ ID: bookId });
    const book = books[0];
    
    if (!book) {
      req.error(`Book with ID ${bookId} not found`);
      return;
    }
    
    const newPrice = book.price * 0.5;
    
    // Update the book price
    await cds.update(Books)
      .set({ price: newPrice })
      .where({ ID: bookId });
    
    req.info(`Price of "${book.title}" reduced to half: ${newPrice}`);
    return {
      ID: bookId,
      title: book.title,
      price: newPrice
    };
  });

  // 5. NEW: Show Cover Picture action WITHOUT parameters
  this.on('showCoverPicture', async (req) => {
    const bookId = req.params[0].ID;
    const books = await cds.read(Books).where({ ID: bookId });
    const book = books[0];
    
    if (!book) {
      req.error(`Book with ID ${bookId} not found`);
      return { value: null };
    }
    
    if (!book.coverUrl) {
      req.warn(`Book "${book.title}" does not have a cover image`);
      return { value: null };
    }
    
    req.info(`Showing cover picture for "${book.title}"`);
    return { value: book.coverUrl };
  });

  // DEMO FUNCTION - getCurrentPrice function implementation
  this.on('getCurrentPrice', async (req) => {
    const bookId = req.params[0].ID;
    
    const books = await cds.read(Books).where({ ID: bookId });
    const book = books[0];
    
    if (!book) {
      req.error(`Book with ID ${bookId} not found`);
      return { price: null };
    }
    
    req.info(`Current price for "${book.title}": ${book.price}`);
    return {
      price: book.price
    };
  });

  // DEMO FUNCTION - getSumBookPrices function implementation
  this.on('getSumBookPrices', async (req) => {
    const books = await cds.read(Books, ['price']);
    
    const totalPrice = books.reduce((sum, book) => {
      return sum + (book.price || 0);
    }, 0);
    
    req.info(`Total price of all books: ${totalPrice}`);
    return {
      totalPrice: totalPrice
    };
  });

  // 3. Unbound action WITHOUT parameters
  this.on('refreshCatalog', async (req) => {
    const refreshedAt = new Date();
    
    // In a real app, we would refresh product catalog from external sources
    req.info('Book catalog refreshed successfully');
    return {
      message: 'Book catalog has been refreshed successfully',
      refreshedAt: refreshedAt
    };
  });

  // 4. Unbound action WITH parameters
  this.on('generateReport', async (req) => {
    const { reportType, dateFrom, dateTo } = req.data;
    
    if (!reportType) {
      req.error('Report type is required');
      return { message: 'Report type is required', reportUrl: null };
    }
    
    if (!dateFrom || !dateTo) {
      req.error('Date range is required');
      return { message: 'Date range is required', reportUrl: null };
    }
    
    // Generate mock report URL
    const reportUrl = `/api/reports/${reportType}_${dateFrom}_${dateTo}.pdf`;
    
    req.info(`Generated ${reportType} report for period ${dateFrom} to ${dateTo}`);
    return {
      message: `${reportType} report generated for period ${dateFrom} to ${dateTo}`,
      reportUrl: reportUrl
    };
  });

  // 6. NEW: Complex unbound action WITH nested parameters
  this.on('createBooksAndChapters', async (req) => {
    const { booksData } = req.data;
    
    if (!booksData || !Array.isArray(booksData) || booksData.length === 0) {
      req.error('Books data is required and must be a non-empty array');
      return { message: 'Invalid books data', createdBooks: [] };
    }
    
    const createdBooks = [];
    
    try {
      // Process each book and its chapters
      for (const bookData of booksData) {
        // Validate required book fields
        if (!bookData.title || !bookData.author) {
          req.error('Book title and author are required');
          continue;
        }
        
        // Create the book
        const newBook = await cds.create(Books).entries({
          title: bookData.title,
          author: bookData.author,
          price: bookData.price || 0,
          currency: { code: bookData.currency || 'EUR' },
          stock: bookData.stock || 0,
          description: bookData.description || '',
          coverUrl: bookData.coverUrl || ''
        });
        
        const createdChapters = [];
        
        // Create chapters if provided
        if (bookData.chapters && Array.isArray(bookData.chapters)) {
          for (const chapterData of bookData.chapters) {
            if (chapterData.title) {
              const newChapter = await cds.create(Chapters).entries({
                title: chapterData.title,
                content: chapterData.content || '',
                pageNumber: chapterData.pageNumber || 1,
                book_ID: newBook.ID
              });
              
              createdChapters.push({
                ID: newChapter.ID,
                title: chapterData.title,
                content: chapterData.content || '',
                pageNumber: chapterData.pageNumber || 1
              });
            }
          }
        }
        
        // Add the created book with its chapters to the result
        createdBooks.push({
          ID: newBook.ID,
          title: bookData.title,
          author: bookData.author,
          price: bookData.price || 0,
          currency: bookData.currency || 'EUR',
          stock: bookData.stock || 0,
          description: bookData.description || '',
          coverUrl: bookData.coverUrl || '',
          chapters: createdChapters
        });
      }
      
      req.info(`Successfully created ${createdBooks.length} books with their chapters`);
      return {
        message: `Successfully created ${createdBooks.length} books with their chapters`,
        createdBooks: createdBooks
      };
      
    } catch (error) {
      req.error(`Failed to create books and chapters: ${error.message}`);
      return {
        message: `Failed to create books and chapters: ${error.message}`,
        createdBooks: []
      };
    }
  });
}); 