/* eslint-disable valid-jsdoc */
import ExtensionAPI   from "sap/fe/core/ExtensionAPI";
import ODataModel     from "sap/ui/model/odata/v4/ODataModel";
import Context        from "sap/ui/model/odata/v4/Context";
import MessageToast   from "sap/m/MessageToast";
import Dialog from "sap/m/Dialog";
import Button from "sap/m/Button";
import CodeEditor from "sap/ui/codeeditor/CodeEditor";
import VBox from "sap/m/VBox";
import Title from "sap/m/Title";

// execute is deprecated since 1.123+

// TypeScript interface extension for ExtensionAPI methods not in type definitions
interface ExtendedExtensionAPI extends ExtensionAPI {
    getSelectedContexts(): Context[];
}

/* ------------------------------------------------------------------ */
/* 1  Bound action – NO parameters                                     */
/* ------------------------------------------------------------------ */
export async function customPromoteBook(this : ExtensionAPI): Promise<void> {

  const selectedContexts = (this as ExtendedExtensionAPI).getSelectedContexts();
  const odataModel = this.getModel() as ODataModel;
  const actionPath = "BookshopService.promoteBook(...)";

  const promotePromises = selectedContexts.map((bookContext: Context) => {
    const actionBinding = odataModel.bindContext(actionPath, bookContext);
    return actionBinding.invoke();
  });

  await Promise.all(promotePromises);
  MessageToast.show(`${selectedContexts.length} book(s) promoted`);
}

/* ------------------------------------------------------------------ */
/* 2  Bound action – WITH parameters                                   */
/* ------------------------------------------------------------------ */
export async function customSetDiscount(this : ExtensionAPI): Promise<void> {

  const selectedContexts = (this as ExtendedExtensionAPI).getSelectedContexts();
  const odataModel = this.getModel() as ODataModel;
  const actionPath = "BookshopService.setDiscount(...)";
  
  const discountParameters = { 
    percentage: 15, 
    reason: "HOLIDAY_SALE" 
  };

  const discountPromises = selectedContexts.map((bookContext: Context) => {
    const actionBinding = odataModel.bindContext(actionPath, bookContext);
    
    // Set parameters for the action
    Object.entries(discountParameters).forEach(([parameterName, parameterValue]) => {
      actionBinding.setParameter(parameterName, parameterValue);
    });
    
    return actionBinding.invoke();
  });

  await Promise.all(discountPromises);
  MessageToast.show(`Discount applied to ${selectedContexts.length} book(s)`);
}

/* ------------------------------------------------------------------ */
/* 3  Unbound action – NO parameters                                   */
/* ------------------------------------------------------------------ */
export async function customRefreshCatalog(this : ExtensionAPI): Promise<void> {

  const odataModel = this.getModel() as ODataModel;
  const actionPath = "/BookshopService.refreshCatalog(...)";
  
  const actionBinding = odataModel.bindContext(actionPath);

  await actionBinding.invoke();
  MessageToast.show("Catalog refreshed");
}

/* ------------------------------------------------------------------ */
/* 4  Unbound action – WITH parameters                                 */
/* ------------------------------------------------------------------ */
export async function customGenerateReport(this : ExtensionAPI): Promise<void> {

  const odataModel = this.getModel() as ODataModel;
  const actionPath = "/BookshopService.generateReport(...)";
  
  const reportParameters = {
    reportType: "sales",
    dateFrom: "2024-01-01",
    dateTo: "2024-12-31"
  };

  const actionBinding = odataModel.bindContext(actionPath);

  // Set parameters for the action
  Object.entries(reportParameters).forEach(([parameterName, parameterValue]) => {
    actionBinding.setParameter(parameterName, parameterValue);
  });

  await actionBinding.invoke();

  // If the action returns data you can read it here:
  // const actionResult = actionBinding.getBoundContext()?.getObject();
  MessageToast.show("Report generated");
}

