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
        customPromoteBookInvoke: function() {
            const contexts = this.extensionAPI.getSelectedContexts();     // Get selected rows
            
            if (!contexts || contexts.length === 0) {
                MessageToast.show("Please select at least one book");
                return;
            }

            this.extensionAPI                                 // PUBLIC API since 1.28
                .invokeActions("/Books_promoteBook", contexts)     // action name, contexts
                .then(() => {
                    MessageToast.show(`${contexts.length} book(s) promoted successfully`);
                })
                .catch((error) => {
                    MessageToast.show("Failed to promote book: " + (error.message || "Unknown error"));
                });
        },

        /**
         * 2. Bound action WITH parameters - using invokeActions
         */
        customSetDiscountInvoke: function() {
            const contexts = this.extensionAPI.getSelectedContexts();
            
            if (!contexts || contexts.length === 0) {
                MessageToast.show("Please select at least one book");
                return;
            }

            const parameters = { 
                percentage: 15, 
                reason: "HOLIDAY_SALE" 
            };

            this.extensionAPI
                .invokeActions("/Books_setDiscount", contexts, parameters)
                .then(() => {
                    MessageToast.show(`Discount applied to ${contexts.length} book(s)`);
                })
                .catch((error) => {
                    MessageToast.show("Failed to set discount: " + (error.message || "Unknown error"));
                });
        },

        /**
         * 3. Unbound action WITHOUT parameters - using invokeActions
         */
        customRefreshCatalogInvoke: function() {
            this.extensionAPI
                .invokeActions("/refreshCatalog")
                .then(() => {
                    MessageToast.show("Catalog refreshed successfully");
                })
                .catch((error) => {
                    MessageToast.show("Failed to refresh catalog: " + (error.message || "Unknown error"));
                });
        },

        /**
         * 4. Unbound action WITH parameters - using invokeActions
         */
        customGenerateReportInvoke: function() {
            const parameters = {
                reportType: "sales",
                dateFrom: "2024-01-01",
                dateTo: "2024-12-31"
            };

            this.extensionAPI
                .invokeActions("/generateReport", null, parameters)
                .then((result) => {
                    MessageToast.show("Report generated successfully");
                    if (result && result.reportUrl) {
                        MessageToast.show("Report available at: " + result.reportUrl);
                    }
                })
                .catch((error) => {
                    MessageToast.show("Failed to generate report: " + (error.message || "Unknown error"));
                });
        },

        /**
         * 7. NEW: Complex unbound action - Create Books and Chapters using invokeActions
         */
        customCreateBooksAndChaptersInvoke: function() {
            // not possible with OData V2
        },

        /**
         * 5. Bound Function call - Get Current Price function using callFunction
         */
        customGetCurrentPrice: function() {
            const contexts = this.extensionAPI.getSelectedContexts();
            
            if (!contexts || contexts.length === 0) {
                MessageToast.show("Please select a book");
                return;
            }

            const context = contexts[0];
            const bookId = context.getProperty("ID");
            const isActiveEntity = context.getProperty("IsActiveEntity");

            if (!bookId) {
                MessageToast.show("No book ID found");
                return;
            }

            const model = this.getView().getModel();
            const path = "/Books_getCurrentPrice";

            model.callFunction(path, {
                method: "GET",
                urlParameters: {
                    "ID": bookId,
                    "IsActiveEntity": isActiveEntity
                },
                success: function(data) {
                    if (data && data.Books_getCurrentPrice && data.Books_getCurrentPrice.price !== null) {
                        const price = parseFloat(data.Books_getCurrentPrice.price).toFixed(2);
                        MessageToast.show("Current price: " + price + " (CUST V2)");
                    } else {
                        MessageToast.show("No price data received");
                    }
                },
                error: function(error) {
                    MessageBox.error("Failed to get current price: " + (error.message || "Unknown error"));
                }
            });
        },

        /**
         * 6. Unbound Function call - Get Sum Book Prices function using callFunction
         */
        customGetSumBookPrices: function() {
            const model = this.getView().getModel();
            const path = "/getSumBookPrices";

            model.callFunction(path, {
                method: "GET",
                success: function(data) {
                    if (data && data.getSumBookPrices && data.getSumBookPrices.totalPrice !== null) {
                        const totalPrice = parseFloat(data.getSumBookPrices.totalPrice).toFixed(2);
                        MessageToast.show("Total price of all books: " + totalPrice + " (CUST V2)");
                    } else {
                        MessageToast.show("No total price data received");
                    }
                },
                error: function(error) {
                    MessageBox.error("Failed to get sum book prices: " + (error.message || "Unknown error"));
                }
            });
        },

        // DEMO ACTIONS - 4 types of actions for demonstration using OData V2

        /**
         * 1. Bound action WITHOUT parameters - OData V2 implementation
         */
        customPromoteBook: function(event) {
            const context = this.extensionAPI.getSelectedContexts();
            if (!context || context.length === 0) {
                MessageToast.show("Please select at least one book");
                return;
            }

            const model = this.getView().getModel();
            const that = this;

            // Process each selected book
            context.forEach(function(context) {
                const bookId = context.getProperty("ID");
                const isActiveEntity = context.getProperty("IsActiveEntity");
                const path = "/Books_promoteBook";
                
                model.callFunction(path, {
                    method: "POST",
                    urlParameters: {
                        "ID": bookId,
                        "IsActiveEntity": isActiveEntity
                    },
                    success: function(data) {
                        MessageToast.show("Book promoted successfully: " + (data.message || "Success"));
                        // Refresh the list
                        that.extensionAPI.refresh();
                    },
                    error: function(error) {
                        MessageBox.error("Failed to promote book: " + (error.message || "Unknown error"));
                    }
                });
            });
        },

        /**
         * 2. Bound action WITH parameters - OData V2 implementation
         */
        customSetDiscount: function(event) {
            const context = this.extensionAPI.getSelectedContexts();
            if (!context || context.length === 0) {
                MessageToast.show("Please select at least one book");
                return;
            }

            const model = this.getView().getModel();
            const that = this;

            // Process each selected book
            context.forEach(function(context) {
                const bookId = context.getProperty("ID");
                const isActiveEntity = context.getProperty("IsActiveEntity");
                const path = "/Books_setDiscount";
                
                model.callFunction(path, {
                    method: "POST",
                    urlParameters: {
                        "ID": bookId,
                        "IsActiveEntity": isActiveEntity,
                        "percentage": 15,
                        "reason": "HOLIDAY_SALE"
                    },
                    success: function(data) {
                        MessageToast.show("Discount applied successfully: " + (data.message || "15% discount applied"));
                        // Refresh the list
                        that.extensionAPI.refresh();
                    },
                    error: function(error) {
                        MessageBox.error("Failed to set discount: " + (error.message || "Unknown error"));
                    }
                });
            });
        },

        /**
         * 3. Unbound action WITHOUT parameters - OData V2 implementation
         */
        customRefreshCatalog: function(event) {
            const model = this.getView().getModel();
            const that = this;
            const path = "/refreshCatalog";

            model.callFunction(path, {
                method: "POST",
                success: function(data) {
                    MessageToast.show("Catalog refreshed successfully: " + (data.message || "Catalog refreshed"));
                    // Refresh the list
                    that.extensionAPI.refresh();
                },
                error: function(error) {
                    MessageBox.error("Failed to refresh catalog: " + (error.message || "Unknown error"));
                }
            });
        },

        /**
         * 4. Unbound action WITH parameters - OData V2 implementation
         */
        customGenerateReport: function(event) {
            const model = this.getView().getModel();
            const path = "/generateReport";

            model.callFunction(path, {
                method: "POST",
                urlParameters: {
                    "reportType": "sales",
                    "dateFrom": "2024-01-01",
                    "dateTo": "2024-12-31"
                },
                success: function(data) {
                    MessageToast.show("Report generated successfully: " + (data.message || "Sales report generated"));
                    if (data.reportUrl) {
                        MessageToast.show("Report available at: " + data.reportUrl);
                    }
                },
                error: function(error) {
                    MessageBox.error("Failed to generate report: " + (error.message || "Unknown error"));
                }
            });
        },

        /**
         * 7. NEW: Complex unbound action - Create Books and Chapters using callFunction
         */
        customCreateBooksAndChapters: function(event) {
            // not possible with OData V2
        }
    };
});