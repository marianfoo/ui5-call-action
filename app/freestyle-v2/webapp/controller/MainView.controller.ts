import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";

interface BookData {
    ID: string;
    IsActiveEntity: boolean;
}

/**
 * @namespace com.freestyle-v2.controller
 */
export default class MainView extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        const view = this.getView();
        if (view) {
            view.bindElement({ path: "/Books(ID=guid'3afb35fa-e2c9-40d0-8e22-90e96ead9944',IsActiveEntity=true)" });
        }

    }

    /* ================================================================== */
    /* V2 ACTION FUNCTIONS USING callFunction() - ONLY OPTION IN FREESTYLE  */
    /* ================================================================== */

    /**
     * 1. Bound action WITHOUT parameters - OData V2 implementation
     */
    public async callPromoteBook(): Promise<void> {
        const model = this.getView()?.getModel() as ODataModel;
        const bookContext = this.getView()?.getBindingContext();
        
        if (!model) {
            MessageToast.show("Model not available");
            return;
        }

        if (!bookContext) {
            MessageToast.show("No book context available");
            return;
        }

        try {
            const bookData = bookContext.getObject() as BookData;
            const path = "/Books_promoteBook";
            
            await new Promise((resolve, reject) => {
                model.callFunction(path, {
                    method: "POST",
                    urlParameters: {
                        "ID": bookData.ID,
                        "IsActiveEntity": bookData.IsActiveEntity
                    },
                    success: function(data: unknown) {
                        resolve(data);
                    },
                    error: function(error: unknown) {
                        reject(error);
                    }
                });
            });

            MessageToast.show("Book promoted successfully (callFunction)");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            MessageBox.error("Failed to promote book: " + errorMessage);
        }
    }

    /**
     * 2. Bound action WITH parameters - OData V2 implementation
     */
    public async callSetDiscount(): Promise<void> {
        const model = this.getView()?.getModel() as ODataModel;
        const bookContext = this.getView()?.getBindingContext();
        
        if (!model) {
            MessageToast.show("Model not available");
            return;
        }

        if (!bookContext) {
            MessageToast.show("No book context available");
            return;
        }

        try {
            const bookData = bookContext.getObject() as BookData;
            const path = "/Books_setDiscount";
            
            await new Promise((resolve, reject) => {
                model.callFunction(path, {
                    method: "POST",
                    urlParameters: {
                        "ID": bookData.ID,
                        "IsActiveEntity": bookData.IsActiveEntity,
                        "percentage": 25,
                        "reason": "BLACK_FRIDAY"
                    },
                    success: function(data: unknown) {
                        resolve(data);
                    },
                    error: function(error: unknown) {
                        reject(error);
                    }
                });
            });

            MessageToast.show("Discount applied successfully: 25% discount applied (callFunction)");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            MessageBox.error("Failed to set discount: " + errorMessage);
        }
    }

    /**
     * 3. Unbound action WITHOUT parameters - OData V2 implementation
     */
    public async callRefreshCatalog(): Promise<void> {
        const model = this.getView()?.getModel() as ODataModel;
        
        if (!model) {
            MessageToast.show("Model not available");
            return;
        }

        try {
            const path = "/refreshCatalog";

            await new Promise((resolve, reject) => {
                model.callFunction(path, {
                    method: "POST",
                    success: function(data: unknown) {
                        resolve(data);
                    },
                    error: function(error: unknown) {
                        reject(error);
                    }
                });
            });

            MessageToast.show("Catalog refreshed successfully (callFunction)");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            MessageBox.error("Failed to refresh catalog: " + errorMessage);
        }
    }

    /**
     * 4. Unbound action WITH parameters - OData V2 implementation
     */
    public async callGenerateReport(): Promise<void> {
        const model = this.getView()?.getModel() as ODataModel;
        
        if (!model) {
            MessageToast.show("Model not available");
            return;
        }

        try {
            const path = "/generateReport";

            await new Promise((resolve, reject) => {
                model.callFunction(path, {
                    method: "POST",
                    urlParameters: {
                        "reportType": "inventory",
                        "dateFrom": "2024-01-01",
                        "dateTo": "2024-12-31"
                    },
                    success: function(data: unknown) {
                        resolve(data);
                    },
                    error: function(error: unknown) {
                        reject(error);
                    }
                });
            });

            MessageToast.show("Report generated successfully (callFunction)");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            MessageBox.error("Failed to generate report: " + errorMessage);
        }
    }

    /**
     * 5. Bound Function call - Get Current Price function using callFunction
     */
    public async callGetCurrentPrice(): Promise<void> {
        const model = this.getView()?.getModel() as ODataModel;
        const bookContext = this.getView()?.getBindingContext();
        
        if (!model) {
            MessageToast.show("Model not available");
            return;
        }

        if (!bookContext) {
            MessageToast.show("No book context available");
            return;
        }

        try {
            const bookData = bookContext.getObject() as BookData;
            const path = "/Books_getCurrentPrice";

            const data = await new Promise((resolve, reject) => {
                model.callFunction(path, {
                    method: "GET",
                    urlParameters: {
                        "ID": bookData.ID,
                        "IsActiveEntity": bookData.IsActiveEntity
                    },
                    success: function(data: unknown) {
                        resolve(data);
                    },
                    error: function(error: unknown) {
                        reject(error);
                    }
                });
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const responseData = data as any;
            if (responseData && responseData.Books_getCurrentPrice && responseData.Books_getCurrentPrice.price !== null) {
                const price = parseFloat(responseData.Books_getCurrentPrice.price).toFixed(2);
                MessageToast.show("Current price: " + price + " (callFunction V2)");
            } else {
                MessageToast.show("No price data received (callFunction)");
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            MessageBox.error("Failed to get current price: " + errorMessage);
        }
    }

    /**
     * 6. Unbound Function call - Get Sum Book Prices function using callFunction
     */
    public async callGetSumBookPrices(): Promise<void> {
        const model = this.getView()?.getModel() as ODataModel;
        
        if (!model) {
            MessageToast.show("Model not available");
            return;
        }

        try {
            const path = "/getSumBookPrices";

            const data = await new Promise((resolve, reject) => {
                model.callFunction(path, {
                    method: "GET",
                    success: function(data: unknown) {
                        resolve(data);
                    },
                    error: function(error: unknown) {
                        reject(error);
                    }
                });
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const responseData = data as any;
            if (responseData && responseData.getSumBookPrices && responseData.getSumBookPrices.totalPrice !== null) {
                const totalPrice = parseFloat(responseData.getSumBookPrices.totalPrice).toFixed(2);
                MessageToast.show("Total price of all books: " + totalPrice + " (callFunction V2)");
            } else {
                MessageToast.show("No total price data received (callFunction)");
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            MessageBox.error("Failed to get sum book prices: " + errorMessage);
        }
    }
}