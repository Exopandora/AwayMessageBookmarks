import {getVueInstance} from "./Util";

export namespace ImageLoader {
    let _iconData: { [key: string]: string };

    export function loadIcon(name: string): SVGSVGElement | null {
        const iconData = getIconData();
        if (iconData == null) {
            return null;
        }
        const data = iconData[name];
        if (data == null) {
            return null;
        }
        return new DOMParser().parseFromString(data, "text/html").getElementsByTagName("svg")[0];
    }

    function getIconData() {
        if (_iconData == null) {
            _iconData = getVueInstance(document.querySelector("#app"))?.$store?._vm?.IconData;
        }
        return _iconData;
    }
}
