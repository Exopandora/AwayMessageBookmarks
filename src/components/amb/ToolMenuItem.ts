import {ImageLoader} from "../../helpers/ImageLoader";
import {Settings} from "../../helpers/Settings";
import {getActiveConnection} from "../../helpers/Util";
import {MessageBookmark} from "../../types/MessageBookmark";
import {TSClientInternal} from "../../types/TSClient";

declare var tsclient_internal: TSClientInternal;

export function ToolMenuItem(toolMenu: HTMLElement, bookmark: MessageBookmark, settings: Settings): HTMLElement {
    const row = toolMenu.childNodes[1].cloneNode(true) as HTMLElement;
    const text = row.querySelector("div.tsv-text-truncate")!!;
    text.textContent = bookmark.label;
    row.addEventListener("click", (_: PointerEvent) => {
        const activeConnection = getActiveConnection();
        if (activeConnection != null) {
            const id = activeConnection.activeDetailItem.sc_handler.id;
            tsclient_internal.setClientSelfVariables(id, {"away": true}, true, (async _ => {}));
            tsclient_internal.setClientSelfVariables(id, {"awayMessage": bookmark.label}, true, (async _ => {}));
        }
        (document.querySelector(".tsv-tool-button-context-menu-toggle") as HTMLElement).click();
    });

    const itemIconStack = document.createElement("div");
    itemIconStack.classList.add("tsv-icon", "tsv-item-icon-stack");

    const itemCloseIcon = ImageLoader.loadIcon("item-close");
    if (itemCloseIcon != null) {
        itemCloseIcon.setAttribute("width", "22");
        itemCloseIcon.setAttribute("height", "22");
        itemCloseIcon.setAttribute("name", "item-close");
        itemCloseIcon.classList.add("tsv-icon");
        itemIconStack.appendChild(itemCloseIcon);
    }

    const iconStack = document.createElement("div");
    iconStack.classList.add("tsv-icon", "tsv-icon-stack");
    iconStack.appendChild(itemIconStack);
    iconStack.addEventListener("click", (event: PointerEvent) => {
        const bookmarks: MessageBookmark[] = settings.getValueForKey("bookmarks")
            .filter((item: MessageBookmark) => item.id != bookmark.id);
        settings.setValueForKey("bookmarks", bookmarks);
        row.remove();
        event.stopPropagation();
        event.preventDefault();
    });

    const toolMenuAccessory = document.createElement("div");
    toolMenuAccessory.classList.add("tsv-button", "tsv-tool-menu-accessory", "tsv-button-plain", "tsv-button-has-image");
    toolMenuAccessory.appendChild(iconStack);

    const itemAccessory = row.querySelector(".tsv-item-accessory")!!;
    itemAccessory.appendChild(toolMenuAccessory);

    return row;
}
