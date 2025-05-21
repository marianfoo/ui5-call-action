sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Image",
    "sap/m/VBox",
    "sap/m/Text"
], function(MessageToast, MessageBox, Dialog, Button, Image, VBox, Text) {
    'use strict';

    return {
        
        /**
         * Add Chapter action - bound action WITH parameters for V2 Object Page
         */
        addChapter: function(event) {
            const context = this.getView().getBindingContext();
            if (!context) {
                MessageToast.show("No book context available");
                return;
            }

            const model = this.getView().getModel();
            const that = this;
            const path = "/Books_addChapter";

            const bookId = context.getProperty("ID");
            const isActiveEntity = context.getProperty("IsActiveEntity");
            
            model.callFunction(path, {
                method: "POST",
                urlParameters: {
                    "ID": bookId,
                    "IsActiveEntity": isActiveEntity,
                    "title": "New Chapter",
                    "pageNumber": 1,
                    "content": "This is a new chapter content..."
                },
                success: function(data) {
                    MessageToast.show("Chapter added successfully (CUST): " + (data.message || "Chapter created"));
                    // Refresh the object page
                    that.extensionAPI.refresh();
                },
                error: function(error) {
                    MessageBox.error("Failed to add chapter: " + (error.message || "Unknown error"));
                }
            });
        },

        /**
         * Half Price action - bound action WITHOUT parameters for V2 Object Page
         */
        halfPrice: function(event) {
            const context = this.getView().getBindingContext();
            if (!context) {
                MessageToast.show("No book context available");
                return;
            }

            const model = this.getView().getModel();
            const that = this;
            const path = "/Books_halfPrice";

            const bookId = context.getProperty("ID");
            const isActiveEntity = context.getProperty("IsActiveEntity");
            
            model.callFunction(path, {
                method: "POST",
                urlParameters: {
                    "ID": bookId,
                    "IsActiveEntity": isActiveEntity
                },
                success: function(data) {
                    MessageToast.show("Price halved successfully (CUST): " + (data.message || "Price reduced to half"));
                    // Refresh the object page
                    that.extensionAPI.refresh();
                },
                error: function(error) {
                    MessageBox.error("Failed to apply half price: " + (error.message || "Unknown error"));
                }
            });
        },

        /**
         * Show Cover Picture action - displays the cover image in a dialog for V2 Object Page
         */
        showCoverPicture: function(event) {
            const context = this.getView().getBindingContext();
            if (!context) {
                MessageToast.show("No book context available");
                return;
            }

            const model = this.getView().getModel();
            const path = "/Books_showCoverPicture";

            const bookId = context.getProperty("ID");
            const isActiveEntity = context.getProperty("IsActiveEntity");
            const bookTitle = context.getProperty("title") || "Unknown Book";
            const coverUrl = context.getProperty("coverUrl");
            
            // Helper function to show cover dialog
            const showCoverDialog = function(imageUrl, title) {
                const dialog = new Dialog({
                    title: "Cover Picture - " + title,
                    contentWidth: "600px",
                    contentHeight: "700px",
                    resizable: true,
                    draggable: true,
                    content: [
                        new VBox({
                            alignItems: "Center",
                            justifyContent: "Center",
                            items: [
                                new Text({
                                    text: title,
                                    textAlign: "Center"
                                }).addStyleClass("sapUiMediumMarginBottom"),
                                new Image({
                                    src: imageUrl,
                                    width: "400px",
                                    height: "500px",
                                    densityAware: false,
                                    alt: "Cover of " + title,
                                    press: function() {
                                        // Optional: open full size in new tab on click
                                        window.open(imageUrl, '_blank');
                                    }
                                }).addStyleClass("sapUiMediumMargin")
                            ]
                        }).addStyleClass("sapUiMediumMargin")
                    ],
                    beginButton: new Button({
                        text: "Open in New Tab",
                        press: function() {
                            window.open(imageUrl, '_blank');
                        }
                    }),
                    endButton: new Button({
                        text: "Close",
                        press: function() {
                            dialog.close();
                        }
                    }),
                    afterClose: function() {
                        dialog.destroy();
                    }
                });
                
                dialog.open();
            };
            
            model.callFunction(path, {
                method: "POST",
                urlParameters: {
                    "ID": bookId,
                    "IsActiveEntity": isActiveEntity
                },
                success: function(data) {
                    if (data && data.value) {
                        // Use the URL returned from the action
                        showCoverDialog(data.value, bookTitle);
                        MessageToast.show("Cover picture displayed (CUST)");
                    } else if (coverUrl) {
                        // Fallback: use cover URL from the book data
                        showCoverDialog(coverUrl, bookTitle);
                        MessageToast.show("Cover picture displayed from book data (CUST)");
                    } else {
                        MessageToast.show("No cover picture available for this book");
                    }
                },
                error: function(error) {
                    // Fallback: try to show from book data even if action fails
                    if (coverUrl) {
                        showCoverDialog(coverUrl, bookTitle);
                        MessageToast.show("Cover picture displayed from book data (CUST)");
                    } else {
                        MessageBox.error("Failed to show cover picture: " + (error.message || "Unknown error"));
                    }
                }
            });
        }
    };
}); 