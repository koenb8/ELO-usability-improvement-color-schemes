import { compose } from "@typed/compose";
import { environment, errors, log, userscripter } from "userscripter";

import * as CONFIG from "~src/config";
import OPERATIONS from "~src/operations";
import * as SITE from "~src/site";
import STYLESHEETS from "~src/stylesheets";
import U from "~src/userscript";
import { GlobalRepository } from "./repository/globalRepository";

const describeFailure = errors.failureDescriber({
  siteName: SITE.NAME,
  extensionName: U.name,
  location: document.location,
});

userscripter.run({
  id: U.id,
  name: U.name,
  initialAction: () => log.log(`${U.name} ${U.version}`),
  stylesheets: STYLESHEETS,
  operationsPlan: {
    operations: OPERATIONS,
    interval: CONFIG.OPERATIONS_INTERVAL,
    tryUntil: environment.DOMCONTENTLOADED,
    extraTries: CONFIG.OPERATIONS_EXTRA_TRIES,
    handleFailures: (failures) =>
      failures.forEach(compose(log.error, describeFailure)),
  },
});

// Add STYLESHEETS to all shadow-roots present in the document.
window.addEventListener('load',() => {
  GlobalRepository.getInstance().forEachShadowRoot(sr => {
    
    const fragment = document.createDocumentFragment();
    Object.entries(STYLESHEETS).forEach(([_, sheet]) => {
      const style = document.createElement("style");
      const sheetId = sheet.id;
      if (sheetId !== undefined)
        style.id = sheetId;
      style.textContent = sheet.css;
      fragment.appendChild(style);
    });
    sr.appendChild(fragment);

  });
});