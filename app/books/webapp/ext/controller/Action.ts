/* eslint-disable valid-jsdoc */
import ExtensionAPI from "sap/fe/core/ExtensionAPI";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import MessageToast from "sap/m/MessageToast";
import Context from "sap/ui/model/odata/v4/Context";
import Dialog from "sap/m/Dialog";
import Button from "sap/m/Button";
import CodeEditor from "sap/ui/codeeditor/CodeEditor";
import VBox from "sap/m/VBox";
import Title from "sap/m/Title";

// TypeScript interface extension for ExtensionAPI methods not in type definitions
interface ExtendedExtensionAPI extends ExtensionAPI {
    getSelectedContexts(): Context[];
}

// DEMO ACTIONS - 4 types of actions for demonstration

/**
 * 1. Bound action WITHOUT parameters - CUSTOM implementation via invokeAction
 */
export async function customPromoteBook(this: ExtensionAPI) {
    const contexts = (this as ExtendedExtensionAPI).getSelectedContexts();
    await this.getEditFlow().invokeAction("BookshopService.promoteBook", { contexts: contexts });
}


/**
 * 2. Bound action WITH parameters - CUSTOM implementation
 */
export async function customSetDiscount(this: ExtensionAPI) {
    const contexts = (this as ExtendedExtensionAPI).getSelectedContexts();
    await this.getEditFlow().invokeAction("BookshopService.setDiscount", { 
        contexts: contexts,
        parameterValues: [{ name: "percentage", value: 15 }, { name: "reason", value: "HOLIDAY_SALE" }]
    });
}


/**
 * 3. Unbound action WITHOUT parameters - CUSTOM implementation
 */
export async function customRefreshCatalog(this: ExtensionAPI) {
    await this.getEditFlow().invokeAction("refreshCatalog", { 
        model: this.getModel() as ODataModel
    });
}


/**
 * 4. Unbound action WITH parameters - CUSTOM implementation
 */
export async function customGenerateReport(this: ExtensionAPI) {
    await this.getEditFlow().invokeAction("generateReport", { 
        model: this.getModel() as ODataModel,
        parameterValues: [
            { name: "reportType", value: "sales" },
            { name: "dateFrom", value: "2024-01-01" },
            { name: "dateTo", value: "2024-12-31" }
        ]
    });
}

/**
 * 5. Function call - Get Current Price function implementation
 */
export async function customGetCurrentPrice(this: ExtensionAPI) {
    try {
        const contexts = (this as ExtendedExtensionAPI).getSelectedContexts();
        if (!contexts || contexts.length === 0) {
            MessageToast.show("Please select a book");
            return;
        }

        const bookContext = contexts[0];
        const model = this.getModel() as ODataModel;
        const functionPath = "BookshopService.getCurrentPrice(...)";
        
        const functionBinding = model.bindContext(functionPath, bookContext);
        
        await functionBinding.invoke();
        
        const result = functionBinding.getBoundContext()?.getObject() as {
            price: number;
        };

        if (result && result.price !== null) {
            const price = Number(result.price).toFixed(2);
            MessageToast.show(`Current price: ${price} (CUST)`);
        } else {
            MessageToast.show("No price data received");
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        MessageToast.show("Failed to get current price: " + errorMessage);
    }
}

/**
 * 6. Function call - Get Sum Book Prices function implementation
 */
export async function customGetSumBookPrices(this: ExtensionAPI) {
    try {
        const model = this.getModel() as ODataModel;
        const functionPath = "/BookshopService.getSumBookPrices(...)";
        
        const functionBinding = model.bindContext(functionPath);
        
        await functionBinding.invoke();
        
        const result = functionBinding.getBoundContext()?.getObject() as {
            totalPrice: number;
        };

        if (result && result.totalPrice !== null) {
            const totalPrice = Number(result.totalPrice).toFixed(2);
            MessageToast.show(`Total price of all books: ${totalPrice} (CUST)`);
        } else {
            MessageToast.show("No total price data received");
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        MessageToast.show("Failed to get sum book prices: " + errorMessage);
    }
}

/**
 * 7. NEW: Complex unbound action - Create Books and Chapters
 */
export async function customCreateBooksAndChapters(this: ExtensionAPI) {
    try {
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

        const result = await this.getEditFlow().invokeAction("createBooksAndChapters", {
            model: this.getModel() as ODataModel,
            parameterValues: [{ name: "booksData", value: booksData }],
            skipParameterDialog: true
        });
        
        // Create dialog with CodeEditor to show the response
        const codeEditor = new CodeEditor({
            type: "json",
            height: "400px",
            editable: false
        });

        codeEditor.setValue(JSON.stringify(result, null, 2));

        const dialog = new Dialog({
            title: "Create Books and Chapters - Response",
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
        
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        MessageToast.show("Failed to create books and chapters: " + errorMessage);
    }
}