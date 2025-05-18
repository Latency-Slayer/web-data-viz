export function setAttributes(element, obj) {
    const attributesMap = new Map(Object.entries(obj));

    attributesMap.forEach((value, key) => {
        element.setAttribute(key, String(value));
    });
}

export function insertElement(container, tagName, att, classList) {
    const element = document.createElement(tagName);

    setAttributes(element, att);
    for(let className of classList) {
        element.classList.add(className);
    }

    container.appendChild(element);

    return element;
}