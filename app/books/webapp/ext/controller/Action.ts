/* eslint-disable valid-jsdoc */
import ExtensionAPI from "sap/fe/core/ExtensionAPI";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import MessageToast from "sap/m/MessageToast";

// DEMO ACTIONS - 4 types of actions for demonstration

/**
 * 1. Bound action WITHOUT parameters - CUSTOM implementation via invokeAction
 */
export async function customPromoteBook(this: ExtensionAPI) {
    const contexts = this.getSelectedContexts();
    await this.getEditFlow().invokeAction("BookshopService.promoteBook", { contexts: contexts });
}


/**
 * 2. Bound action WITH parameters - CUSTOM implementation
 */
export async function customSetDiscount(this: ExtensionAPI) {
    const contexts = this.getSelectedContexts();
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
        const contexts = this.getSelectedContexts();
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