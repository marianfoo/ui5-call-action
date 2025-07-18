sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function(MessageToast, MessageBox) {
    'use strict';

    return {
         // DEMO ACTIONS - 4 types using extensionAPI.invokeActions() approach (OData V2)
        // This is the preferred API as it handles busy indicators, side-effects, and messages automatically

        /**
         * 1. Bound action WITHOUT parameters - using invokeActions
         */
        customPromoteBookInvoke: async function() {
            const contexts = this.extensionAPI.getSelectedContexts();     // Get selected rows
            
            if (!contexts || contexts.length === 0) {
                MessageToast.show("Please select at least one book");
                return;
            }

            try {
                await this.extensionAPI.invokeActions("/Books_promoteBook", contexts);
                MessageToast.show(`${contexts.length} book(s) promoted successfully`);
            } catch (error) {
                MessageToast.show("Failed to promote book: " + (error.message || "Unknown error"));
            }
        },

        /**
         * 2. Bound action WITH parameters - using invokeActions
         */
        customSetDiscountInvoke: async function() {
            const contexts = this.extensionAPI.getSelectedContexts();
            
            if (!contexts || contexts.length === 0) {
                MessageToast.show("Please select at least one book");
                return;
            }

            const parameters = { 
                percentage: 15, 
                reason: "HOLIDAY_SALE" 
            };

            try {
                await this.extensionAPI.invokeActions("/Books_setDiscount", contexts, parameters);
                MessageToast.show(`Discount applied to ${contexts.length} book(s)`);
            } catch (error) {
                MessageToast.show("Failed to set discount: " + (error.message || "Unknown error"));
            }
        },

        /**
         * 3. Unbound action WITHOUT parameters - using invokeActions
         */
        customRefreshCatalogInvoke: async function() {
            try {
                await this.extensionAPI.invokeActions("/refreshCatalog");
                MessageToast.show("Catalog refreshed successfully");
            } catch (error) {
                MessageToast.show("Failed to refresh catalog: " + (error.message || "Unknown error"));
            }
        },

        /**
         * 4. Unbound action WITH parameters - using invokeActions
         */
        customGenerateReportInvoke: async function() {
            const parameters = {
                reportType: "sales",
                dateFrom: "2024-01-01",
                dateTo: "2024-12-31"
            };

            try {
                const result = await this.extensionAPI.invokeActions("/generateReport", null, parameters);
                MessageToast.show("Report generated successfully");
                if (result && result.reportUrl) {
                    MessageToast.show("Report available at: " + result.reportUrl);
                }
            } catch (error) {
                MessageToast.show("Failed to generate report: " + (error.message || "Unknown error"));
            }
        }
    };
});