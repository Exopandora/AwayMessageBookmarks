import {Settings} from "../../helpers/Settings";
import {MessageBookmark} from "../../types/MessageBookmark";

const tsvIsDisabledClass = "tsv-is-disabled";

export function BookmarkButton(
    template: HTMLElement,
    inputField: HTMLInputElement,
    toolMenu: HTMLElement,
    settings: Settings
): HTMLElement {
    const bookmarkButton = template.firstChild!!.cloneNode(true) as HTMLElement;
    bookmarkButton.lastChild!!.textContent = "Bookmark";
    bookmarkButton.addEventListener("click", (_: PointerEvent) => {
        const bookmarks: MessageBookmark[] = settings.getValueForKey("bookmarks");
        bookmarks.push({
            id: crypto.randomUUID(),
            label: inputField.value,
        });
        settings.setValueForKey("bookmarks", bookmarks);
        (toolMenu.querySelector("div.ts-away-message-header>div.ts-away-message-button-text") as HTMLElement).click();
    });
    const bookmarkButtonUpdater = (text: string) => {
        if (text.length == 0 && !bookmarkButton.classList.contains(tsvIsDisabledClass)) {
            bookmarkButton.classList.add(tsvIsDisabledClass);
            (bookmarkButton.lastChild as HTMLElement).classList.add(tsvIsDisabledClass);
        } else if (text.length > 0 && bookmarkButton.classList.contains(tsvIsDisabledClass)) {
            bookmarkButton.classList.remove(tsvIsDisabledClass);
            (bookmarkButton.lastChild as HTMLElement).classList.remove(tsvIsDisabledClass);
        }
    };
    inputField.addEventListener("input", (event: InputEvent) => {
        bookmarkButtonUpdater((event.target as HTMLInputElement).value);
    });
    bookmarkButtonUpdater(inputField.value);
    return bookmarkButton;
}
