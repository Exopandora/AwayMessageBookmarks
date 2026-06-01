import {BookmarkButton} from "./components/amb/BookmarkButton";
import {ToolMenuItem} from "./components/amb/ToolMenuItem";
import {Settings} from "./helpers/Settings";

const settings = new Settings("away_message_bookmarks", {
    "bookmarks": [],
});

function injectAwayMessageBookmarks(toolMenu: HTMLElement) {
    for (const bookmark of settings.getValueForKey("bookmarks")) {
        const row = ToolMenuItem(toolMenu, bookmark, settings);
        toolMenu.insertBefore(row, toolMenu.lastChild);
    }
}

function injectBookmarkButton(toolMenu: HTMLElement) {
    const div = toolMenu.querySelector(".ts-button-div") as HTMLElement;
    const inputField = toolMenu.querySelector("input") as HTMLInputElement;
	const bookmarkButton = BookmarkButton(div, inputField, toolMenu, settings);
	div.insertBefore(bookmarkButton, div.lastChild);
}

namespace ContextMenuObserver {
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
        for (const mutation of mutations) {
            if (mutation.type == "childList") {
                for (const node of mutation.addedNodes) {
					onNodeAdded(node);
                }
            }
        }
    });

	function onNodeAdded(node: Node) {
		if (node.nodeType == Node.ELEMENT_NODE) {
			const element = node as Element;
			if (element.classList.contains("ts-away-message-menu")) {
				injectBookmarkButton(node as HTMLElement);
			} else {
				const caption = element.querySelector(".ts-style-caption");
				if (caption?.textContent == "Online Status") {
					injectAwayMessageBookmarks(caption.parentNode as HTMLElement);
				}
			}
		}
	}

	export function observe(node: Element) {
        observer.observe(node, {
            childList: true,
            attributes: false,
            characterData: false,
            subtree: true,
        });
    }

	export function disconnect() {
		observer.disconnect();
	}
}

namespace DocumentObserver {
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
        for (const mutation of mutations) {
            if (mutation.type == "childList") {
                for (const node of mutation.removedNodes) {
					onNodeRemoved(node);
                }
                for (const node of mutation.addedNodes) {
					onNodeAdded(node);
                }
            }
        }
    });

	function onNodeAdded(node: Node) {
		if (node.nodeType == Node.ELEMENT_NODE) {
			const element = node as Element;
			if (element.tagName == "DIV" && element.classList.contains("ts-context-menu")) {
				ContextMenuObserver.observe(element);
			}
		}
	}

	function onNodeRemoved(node: Node) {
		if (node.nodeType == Node.ELEMENT_NODE) {
			const element = node as Element;
			if (element.tagName == "DIV" && element.classList.contains("ts-context-menu")) {
				ContextMenuObserver.disconnect();
			}
		}
	}

	export function observe(node: Element) {
		observer.observe(node, {
			childList: true,
			attributes: false,
			characterData: false,
			subtree: true,
		});
	}
}

settings.populateSettings(() => {
    DocumentObserver.observe(document.body);
});
