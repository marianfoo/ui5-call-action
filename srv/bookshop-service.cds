using { com.bookshop as my } from '../db/schema';

service BookshopService @(path: '/bookshop') {

  entity Books as projection on my.Books actions {
    // 1. Demo bound action WITHOUT parameters
    action promoteBook() returns {
      message: String;
      promoted: Boolean;
    };

    // 2. Demo bound action WITH parameters
    action setDiscount(percentage: Integer, reason: String) returns {
      message: String;
      newPrice: Decimal;
    };

    // 3. NEW: Add Chapter action WITH parameters
    action addChapter(title: String, pageNumber: Integer, content: String) returns {
      ID: UUID;
      title: String;
      pageNumber: Integer;
      content: String;
    };

    // 4. Half Price action WITHOUT parameters
    action halfPrice() returns {
      ID: UUID;
      title: String;
      price: Decimal;
    };

    // 5. Show Cover Picture action WITHOUT parameters
    action showCoverPicture() returns {
      value: String;
    };

    function getCurrentPrice() returns {
      price: Decimal;
    };

    //bound to the collection and not a specific instance of Books
    action massHalfPrice (books: many $self) returns array of Books;
    action similarBooks (book: $self) returns array of Books;
  };

  action massHalfPrice (books: many Books) returns array of Books;

  // 3. Unbound action WITHOUT parameters
  action refreshCatalog() returns {
    message: String;
    refreshedAt: DateTime;
  };

  // 4. Unbound action WITH parameters
  action generateReport(reportType: String, dateFrom: Date, dateTo: Date) returns {
    message: String;
    reportUrl: String;
  };

  // 6. NEW: Complex unbound action WITH nested parameters
  action createBooksAndChapters(booksData: array of {
    title: String;
    author: String;
    price: Decimal;
    currency: String;
    stock: Integer;
    description: String;
    coverUrl: String;
    chapters: array of {
      title: String;
      content: String;
      pageNumber: Integer;
    };
  }) returns {
    message: String;
    createdBooks: array of {
      ID: UUID;
      title: String;
      author: String;
      price: Decimal;
      currency: String;
      stock: Integer;
      description: String;
      coverUrl: String;
      chapters: array of {
        ID: UUID;
        title: String;
        content: String;
        pageNumber: Integer;
      };
    };
  };

  // 5. Unbound function WITHOUT parameters
  function getSumBookPrices() returns {
    totalPrice: Decimal;
  };

  entity Chapters as projection on my.Chapters;
  entity Reviews as projection on my.Reviews;
} 