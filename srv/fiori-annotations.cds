using { BookshopService } from './bookshop-service';

// Annotations for Books entity
annotate BookshopService.Books with @(
  UI: {
    HeaderInfo: {
      TypeName: 'Book',
      TypeNamePlural: 'Books',
      Title: { Value: title },
      Description: { Value: author }
    },
    SelectionFields: [
      title,
      author,
      price,
      stock
    ],
    LineItem: [
      { Value: title },
      { Value: author },
      { Value: price },
      { Value: currency_code, Label: 'Currency' },
      { Value: stock },
      // DEMO ACTIONS - Bound actions
      {
        $Type: 'UI.DataFieldForAction',
        Label: 'CAP Promote Book',
        Action: 'BookshopService.promoteBook'
      },
      {
        $Type: 'UI.DataFieldForAction',
        Label: 'CAP Set Discount',
        Action: 'BookshopService.setDiscount'
      },
      {
        $Type: 'UI.DataFieldForAction',
        Label: 'CAP Generate Report',
        Action: 'BookshopService.EntityContainer/generateReport'
      },
      {
        $Type: 'UI.DataFieldForAction',
        Label: 'CAP Refresh Catalog',
        Action: 'BookshopService.EntityContainer/refreshCatalog'
      }
    ],
    // NEW: Object page header actions
    Identification: [
      {
        $Type: 'UI.DataFieldForAction',
        Label: 'CAP Half Price',
        Action: 'BookshopService.halfPrice'
      },
      {
        $Type: 'UI.DataFieldForAction',
        Label: 'CAP Show Cover Picture',
        Action: 'BookshopService.showCoverPicture'
      },
      {
        $Type: 'UI.DataFieldForAction',
        Label: 'CAP Add Chapter',
        Action: 'BookshopService.addChapter'
      }
    ],
    Facets: [
      {
        $Type: 'UI.ReferenceFacet',
        Label: 'Book Details',
        Target: '@UI.FieldGroup#BookDetails'
      },
      {
        $Type: 'UI.ReferenceFacet',
        Label: 'Chapters',
        Target: 'chapters/@UI.LineItem'
      },
      {
        $Type: 'UI.ReferenceFacet',
        Label: 'Reviews',
        Target: 'reviews/@UI.LineItem'
      }
    ],
    FieldGroup#BookDetails: {
      Data: [
        { Value: title },
        { Value: author },
        { Value: price },
        { Value: currency_code },
        { Value: stock },
        { Value: description },
        { Value: coverUrl }
      ]
    }
  }
);

// Annotations for Chapters entity
annotate BookshopService.Chapters with @(
  UI: {
    HeaderInfo: {
      TypeName: 'Chapter',
      TypeNamePlural: 'Chapters',
      Title: { Value: title },
      Description: { Value: pageNumber }
    },
    LineItem: [
      { Value: title },
      { Value: pageNumber }
    ],
    Facets: [
      {
        $Type: 'UI.ReferenceFacet',
        Label: 'Chapter Details',
        Target: '@UI.FieldGroup#ChapterDetails'
      }
    ],
    FieldGroup#ChapterDetails: {
      Data: [
        { Value: title },
        { Value: pageNumber },
        { Value: content }
      ]
    }
  }
);

// Annotations for Reviews entity
annotate BookshopService.Reviews with @(
  UI: {
    HeaderInfo: {
      TypeName: 'Review',
      TypeNamePlural: 'Reviews',
      Title: { Value: reviewer },
      Description: { Value: rating }
    },
    LineItem: [
      { Value: reviewer },
      { Value: rating },
      { Value: comment }
    ],
    Facets: [
      {
        $Type: 'UI.ReferenceFacet',
        Label: 'Review Details',
        Target: '@UI.FieldGroup#ReviewDetails'
      }
    ],
    FieldGroup#ReviewDetails: {
      Data: [
        { Value: reviewer },
        { Value: rating },
        { Value: comment }
      ]
    }
  }
);

// Unbound actions are now properly annotated in the Books entity Identification section above

