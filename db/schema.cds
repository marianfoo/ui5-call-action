namespace com.bookshop;

using { Currency, managed, cuid } from '@sap/cds/common';

@odata.draft.enabled
entity Books : managed, cuid {
  title        : String(100) @title: 'Title';
  author       : String(100) @title: 'Author';
  price        : Decimal(9,2) @title: 'Price';
  currency     : Currency @title: 'Currency';
  stock        : Integer @title: 'Stock';
  description  : String(1000) @title: 'Description';
  coverUrl     : String(500) @title: 'Cover Image URL';
  
  // Composition - one-to-many relationship
  chapters     : Composition of many Chapters on chapters.book = $self;
  
  // Association - one-to-many relationship
  reviews      : Association to many Reviews on reviews.book = $self;
}

entity Chapters : managed, cuid {
  title        : String(100) @title: 'Chapter Title';
  content      : String(5000) @title: 'Content';
  pageNumber   : Integer @title: 'Page Number';
  
  // Association back to parent
  book         : Association to Books;
}

@odata.draft.enabled
entity Reviews : managed, cuid {
  reviewer     : String(100) @title: 'Reviewer';
  rating       : Integer @title: 'Rating' @assert.range: [1, 5];
  comment      : String(1000) @title: 'Comment';
  
  // Association back to parent
  book         : Association to Books;
} 