import * as Automerge from "@automerge/automerge";
import { v4 as uuidv4 } from "uuid";
import * as localforage from "localforage";

// TODO add logging to see callback activity (mostly to detect runaway recursion & duplicate updates)

class Context {
    // TODO refactor out to reduce page load time
    static async load() {
        let doc = Automerge.init({ patchCallback: updateDOMWithPatches });
        let binary = await localforage.getItem("cyber-doc");
        if (binary) {
            doc = Automerge.load(binary, { patchCallback: updateDOMWithPatches });
        }
        let browserId = await localforage.getItem("browserId").then((value) => {
            return value ?? localforage.setItem("browserId", uuidv4());
        });
        return new Context(doc, browserId);
    }
    
    /**
     * @param {Automerge.Doc<unknown>} doc 
     * @param {string} browserId 
     */
    constructor(doc, browserId) {
        // TODO define a generic type for the Doc
        /**
         * Identifier for this application instance. This is unique per tab.
         * Tabs should ignore messages in the BroadcastChannel from themselves.
         */
        this.tabId = uuidv4();
        /**
         * Identifier for this browser instance. This is unique per browser.
         * 
         * Tabs should ignore WebSocket messages from the same browser because they are synchronized via the BroadcastChannel. 
         */
        this.browserId = browserId;
        /**
         * Wrapped Automerge document.
         */
        this.doc = doc;
        /**
         * Broadcast channel used to synchronize tabs within the same browser.
         */
        this.channel = new BroadcastChannel("cyber-broadcast");
        this.channel.onmessage = (e) => {
            let { sourceTabId, binaryChanges } = e.data;
            console.log(`received: sourceTab=${sourceTabId}, changes=${binaryChanges.length()}`)
            // TODO ignore messages from myself
            // TODO parse into Changes & call Automerge.applyChanges(old, new)
            // TODO propagate doc mutations to the UI
            // do NOT persist here; the tab that made the changes is responsible for persisting
        };
        this.channel.onmessageerror = (e) => {
            // TODO do something reasonable when received message can't be deserialized
        };

        // TODO create websocket connection to the sync server
    }

    /**
     * Perform a state change locally. This is called only when a change is made locally, 
     * i.e. by performing some operation via the user interface.
     * 
     * Changes received from other tabs or peers are NOT to be processed by this function.
     * 
     * @param {function(Automerge.Doc<unknown>):void} fn 
     * @param {string} message 
     */
    makeLocalChange(message, changeFn) {
        let oldDoc = this.doc;
        this.doc = Automerge.change(this.doc, {
            message: message, 
            time: Date.now(), 
            patchCallback: updateDOMWithPatches, 
        }, changeFn);

        let changes = Automerge.getChanges(oldDoc, this.newDoc);
        this.channel.postMessage({
            sourceTabId: this.tabId,
            binaryChanges: changes,
        });

        // TODO persist changes with localforage
        // TODO post changes to the sync server via websocket connection
    }
}

let context = await Context.load();


/**
 * This function is called whenever the local document is updated. 
 * It is used EXCLUSIVELY for propagating updates to the DOM.
 * 
 * @param {Automerge.Patch[]} patches 
 * @param {Automerge.Doc<unknown>} oldDoc 
 * @param {Automerge.Doc<unknown>} newDoc 
 */
function updateDOMWithPatches(patches, oldDoc, newDoc) {
    // TODO does this ever get called when no DOM updates are required? if so, can that be avoided?
    for (let p of patches) {
        // TODO need some way for the UI to subscribe to particular paths, i.e. a prop route subscription
    }
}

function renderDebug() {
    let browserIdEl = document.createElement("p");
    browserIdEl.innerHTML = `<b>BrowserId</b>: ${context.browserId}`;
    let tabIdEl = document.createElement("p");
    tabIdEl.innerHTML = `<b>TabId</b>: ${context.tabId}`;

    let dom = document.querySelector("#app-root");
    dom.appendChild(browserIdEl);
    dom.appendChild(tabIdEl);
}

renderDebug();
