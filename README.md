# SAP CAP Action Extensions Demo

> **One repo – every official way to trigger OData V2 & V4 actions in SAP Fiori Elements**, side by side:  
> CAP annotations (⚙️ **CAP**) versus controller-level overrides (✨ **CUST**).

![Demo showing CAP and CUST action buttons in List Report and Object Page](docs/assets/demo-screenshot.png)

---

## 🚀 Quick Start

```bash
git clone https://github.com/your-org/ui5-call-action.git
cd ui5-call-action
npm install                # installs CAP, UI5 tooling, etc.
cds watch                  # starts CAP + both FE apps
```

Open in your browser:
* **UI5 V4 app** → [http://localhost:4004/books/webapp/](http://localhost:4004/books/webapp/)
* **UI5 V2 app** → [http://localhost:4004/books-v2/webapp/](http://localhost:4004/books-v2/webapp/)

### Prerequisites

| Tool    | Minimum version | Install command        |
| ------- | --------------- | ---------------------- |
| Node.js | 18 LTS          | —                      |
| cds-dk  | 7               | `npm i -g @sap/cds-dk` |
| git     | any             | —                      |

---

## 📦 What's Inside

| Layer                 | Folder         | Highlights                                                                                          |
| --------------------- | -------------- | --------------------------------------------------------------------------------------------------- |
| **CAP Service**       | `srv/`         | `.cds` action definitions & JavaScript handlers                                                     |
| **Fiori Elements V4** | `app/books/`    | TypeScript controllers using `EditFlow.invokeAction`, `bindContext().invoke()` & legacy `execute()` |
| **Fiori Elements V2** | `app/books-v2/` | JavaScript controllers using `extensionAPI.invokeActions` and `ODataModel.callFunction`             |

---

## 🎯 Action Types Demonstrated

### Bound Actions (require entity context)
- **WITH Parameters**: `setDiscount(percentage, reason)` - Apply discount to books
- **WITHOUT Parameters**: `promoteBook()` - Promote book status
- **WITHOUT Parameters**: `halfPrice()` - Reduce book price to half

### Unbound Actions (service-level)
- **WITH Parameters**: `generateReport(reportType, dateFrom, dateTo)` - Generate reports
- **WITHOUT Parameters**: `refreshCatalog()` - Refresh catalog from external sources

---

## 📑 Action Implementation Matrix

| Action           | Context | Parameters             | CAP Button | CUST Implementation                                                |
| ---------------- | ------- | ---------------------- | ---------- | ------------------------------------------------------------------ |
| `promoteBook`    | bound   | –                      | ✅          | `ActionInvoke.customPromoteBook` V4 / `customPromoteBookInvoke` V2 |
| `setDiscount`    | bound   | percentage, reason     | ✅          | `ActionInvoke.customSetDiscount` V4 / `customSetDiscountInvoke` V2                                                              |
| `refreshCatalog` | unbound | –                      | ✅          | `ActionInvoke.customRefreshCatalog` V4 / `customRefreshCatalogInvoke` V2                                             |
| `generateReport` | unbound | type, dateFrom, dateTo | ✅          | `ActionInvoke.customGenerateReport` V4 / `customGenerateReportInvoke` V2                                                                  |

---

## 🎯 API Decision Matrix

### **UI5 v4 (TypeScript)** - Choose Your Approach

| API Approach | File | Action Types | When to Use | Pros | Cons |
|--------------|------|--------------|-------------|------|------|
| **`EditFlow.invokeAction()`** | [`ObjectAction.ts`](app/books/webapp/ext/controller/ObjectAction.ts) | All types | **Recommended** | Auto busy indicators, side-effects, error handling | Limited customization |
| **`bindContext().invoke()`** | [`ActionInvoke.ts`](app/books/webapp/ext/controller/ActionInvoke.ts) | All types | **UI5 1.123+** | Modern Promise-based API | Requires newer UI5 version |
| **`bindContext().execute()`** | [`ActionExecute.ts`](app/books/webapp/ext/controller/ActionExecute.ts) | All types | Legacy/Custom control | Direct OData access, full control | Deprecated since UI5 1.123+ |

### **UI5 v2 (JavaScript)** - Choose Your Approach

| API Approach | File | Action Types | When to Use | Pros | Cons |
|--------------|------|--------------|-------------|------|------|
| **`extensionAPI.invokeActions()`** | [`ListReportExt.controller.js`](app/books-v2/webapp/ext/controller/ListReportExt.controller.js) | **Bound only** | Bound actions | Auto busy, side-effects, multi-select | Only works for bound actions |
| **`ODataModel.callFunction()`** | [`ObjectPageExt.controller.js`](app/books-v2/webapp/ext/controller/ObjectPageExt.controller.js) | All types | **Unbound actions, full control** | Works for all action types | Manual busy handling required |

### **Quick Decision Guide**
1. **Start with**: Framework helpers (`EditFlow.invokeAction` in V4, `extensionAPI.invokeActions` in V2)
2. **For unbound actions in V2**: Must use `callFunction` 
3. **For maximum control**: Use direct model binding approaches
4. **For compatibility**: Stick to "Recommended" approaches above

---

## 🎮 Testing Actions

### Action Button Locations:
- **List Report**: Toolbar buttons (demo actions)
- **Object Page Header**: `halfPrice`, `showCoverPicture` 
- **Object Page Sections**: `addChapter` (in chapters table)

### Button Prefixes:
- **"CAP"** = Backend CAP action (auto-generated)
- **"CUST"** = Custom frontend implementation

---

<details>
<summary>📁 Complete File Structure (click to expand)</summary>

### Backend (CAP)
- [`srv/bookshop-service.cds`](srv/bookshop-service.cds) - Action definitions
- [`srv/bookshop-service.js`](srv/bookshop-service.js) - Action handlers
- [`srv/fiori-annotations.cds`](srv/fiori-annotations.cds) - UI annotations

### Frontend V4 (TypeScript)
- [`app/books/webapp/ext/controller/ObjectAction.ts`](app/books/webapp/ext/controller/ObjectAction.ts) - Main implementation (EditFlow.invokeAction)
- [`app/books/webapp/ext/controller/ActionInvoke.ts`](app/books/webapp/ext/controller/ActionInvoke.ts) - Alternative (bindContext + invoke)
- [`app/books/webapp/ext/controller/ActionExecute.ts`](app/books/webapp/ext/controller/ActionExecute.ts) - Alternative (bindContext + execute) 

### Frontend V2 (JavaScript)  
- [`app/books-v2/webapp/ext/controller/ObjectPageExt.controller.js`](app/books-v2/webapp/ext/controller/ObjectPageExt.controller.js) - Main implementation (callFunction)
- [`app/books-v2/webapp/ext/controller/ListReportExt.controller.js`](app/books-v2/webapp/ext/controller/ListReportExt.controller.js) - Alternative (invokeActions + callFunction)

</details>

---

## 🏆 Best Practices

1. **For Business Logic**: Use CAP backend actions with annotations
2. **For UI Logic**: Use custom frontend implementations  
3. **Start Simple**: Begin with framework helpers before moving to direct model access
4. **Error Handling**: Framework helpers provide better UX out-of-the-box
5. **Consistency**: Use same approach across your application

---

## 📖 Learning Outcomes

- Understand all 4 action types in CAP
- Compare CAP vs custom frontend approaches
- Master different UI5 action calling techniques
- Learn when to use each approach
- Best practices for production applications

---

## TODO

- [X] Check if a function in CAP is different in frontend https://github.com/SAP-samples/btp-cap-demo-usecases/blob/29ca521b076aa6094a996f04e3aca9abf8a1509f/cap-cql-examples/srv/service.cds#L12
- [X] action with complex parameters https://github.com/SAP-samples/btp-cap-demo-usecases/blob/29ca521b076aa6094a996f04e3aca9abf8a1509f/cap-fe-lr-op-actions/srv/service.cds#L79-L90
- [ ] get return value from action (single value and array) https://github.com/SAP-samples/btp-cap-demo-usecases/blob/29ca521b076aa6094a996f04e3aca9abf8a1509f/cap_resilient_timeout/srv/service.cds#L4

## 🔗 Further Reading

- **CAP Actions & Functions** ¹
- **Fiori Elements Actions** documentation ²
- **UI5 ExtensionAPI.invokeActions** reference ³
- **UI5 ODataModel.callFunction (V2)** reference ⁴
- **UI5 bindContext().invoke (V4)** reference ⁵

---

<sub>
¹ <https://cap.cloud.sap/docs/guides/providing-services#actions-functions>  
² <https://ui5.sap.com/#/topic/cbf16c599f2d4b8796e3702f7d4aae6c>  
³ <https://ui5.sap.com/#/api/sap.ui.generic.app.navigation.service.ExtensionAPI/methods/invokeActions>  
⁴ <https://ui5.sap.com/#/api/sap.ui.model.odata.v2.ODataModel/methods/callFunction>  
⁵ <https://ui5.sap.com/#/api/sap.ui.model.odata.v4.ODataContextBinding/methods/invoke>
</sub>
