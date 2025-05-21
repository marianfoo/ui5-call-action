# SAP CAP Action Extensions Demo

Blog Post about this repository:
https://community.sap.com/t5/technology-blog-posts-by-members/the-complete-guide-to-calling-actions-in-ui5-with-custom-code/ba-p/14156201



## Quick Start

```bash
git clone https://github.com/marianfoo/ui5-call-action.git
cd ui5-call-action
npm install           # installs CAP, UI5 tooling, ESLint, etc.
npm run watch             # starts CAP + all UI5 apps on http://localhost:4004
````

Open in your browser:

| App                       | URL                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **UI5 V4 Fiori Elements** | [http://localhost:4004/com.marianzeis.books/index.html](http://localhost:4004/com.marianzeis.books/index.html)     |
| **UI5 V2 Fiori Elements** | [http://localhost:4004/com.marianzeis.booksv2/index.html](http://localhost:4004/com.marianzeis.booksv2/index.html) |
| **UI5 V4 Freestyle**      | [http://localhost:4004/com.freestyle/index.html](http://localhost:4004/com.freestyle/index.html)                   |
| **UI5 V2 Freestyle**      | [http://localhost:4004/com.freestyle-v2/index.html](http://localhost:4004/com.freestyle-v2/index.html)             |


### Prerequisites

| Tool    | Min Version | Install                |
| ------- | ----------- | ---------------------- |
| Node.js | 18 LTS      | —                      |
| cds-dk  | 7.x         | `npm i -g @sap/cds-dk` |
| git     | any         | —                      |

---

##  What’s Inside

| Layer                 | Folder              | Highlights                                                   |
| --------------------- | ------------------- | ------------------------------------------------------------ |
| **CAP Service**       | `srv/`              | `.cds` definitions + JavaScript handlers                     |
| **Fiori Elements V4** | `app/books/`        | CAP-annotated *CAP* buttons + custom extensions (*CUST*)     |
| **Fiori Elements V2** | `app/books-v2/`     | Same patterns, but UI5 V2                                    |
| **Freestyle V4**      | `app/freestyle/`    | `bindContext().invoke()` (✅) & `execute()` (legacy)          |
| **Freestyle V2**      | `app/freestyle-v2/` | `ODataModel.callFunction()` & `extensionAPI.invokeActions()` |

A full walk-through is available as a blog post → **“Complete Guide to Calling Actions in UI5 with Custom Code”** (link coming soon).

---

## Action & Function Types

| Type         | Scope   | Params? | Example              | Purpose                  |
| ------------ | ------- | ------- | -------------------- | ------------------------ |
| **Action**   | Bound   | ✔ / ✖   | `promoteBook()`      | Write side-effects       |
|              | Unbound | ✔ / ✖   | `refreshCatalog()`   | Service-wide mutations   |
| **Function** | Bound   | ✖       | `getCurrentPrice()`  | Read-only, entity level  |
|              | Unbound | ✖       | `getSumBookPrices()` | Read-only, service level |

See [`srv/bookshop-service.cds`](srv/bookshop-service.cds) for the full catalog.

---

## Implementation Matrix

| Operation                       | Context | Params   | **CAP** Button | **CUST** Implementation                                   |
| ------------------------------- | ------- | -------- | -------------- | --------------------------------------------------------- |
| `promoteBook`                   | bound   | –        | ✅              | `customPromoteBook` (V4) / `customPromoteBookInvoke` (V2) |
| `setDiscount`                   | bound   | ✔        | ✅              | `customSetDiscount` (V4/V2)                               |
| `halfPrice`                     | bound   | –        | ✅              | Object-Page action                                        |
| `addChapter`                    | bound   | ✔        | ✅              | Object-Page action                                        |
| `refreshCatalog`                | unbound | –        | ✅              | `customRefreshCatalog` (V4/V2)                            |
| `generateReport`                | unbound | ✔        | ✅              | `customGenerateReport` (V4/V2)                            |
| `createBooksAndChapters`        | unbound | ✔ (deep) | ✅              | `customCreateBooksAndChapters` (V4)                       |
| `getCurrentPrice` *(function)*  | bound   | –        | ✅              | `customGetCurrentPrice` (V4) / function call (V2)         |
| `getSumBookPrices` *(function)* | unbound | –        | ✅              | `customGetSumBookPrices` (V4) / function call (V2)        |

---

## API Cheat Sheet (+ Docs)

| UI5 Version        | Helper                         | Doc                                                                                                                         | Notes                                       |
| ------------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| **V4 (FE)**        | `getEditFlow().invokeAction()` | [API](https://ui5.sap.com/#/api/sap.fe.core.controllerextensions.EditFlow%23methods/invokeAction)                           | Bound & unbound, handles draft/side-effects |
| **V4 (Freestyle)** | `bindContext().invoke()`       | [API](https://ui5.sap.com/#/api/sap.ui.model.odata.v4.ODataContextBinding%23methods/invoke)                                 | Requires UI5 ≥ 1.123                        |
|                    | `bindContext().execute()`      | [API](https://ui5.sap.com/#/api/sap.ui.model.odata.v4.ODataContextBinding%23methods/execute)                                | Deprecated in 1.123, still works            |
| **V2 (FE)**        | `extensionAPI.invokeActions()` | [API](https://ui5.sap.com/#/api/sap.suite.ui.generic.template.ListReport.extensionAPI.ExtensionAPI%23methods/invokeActions) | Bound  & unbound actions, multi-select            |
| **V2 (any)**       | `ODataModel.callFunction()`    | [API](https://ui5.sap.com/#/api/sap.ui.model.odata.v2.ODataModel%23methods/callFunction)                                    | Low-level, works everywhere                 |

Need OData V2 in CAP? Install the community adapter:

```bash
npm i -D @cap-js-community/odata-v2-adapter
# → service on http://localhost:4004/odata/v2/<serviceName>
```

---

## Best Practices

1. **Prefer CAP annotations** for business logic & standard UI; fallback to CUST code for dialogs, defaults, or cross-entity tasks.
2. **V4 first** – new features land here first; V2 is legacy.
3. **Batch & Side-effects** – use `groupId` + `requestSideEffects()` in freestyle apps.
4. **Error handling** – let EditFlow/helpers surface messages; add `MessageBox` only for edge cases.
5. **Deprecations** – migrate from `execute()` → `invoke()` when upgrading to UI5 1.123+.

---

## Try it Out

* Look for **CAP \*** buttons (auto-generated) vs. **CUST \*** buttons (custom).
* Use your browser’s **Network tab** to compare the OData payloads.
* Switch between **V2** and **V4** apps to see the path differences (`BookshopService.promoteBook(...)` vs `/Books_promoteBook`).

---

## Further Reading

* **UI5 Official Docs** – [Actions & Functions (V4)](https://ui5.sap.com/#/topic/0ec2820b6c0d46d6b82858dfe720c317) | [OData V2 Model](https://ui5.sap.com/#/api/sap.ui.model.odata.v2.ODataModel)
* **CAP Docs** – [Modeling Actions & Functions](https://cap.cloud.sap/docs/guides/actions)
* **Blog Post** – Complete walkthrough with screenshots & code explanations (link forthcoming).