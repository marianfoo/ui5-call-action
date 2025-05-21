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
}); 