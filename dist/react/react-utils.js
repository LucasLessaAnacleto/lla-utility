import React, { useState } from "react";
export function useDebounce(callback, delay) {
    let timeoutId;
    const debounced = (args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(args);
            timeoutId = undefined;
        }, delay || 1500);
    };
    return debounced;
}
;
;
export function useRouterDom(pathInitial) {
    const [pathRouter, setPathRouter] = useState(() => {
        const url = new URL(window.location.toString());
        if (url.pathname.length <= 1) {
            url.pathname = pathInitial || "/";
            window.history.replaceState({}, "", url);
        }
        return url.pathname;
    });
    function setRouter(path) {
        if (pathRouter !== path) {
            const url = new URL(window.location.toString());
            url.pathname = path;
            window.history.replaceState({ path }, "", url);
            setPathRouter(path);
        }
    }
    function Router({ configRouters }) {
        let routeParameters = undefined;
        const router = configRouters
            .find(router => {
            const [isPathValid, routeParams] = equalPath(pathRouter, router.path);
            if (isPathValid && router.path !== "?") {
                if (router.hasRouteParam === true)
                    routeParameters = routeParams;
                return true;
            }
            ;
            return false;
        });
        if (!!router) {
            if (routeParameters !== undefined) {
                if (typeof router.element === 'function') {
                    const Element = router.element;
                    return React.createElement(Element, { setRouter: router.setRouter, routeParams: routeParameters, ...router.props });
                }
            }
            return React.createElement(router.element, { setRouter: router.setRouter, ...router.props });
        }
        else {
            const notFound = configRouters.find(router => router.path === "?");
            if (!!notFound) {
                const url = new URL(window.location.toString());
                url.pathname = "/not-found";
                window.history.replaceState({}, "", url);
                return React.createElement(notFound.element, { setRouter: notFound.setRouter, ...notFound.props });
            }
        }
        return React.createElement(React.Fragment, null);
    }
    return [Router, setRouter, pathRouter];
}
;
;
export function getLinkRouterDom(setRouter) {
    return function Link({ to, ...props }) {
        return (React.createElement("a", { ...props, onClick: () => {
                if (to !== null)
                    setRouter(to);
            } }, props.children));
    };
}
;
function equalPath(current, path) {
    const response = {};
    if (path.includes("/:")) {
        const tempCurrent = current.split("/");
        const tempPath = path.split("/");
        if (tempCurrent.length !== tempPath.length)
            return [false, undefined];
        return [tempPath.every((pathname, index) => {
                if (pathname.match(/^[:]/g)) {
                    const routeParam = tempCurrent[index];
                    const routeNameParam = pathname.replace(/[:]([\S]+)/gui, "$1");
                    response[routeNameParam] = routeParam;
                    return true;
                }
                else {
                    return pathname === tempCurrent[index];
                }
            }), response];
    }
    return [current === path, undefined];
}
;
export function useUrlState(param, initial, strToType, typeToStr = (v) => String(v)) {
    const getUrl = () => new URL(window.location.toString());
    const hasQuery = (url) => ![null, "", "null"].includes(url.searchParams.get(param));
    const [state, setState] = useState(() => {
        const url = getUrl();
        if (hasQuery(url))
            return strToType(url.searchParams.get(param));
        return initial;
    });
    const setCurrentState = function (newValue) {
        const url = getUrl();
        url.searchParams.set(param, typeToStr(newValue));
        window.history.pushState({}, "", url);
        setState(newValue);
    };
    const hiddenState = function () {
        const url = getUrl();
        if (url.searchParams.has(param)) {
            url.searchParams.delete(param);
            window.history.pushState({}, "", url);
        }
    };
    return [state, setCurrentState, hiddenState];
}
;
