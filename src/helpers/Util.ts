import {AppController, Connection} from "../types/TSClient";

export function getAppController(): AppController {
    return getVueInstance(document.body.querySelector("#app"))?.appController;
}

export function getVueInstance(node: Node | null): any {
    return (node as any)?.__vue__
}

export function getActiveConnection(): Connection | null {
    for (const connection of getAppController().connections) {
        if (connection._focused) {
            return connection;
        }
    }
    return null;
}
