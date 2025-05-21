/* eslint-disable valid-jsdoc */
import ExtensionAPI from "sap/fe/core/ExtensionAPI";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";

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