/* ------------------------------------------------------------------ */
/* 5  Function call – Get Current Price                                */
/* ------------------------------------------------------------------ */
export async function customGetCurrentPrice(this : ExtensionAPI): Promise<void> {

  const selectedContexts = (this as ExtendedExtensionAPI).getSelectedContexts();
  if (!selectedContexts || selectedContexts.length === 0) {
    MessageToast.show("Please select a book");
    return;
  }

  const bookContext = selectedContexts[0];
  const odataModel = this.getModel() as ODataModel;
  const functionPath = "BookshopService.getCurrentPrice(...)";
  
  const functionBinding = odataModel.bindContext(functionPath, bookContext);

  await functionBinding.invoke();

  const result = functionBinding.getBoundContext()?.getObject() as {
    price: number;
  };

  if (result && result.price !== null) {
    const price = Number(result.price).toFixed(2);
    MessageToast.show(`Current price: ${price} (CUST Invoke)`);
  } else {
    MessageToast.show("No price data received");
  }
}

/* ------------------------------------------------------------------ */
/* 6  Function call – Get Sum Book Prices                              */
/* ------------------------------------------------------------------ */
export async function customGetSumBookPrices(this : ExtensionAPI): Promise<void> {

  const odataModel = this.getModel() as ODataModel;
  const functionPath = "/BookshopService.getSumBookPrices(...)";
  
  const functionBinding = odataModel.bindContext(functionPath);

  await functionBinding.invoke();

  const result = functionBinding.getBoundContext()?.getObject() as {
    totalPrice: number;
  };

  if (result && result.totalPrice !== null) {
    const totalPrice = Number(result.totalPrice).toFixed(2);
    MessageToast.show(`Total price of all books: ${totalPrice} (CUST Invoke)`);
  } else {
    MessageToast.show("No total price data received");
  }
}

/* ------------------------------------------------------------------ */
/* 7  NEW: UNBOUND action – Complex action with nested parameters      */
/* ------------------------------------------------------------------ */
export async function customCreateBooksAndChapters(this : ExtensionAPI): Promise<void> {

  const odataModel = this.getModel() as ODataModel;
  const actionPath = "/BookshopService.createBooksAndChapters(...)";
  
  // Sample data for creating multiple books with chapters
  const booksData = [
    {
      title: "Advanced UI5 Development",
      author: "John Developer",
      price: 49.99,
      currency: "EUR",
      stock: 10,
      description: "A comprehensive guide to advanced UI5 development techniques",
      coverUrl: "./images/ui5-book-cover.jpg",
      chapters: [
        {
          title: "Introduction to Advanced Concepts",
          content: "This chapter covers the basics of advanced UI5 development...",
          pageNumber: 1
        },
        {
          title: "Custom Controls",
          content: "Learn how to create custom UI5 controls...",
          pageNumber: 15
        },
        {
          title: "Performance Optimization",
          content: "Best practices for optimizing UI5 applications...",
          pageNumber: 30
        }
      ]
    },
    {
      title: "SAP Fiori Elements Mastery",
      author: "Jane Expert",
      price: 39.99,
      currency: "EUR",
      stock: 15,
      description: "Master the art of SAP Fiori Elements development",
      coverUrl: "./images/fiori-book-cover.jpg",
      chapters: [
        {
          title: "Fiori Elements Overview",
          content: "Understanding the Fiori Elements framework...",
          pageNumber: 1
        },
        {
          title: "List Report and Object Page",
          content: "Building effective list reports and object pages...",
          pageNumber: 20
        }
      ]
    }
  ];

  const actionBinding = odataModel.bindContext(actionPath);

  // Set the complex parameter for the action
  actionBinding.setParameter("booksData", booksData);

  await actionBinding.invoke();

  // Get the result if needed
  const actionResult = actionBinding.getBoundContext()?.getObject() as {
    message: string;
    createdBooks: {
      ID: string;
      title: string;
      author: string;
      price: number;
      currency: string;
      stock: number;
      description: string;
      coverUrl: string;
      chapters: {
        ID: string;
        title: string;
        content: string;
        pageNumber: number;
      }[];
    }[];
  };

  // Create dialog with CodeEditor to show the response
  const codeEditor = new CodeEditor({
    type: "json",
    height: "400px",
    editable: false
  });

  codeEditor.setValue(JSON.stringify(actionResult, null, 2));

  const dialog = new Dialog({
    title: "Create Books and Chapters - Response (Invoke)",
    contentWidth: "800px",
    contentHeight: "600px",
    verticalScrolling: false,
    content: [
      new VBox({
        items: [
          new Title({
            text: "Action Response Data:",
            level: "H3"
          }),
          codeEditor
        ]
      })
    ],
    beginButton: new Button({
      text: "Close",
      press: function() {
        dialog.close();
        dialog.destroy();
      }
    })
  });

  dialog.open();
}
