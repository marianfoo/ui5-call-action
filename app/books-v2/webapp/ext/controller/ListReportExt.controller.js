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
        customGetCurrentPrice: async function() {
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

            try {
                const data = await new Promise((resolve, reject) => {
                    model.callFunction(path, {
                        method: "GET",
                        urlParameters: {
                            "ID": bookId,
                            "IsActiveEntity": isActiveEntity
                        },
                        success: function(data) {
                            resolve(data);
                        },
                        error: function(error) {
                            reject(error);
                        }
                    });
                });

                if (data && data.Books_getCurrentPrice && data.Books_getCurrentPrice.price !== null) {
                    const price = parseFloat(data.Books_getCurrentPrice.price).toFixed(2);
                    MessageToast.show("Current price: " + price + " (CUST V2)");
                } else {
                    MessageToast.show("No price data received");
                }
            } catch (error) {
                MessageBox.error("Failed to get current price: " + (error.message || "Unknown error"));
            }
        },

        /**
         * 6. Unbound Function call - Get Sum Book Prices function using callFunction
         */
        customGetSumBookPrices: async function() {
            const model = this.getView().getModel();
            const path = "/getSumBookPrices";

            try {
                const data = await new Promise((resolve, reject) => {
                    model.callFunction(path, {
                        method: "GET",
                        success: function(data) {
                            resolve(data);
                        },
                        error: function(error) {
                            reject(error);
                        }
                    });
                });

                if (data && data.getSumBookPrices && data.getSumBookPrices.totalPrice !== null) {
                    const totalPrice = parseFloat(data.getSumBookPrices.totalPrice).toFixed(2);
                    MessageToast.show("Total price of all books: " + totalPrice + " (CUST V2)");
                } else {
                    MessageToast.show("No total price data received");
                }
            } catch (error) {
                MessageBox.error("Failed to get sum book prices: " + (error.message || "Unknown error"));
            }
        },

        // DEMO ACTIONS - 4 types of actions for demonstration using OData V2

        /**
         * 1. Bound action WITHOUT parameters - OData V2 implementation
         */
        customPromoteBook: async function(event) {
            const context = this.extensionAPI.getSelectedContexts();
            if (!context || context.length === 0) {
                MessageToast.show("Please select at least one book");
                return;
            }

            const model = this.getView().getModel();
            const that = this;

            try {
                // Process each selected book
                const promises = context.map(async function(context) {
                    const bookId = context.getProperty("ID");
                    const isActiveEntity = context.getProperty("IsActiveEntity");
                    const path = "/Books_promoteBook";
                    
                    return new Promise((resolve, reject) => {
                        model.callFunction(path, {
                            method: "POST",
                            urlParameters: {
                                "ID": bookId,
                                "IsActiveEntity": isActiveEntity
                            },
                            success: function(data) {
                                resolve(data);
                            },
                            error: function(error) {
                                reject(error);
                            }
                        });
                    });
                });

                const results = await Promise.all(promises);
                MessageToast.show("Book(s) promoted successfully: " + results.length + " book(s)");
                // Refresh the list
                that.extensionAPI.refreshTable();
            } catch (error) {
                MessageBox.error("Failed to promote book: " + (error.message || "Unknown error"));
            }
        },

        /**
         * 2. Bound action WITH parameters - OData V2 implementation
         */
        customSetDiscount: async function(event) {
            const context = this.extensionAPI.getSelectedContexts();
            if (!context || context.length === 0) {
                MessageToast.show("Please select at least one book");
                return;
            }

            const model = this.getView().getModel();
            const that = this;

            try {
                // Process each selected book
                const promises = context.map(async function(context) {
                    const bookId = context.getProperty("ID");
                    const isActiveEntity = context.getProperty("IsActiveEntity");
                    const path = "/Books_setDiscount";
                    
                    return new Promise((resolve, reject) => {
                        model.callFunction(path, {
                            method: "POST",
                            urlParameters: {
                                "ID": bookId,
                                "IsActiveEntity": isActiveEntity,
                                "percentage": 15,
                                "reason": "HOLIDAY_SALE"
                            },
                            success: function(data) {
                                resolve(data);
                            },
                            error: function(error) {
                                reject(error);
                            }
                        });
                    });
                });

                const results = await Promise.all(promises);
                MessageToast.show("Discount applied successfully to " + results.length + " book(s): 15% discount applied");
                // Refresh the list
                that.extensionAPI.refreshTable();
            } catch (error) {
                MessageBox.error("Failed to set discount: " + (error.message || "Unknown error"));
            }
        },

        /**
         * 3. Unbound action WITHOUT parameters - OData V2 implementation
         */
        customRefreshCatalog: async function(event) {
            const model = this.getView().getModel();
            const that = this;
            const path = "/refreshCatalog";

            try {
                const data = await new Promise((resolve, reject) => {
                    model.callFunction(path, {
                        method: "POST",
                        success: function(data) {
                            resolve(data);
                        },
                        error: function(error) {
                            reject(error);
                        }
                    });
                });

                MessageToast.show("Catalog refreshed successfully: " + (data.message || "Catalog refreshed"));
                // Refresh the list
                that.extensionAPI.refreshTable();
            } catch (error) {
                MessageBox.error("Failed to refresh catalog: " + (error.message || "Unknown error"));
            }
        },

        /**
         * 4. Unbound action WITH parameters - OData V2 implementation
         */
        customGenerateReport: async function(event) {
            const model = this.getView().getModel();
            const path = "/generateReport";

            try {
                const data = await new Promise((resolve, reject) => {
                    model.callFunction(path, {
                        method: "POST",
                        urlParameters: {
                            "reportType": "sales",
                            "dateFrom": "2024-01-01",
                            "dateTo": "2024-12-31"
                        },
                        success: function(data) {
                            resolve(data);
                        },
                        error: function(error) {
                            reject(error);
                        }
                    });
                });

                // Handle success
                MessageToast.show("Report generated successfully: " + (data.message || "Sales report generated"));
                if (data.reportUrl) {
                    MessageToast.show("Report available at: " + data.reportUrl);
                }
            } catch (error) {
                // Handle error
                MessageBox.error("Failed to generate report: " + (error.message || "Unknown error"));
            }
        },

        /**
         * 7. NEW: Complex unbound action - Create Books and Chapters using callFunction
         */
        customCreateBooksAndChapters: function(event) {
            // not possible with OData V2
        }
    };
});