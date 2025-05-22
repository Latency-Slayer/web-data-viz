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

export function executeNowAndRepeatWithInterval(callback, timeOut) {
    callback();
    return setInterval(callback, timeOut);
}

export function initKpi(kpi, func, filters) {
    const interval = executeNowAndRepeatWithInterval(async () => {
        kpi.value = await func(filters);
    }, 2000);

    return {
        stopKpi: () => clearInterval(interval)
    }
}

export function observeElementAtributteChange(element, callback) {
    const mutationObserver  = new MutationObserver(mutationsList => {
        for(const mutation of mutationsList) {
            if(mutation.type === "attributes" && mutation.attributeName === "value") {
                callback(element.getAttribute(mutation.attributeName));
            }
        }
    });

    mutationObserver.observe(element, { attributes: true });
}
