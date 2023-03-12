import * as Automerge from "@automerge/automerge";
import { v4 as uuidv4 } from "uuid";
import * as localforage from "localforage";

// TODO add logging to see callback activity (mostly to detect runaway recursion & duplicate updates)

// function stolen from here:
// https://github.com/wecraftapps/automerge-websocket/blob/33b463a2e042c1db149c838eecaffc1c8038c0f0/front/src/index.js#L139
const uint8ToBase64 = (arr) =>
    btoa(
        Array(arr.length)
            .fill('')
            .map((_, i) => String.fromCharCode(arr[i]))
            .join('')
    );

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
        this.tabId = uuidv4();
        this.browserId = browserId;
        this.doc = doc;
        this.channel = new BroadcastChannel("cyber-broadcast");
        this.channel.onmessage = (e) => {
            let { sourceTabId, binaryChanges } = e.data;
            console.log(`received: sourceTab=${sourceTabId}, changes=${binaryChanges.length()}`)
            // TODO parse into Changes & call #receiveChanges
            // TODO ignore messages from myself
            // TODO propagate doc mutations to the UI
            // do NOT persist here; the tab that made the changes is responsible for persisting
        };
        this.channel.onmessageerror = (e) => {
            // TODO when can this occur?
        };

        // TODO keep track of Changes that haven't been sent
        // TODO attempt reconnect

        this.ws = new WebSocket('ws://192.168.1.88:8081');
        this.ws.onopen = function(e) {
            alert("[open] Connection established");
            alert("Sending to server");
            this.ws.send("My name is John");
            // TODO call #synchronizeWithSyncServer
        };
        this.ws.onmessage = function(event) {
            alert(`[message] Data received from server: ${event.data}`);
            // TODO call #receiveChanges
        };
        this.ws.onclose = function(event) {
            if (event.wasClean) {
                // TODO add UI feedback when server connection was closed cleanly
                alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                // TODO add UI feedback when server connection was interrupted (server killed or network down)
                // can also occur when locking screen on mobile
                // TODO attempt reconnect
                alert(`[close] Connection died: ${event.code}`);
            }
        };
        this.ws.onerror = function(error) {
            // TODO when can this occur, and how can those distinct events be handled?
            alert(`[error] ${error}`);
        };

        // TODO perform sync process with WS server on (re)connect
    }

    synchronizeWithSyncServer() {
        // TODO perform sync protocol
    }

    receiveChanges() {
        // TODO apply changes
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
        // TODO don't attempt to sync if not connected to websocket server
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


let fileUploadEl = document.getElementById("file-upload");

function handleFileUploadChangeEvent() {
    for (let file of fileUploadEl.files) {
       
        // TODO pass to FileReader & async consume text via import dispatcher
    }
}

fileUploadEl.addEventListener("change", handleFileUploadChangeEvent, false);
