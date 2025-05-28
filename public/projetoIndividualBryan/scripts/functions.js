export function setAttributes(element, obj) {
    const attributes = Object.entries(obj);

    for(let [key, value] of attributes) {
        element.setAttribute(key, String(value));
    }
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

export function initKpi(kpi, func) {
    const interval = executeNowAndRepeatWithInterval(async () => {
        const values = await func();

        if(values.hasOwnProperty("subvalue")) {
            kpi.subvalue = values.subvalue;
            kpi.value = values.value;
        } else {
            kpi.value = values;
        }
    }, 2000);

    return {
        stopKpi: () => clearInterval(interval)
    }
}

export function observeElementAttributeChange(element, callback) {
    const mutationObserver  = new MutationObserver(mutationsList => {
        for(const mutation of mutationsList) {
            if(mutation.type === "attributes" && mutation.attributeName === "value") {
                callback(element.getAttribute(mutation.attributeName));
            }
        }
    });

    mutationObserver.observe(element, { attributes: true });

    return {
        disconnect: () => mutationObserver.disconnect()
    };
}

export function continentName(continentCode) {
    const continentCodes = ["AS", "AF", "SA", "NA", "EU", "OC", "AN"];

    if(!continentCodes.includes(continentCode)) {
        return null;
    }

    const continents = {
        SA: "América do Sul",
        NA: "América do Norte",
        AF: "África",
        EU: "Europa",
        OC: "Oceânia",
        AN: "Antártida",
        AS: "Ásia"
    }

    return continents[continentCode];
}


export function loader() {
    const htmlBody = document.querySelector("body");

    const loaderElement = document.createElement("screen-loader");

    htmlBody.appendChild(loaderElement);

    return {
        remove: () => loaderElement.remove()
    }
}