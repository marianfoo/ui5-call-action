/* eslint-disable valid-jsdoc */
import ExtensionAPI   from "sap/fe/core/ExtensionAPI";
import ODataModel     from "sap/ui/model/odata/v4/ODataModel";
import Context        from "sap/ui/model/odata/v4/Context";
import MessageToast   from "sap/m/MessageToast";

// execute is deprecated since 1.123+

/* ------------------------------------------------------------------ */
/* 1  Bound action – NO parameters                                     */
/* ------------------------------------------------------------------ */
export async function customPromoteBook(this : ExtensionAPI): Promise<void> {

  const selectedContexts = this.getSelectedContexts();
  const odataModel = this.getModel() as ODataModel;
  const actionPath = "BookshopService.promoteBook(...)";

  const promotePromises = selectedContexts.map((bookContext: Context) => {
    const actionBinding = odataModel.bindContext(actionPath, bookContext);
    return actionBinding.invoke();
  });

  await Promise.all(promotePromises);
  MessageToast.show(`${selectedContexts.length} book(s) promoted`);
}

/* ------------------------------------------------------------------ */
/* 2  Bound action – WITH parameters                                   */
/* ------------------------------------------------------------------ */
export async function customSetDiscount(this : ExtensionAPI): Promise<void> {

  const selectedContexts = this.getSelectedContexts();
  const odataModel = this.getModel() as ODataModel;
  const actionPath = "BookshopService.setDiscount(...)";
  
  const discountParameters = { 
    percentage: 15, 
    reason: "HOLIDAY_SALE" 
  };

  const discountPromises = selectedContexts.map((bookContext: Context) => {
    const actionBinding = odataModel.bindContext(actionPath, bookContext);
    
    // Set parameters for the action
    Object.entries(discountParameters).forEach(([parameterName, parameterValue]) => {
      actionBinding.setParameter(parameterName, parameterValue);
    });
    
    return actionBinding.invoke();
  });

  await Promise.all(discountPromises);
  MessageToast.show(`Discount applied to ${selectedContexts.length} book(s)`);
}

/* ------------------------------------------------------------------ */
/* 3  Unbound action – NO parameters                                   */
/* ------------------------------------------------------------------ */
export async function customRefreshCatalog(this : ExtensionAPI): Promise<void> {

  const odataModel = this.getModel() as ODataModel;
  const actionPath = "/BookshopService.refreshCatalog(...)";
  
  const actionBinding = odataModel.bindContext(actionPath);

  await actionBinding.invoke();
  MessageToast.show("Catalog refreshed");
}

/* ------------------------------------------------------------------ */
/* 4  Unbound action – WITH parameters                                 */
/* ------------------------------------------------------------------ */
export async function customGenerateReport(this : ExtensionAPI): Promise<void> {

  const odataModel = this.getModel() as ODataModel;
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

  await actionBinding.invoke();

  // If the action returns data you can read it here:
  // const actionResult = actionBinding.getBoundContext()?.getObject();
  MessageToast.show("Report generated");
}
