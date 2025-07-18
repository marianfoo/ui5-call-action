/* eslint-disable valid-jsdoc */
import Controller from "sap/ui/core/mvc/Controller";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import Context from "sap/ui/model/odata/v4/Context";
import MessageToast from "sap/m/MessageToast";
import Dialog from "sap/m/Dialog";
import Button from "sap/m/Button";
import CodeEditor from "sap/ui/codeeditor/CodeEditor";
import VBox from "sap/m/VBox";
import Title from "sap/m/Title";

/**
 * @namespace com.freestyle.controller
 */
export default class MainView extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        const view = this.getView();
        if (view) {
            view.bindElement({ path: "/Books(ID=3afb35fa-e2c9-40d0-8e22-90e96ead9944,IsActiveEntity=true)" });
        }

    }

    /* ================================================================== */
    /* ACTION FUNCTIONS USING execute() - DEPRECATED SINCE UI5 1.123+    */
    /* ================================================================== */

    /* ------------------------------------------------------------------ */
    /* 1.  BOUND action – NO parameters (execute)                        */
    /* ------------------------------------------------------------------ */
    public async executePromoteBook(): Promise<void> {

        const odataModel = this.getView()?.getModel() as ODataModel;
        const bookContext = this.getView()?.getBindingContext() as Context;
        
        if (!bookContext) {
            MessageToast.show("No book context available");
            return;
        }

        const actionPath = "BookshopService.promoteBook(...)";
        const actionBinding = odataModel.bindContext(actionPath, bookContext);

        await actionBinding.execute();
        MessageToast.show("Book promoted (Execute)");
    }

    /* ------------------------------------------------------------------ */
    /* 2.  BOUND action – WITH parameters (execute)                      */
    /* ------------------------------------------------------------------ */
    public async executeSetDiscount(): Promise<void> {

        const odataModel = this.getView()?.getModel() as ODataModel;
        const bookContext = this.getView()?.getBindingContext() as Context;
        
        if (!bookContext) {
            MessageToast.show("No book context available");
            return;
        }

        const actionPath = "BookshopService.setDiscount(...)";
        const discountParameters = { 
            percentage: 15, 
            reason: "HOLIDAY_SALE" 
        };

        const actionBinding = odataModel.bindContext(actionPath, bookContext);
        
        // Set parameters for the action
        Object.entries(discountParameters).forEach(([parameterName, parameterValue]) => {
            actionBinding.setParameter(parameterName, parameterValue);
        });

        await actionBinding.execute();
        MessageToast.show("Discount applied: 15% (Execute)");
    }

    /* ------------------------------------------------------------------ */
    /* 3.  UNBOUND action – NO parameters (execute)                      */
    /* ------------------------------------------------------------------ */
    public async executeRefreshCatalog(): Promise<void> {

        const odataModel = this.getView()?.getModel() as ODataModel;
        const actionPath = "/BookshopService.refreshCatalog(...)";
        
        const actionBinding = odataModel.bindContext(actionPath);

        await actionBinding.execute();
        MessageToast.show("Catalog refreshed (Execute)");
    }

    /* ------------------------------------------------------------------ */
    /* 4.  UNBOUND action – WITH parameters (execute)                    */
    /* ------------------------------------------------------------------ */
    public async executeGenerateReport(): Promise<void> {

        const odataModel = this.getView()?.getModel() as ODataModel;
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

        await actionBinding.execute();
        MessageToast.show("Report generated (Execute)");
    }

    /* ------------------------------------------------------------------ */
    /* 5.  BOUND FUNCTION call – Get Current Price (execute)             */
    /* ------------------------------------------------------------------ */
    public async executeGetCurrentPrice(): Promise<void> {

        const odataModel = this.getView()?.getModel() as ODataModel;
        const bookContext = this.getView()?.getBindingContext() as Context;
        
        if (!bookContext) {
            MessageToast.show("No book context available");
            return;
        }

        const functionPath = "BookshopService.getCurrentPrice(...)";
        const functionBinding = odataModel.bindContext(functionPath, bookContext);

        await functionBinding.execute();

        const result = functionBinding.getBoundContext()?.getObject() as {
            price: number;
        };

        if (result && result.price !== null) {
            const price = Number(result.price).toFixed(2);
            MessageToast.show(`Current price: ${price} (Execute)`);
        } else {
            MessageToast.show("No price data received (Execute)");
        }
    }

    /* ================================================================== */
    /* ACTION FUNCTIONS USING invoke() - RECOMMENDED SINCE UI5 1.123+    */
    /* ================================================================== */

    /* ------------------------------------------------------------------ */
    /* 1  Bound action – NO parameters (invoke)                          */
    /* ------------------------------------------------------------------ */
    public async invokePromoteBook(): Promise<void> {

        const odataModel = this.getView()?.getModel() as ODataModel;
        const bookContext = this.getView()?.getBindingContext() as Context;
        
        if (!bookContext) {
            MessageToast.show("No book context available");
            return;
        }

        const actionPath = "BookshopService.promoteBook(...)";
        const actionBinding = odataModel.bindContext(actionPath, bookContext);

        await actionBinding.invoke();
        MessageToast.show("Book promoted (Invoke)");
    }

    /* ------------------------------------------------------------------ */
    /* 2  Bound action – WITH parameters (invoke)                        */
    /* ------------------------------------------------------------------ */
    public async invokeSetDiscount(): Promise<void> {

        const odataModel = this.getView()?.getModel() as ODataModel;
        const bookContext = this.getView()?.getBindingContext() as Context;
        
        if (!bookContext) {
            MessageToast.show("No book context available");
            return;
        }

        const actionPath = "BookshopService.setDiscount(...)";
        const discountParameters = { 
            percentage: 25, 
            reason: "BLACK_FRIDAY" 
        };

        const actionBinding = odataModel.bindContext(actionPath, bookContext);
        
        // Set parameters for the action
        Object.entries(discountParameters).forEach(([parameterName, parameterValue]) => {
            actionBinding.setParameter(parameterName, parameterValue);
        });

        await actionBinding.invoke();
        MessageToast.show("Discount applied: 25% (Invoke)");
    }

    /* ------------------------------------------------------------------ */
    /* 3  Unbound action – NO parameters (invoke)                        */
    /* ------------------------------------------------------------------ */
    public async invokeRefreshCatalog(): Promise<void> {

        const odataModel = this.getView()?.getModel() as ODataModel;
        const actionPath = "/BookshopService.refreshCatalog(...)";
        
        const actionBinding = odataModel.bindContext(actionPath);

        await actionBinding.invoke();
        MessageToast.show("Catalog refreshed (Invoke)");
    }

    /* ------------------------------------------------------------------ */
    /* 4  Unbound action – WITH parameters (invoke)                      */
    /* ------------------------------------------------------------------ */
    public async invokeGenerateReport(): Promise<void> {

        const odataModel = this.getView()?.getModel() as ODataModel;
        const actionPath = "/BookshopService.generateReport(...)";
        
        const reportParameters = {
            reportType: "inventory",
            dateFrom: "2024-01-01",
            dateTo: "2024-12-31"
        };

        const actionBinding = odataModel.bindContext(actionPath);

        // Set parameters for the action
        Object.entries(reportParameters).forEach(([parameterName, parameterValue]) => {
            actionBinding.setParameter(parameterName, parameterValue);
        });

        await actionBinding.invoke();
        MessageToast.show("Report generated (Invoke)");
    }

    /* ------------------------------------------------------------------ */
    /* 5  BOUND FUNCTION call – Get Current Price (invoke)               */
    /* ------------------------------------------------------------------ */
    public async invokeGetCurrentPrice(): Promise<void> {

        const odataModel = this.getView()?.getModel() as ODataModel;
        const bookContext = this.getView()?.getBindingContext() as Context;
        
        if (!bookContext) {
            MessageToast.show("No book context available");
            return;
        }

        const functionPath = "BookshopService.getCurrentPrice(...)";
        const functionBinding = odataModel.bindContext(functionPath, bookContext);

        await functionBinding.invoke();

        const result = functionBinding.getBoundContext()?.getObject() as {
            price: number;
        };

        if (result && result.price !== null) {
            const price = Number(result.price).toFixed(2);
            MessageToast.show(`Current price: ${price} (Invoke)`);
        } else {
            MessageToast.show("No price data received (Invoke)");
        }
    }

    /* ------------------------------------------------------------------ */
    /* 6  UNBOUND FUNCTION call – Get Sum Book Prices (invoke)           */
    /* ------------------------------------------------------------------ */
    public async invokeGetSumBookPrices(): Promise<void> {

        const odataModel = this.getView()?.getModel() as ODataModel;
        const functionPath = "/BookshopService.getSumBookPrices(...)";
        
        const functionBinding = odataModel.bindContext(functionPath);

        await functionBinding.invoke();

        const result = functionBinding.getBoundContext()?.getObject() as {
            totalPrice: number;
        };

        if (result && result.totalPrice !== null) {
            const totalPrice = Number(result.totalPrice).toFixed(2);
            MessageToast.show(`Total price of all books: ${totalPrice} (Invoke)`);
        } else {
            MessageToast.show("No total price data received (Invoke)");
        }
    }

    /* ------------------------------------------------------------------ */
    /* 7  Complex action with nested parameters (invoke)                 */
    /* ------------------------------------------------------------------ */
    public async invokeCreateBooksAndChapters(): Promise<void> {

        const odataModel = this.getView()?.getModel() as ODataModel;
        const actionPath = "/BookshopService.createBooksAndChapters(...)";
        
        // Sample data for creating multiple books with chapters
        const booksData = [
            {
                title: "Freestyle UI5 Development",
                author: "Developer Freestyle",
                price: 59.99,
                currency: "EUR",
                stock: 5,
                description: "A guide to freestyle UI5 development",
                coverUrl: "./images/freestyle-book-cover.jpg",
                chapters: [
                    {
                        title: "Getting Started with Freestyle",
                        content: "This chapter covers the basics of freestyle development...",
                        pageNumber: 1
                    },
                    {
                        title: "Advanced Techniques",
                        content: "Learn advanced freestyle techniques...",
                        pageNumber: 25
                    }
                ]
            }
        ];

        const actionBinding = odataModel.bindContext(actionPath);
        actionBinding.setParameter("booksData", booksData);

        await actionBinding.invoke();

        const actionResult = actionBinding.getBoundContext()?.getObject() as {
            message: string;
            createdBooks: unknown[];
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
}