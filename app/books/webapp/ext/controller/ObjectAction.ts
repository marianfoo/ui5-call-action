import ExtensionAPI from 'sap/fe/core/ExtensionAPI';
import Context from 'sap/ui/model/odata/v4/Context';
import MessageToast from 'sap/m/MessageToast';
import Dialog from 'sap/m/Dialog';
import Button from 'sap/m/Button';
import Image from 'sap/m/Image';
import VBox from 'sap/m/VBox';
import Text from 'sap/m/Text';

/**
 * Add Chapter action - bound action WITH parameters for the sub-table
 * Called from the chapters line item action
 */
export async function addChapter(this: ExtensionAPI, pageContext: Context) {
    try {
        // Use the page context for object page actions
        const parameters = {
            title: "New Chapter",
            pageNumber: 1,
            content: "This is a new chapter content..."
        };

        await this.getEditFlow().invokeAction("BookshopService.addChapter", {
            contexts: pageContext,
            parameterValues: Object.entries(parameters).map(([name, value]) => ({ name, value }))
        });
        
        MessageToast.show("Chapter added successfully (CUST)");
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        MessageToast.show("Failed to add chapter: " + errorMessage);
    }
}

/**
 * Half Price action - bound action WITHOUT parameters for the object page header
 * Reduces the book price to half
 */
export async function halfPrice(this: ExtensionAPI, pageContext: Context) {
    try {
        await this.getEditFlow().invokeAction("BookshopService.halfPrice", {
            contexts: pageContext
        });
        
        MessageToast.show("Price halved successfully (CUST)");
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        MessageToast.show("Failed to apply half price: " + errorMessage);
    }
}

/**
 * Show Cover Picture action - displays the cover image in a dialog
 */
export async function showCoverPicture(this: ExtensionAPI, pageContext: Context) {
    try {
        // Use EditFlow to invoke the action (it will handle the response)
        await this.getEditFlow().invokeAction("BookshopService.showCoverPicture", {
            contexts: pageContext
        });
        
        // Get the cover URL from the book data
        const bookData = pageContext.getObject() as { coverUrl?: string, title?: string };
        const coverUrl = bookData?.coverUrl;
        const bookTitle = bookData?.title || "Unknown Book";
        
        if (coverUrl) {
            // Create and show dialog with cover image
            const dialog = new Dialog({
                title: `Cover Picture - ${bookTitle}`,
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
                                text: bookTitle,
                                textAlign: "Center"
                            }).addStyleClass("sapUiMediumMarginBottom"),
                            new Image({
                                src: coverUrl,
                                width: "400px",
                                height: "500px",
                                densityAware: false,
                                alt: `Cover of ${bookTitle}`,
                                press: function() {
                                    // Optional: open full size in new tab on click
                                    window.open(coverUrl, '_blank');
                                }
                            }).addStyleClass("sapUiMediumMargin")
                        ]
                    }).addStyleClass("sapUiMediumMargin")
                ],
                beginButton: new Button({
                    text: "Open in New Tab",
                    press: function() {
                        window.open(coverUrl, '_blank');
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
            MessageToast.show("Cover picture displayed (CUST)");
        } else {
            MessageToast.show("No cover picture available for this book");
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        MessageToast.show("Failed to show cover picture: " + errorMessage);
    }
}