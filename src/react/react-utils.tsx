import React, { ComponentProps, useState } from "react";

export function useDebounce<T>(callback: Function, delay: number ) {

    let timeoutId: number | undefined;
    
    const debounced = (args: T) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(args);
            timeoutId = undefined;
        },delay || 1500);   
    };
    
    return debounced; 
};

export type RouterType = (props: RouterProps) => JSX.Element;
export type SetRouterType = (path: string) => void;

interface RouterProps{
    configRouters: {
        path: string, 
        element: ([key]: any) => JSX.Element,
        setRouter?: SetRouterType,
        hasRouteParam?: boolean,
        props?: {[propName: string]: any}
    }[]
};

export function useRouterDom(pathInitial?: string) : [RouterType, SetRouterType, string] {

    const [pathRouter, setPathRouter] = useState(() => {
        const url = new URL(window.location.toString());

        if(url.pathname.length <= 1){
            url.pathname = pathInitial || "/";
            window.history.replaceState({}, "", url); 
        }  

        return url.pathname;
    });

    function setRouter(path: string){

        if(pathRouter !== path){
            const url = new URL(window.location.toString());
            url.pathname = path;

            window.history.replaceState({path}, "", url);

            setPathRouter(path);
        }

    }
    function Router({configRouters}: RouterProps) { 

        let routeParameters: RouterParam | undefined = undefined;
        const router = configRouters
        .find(router => {
            const [isPathValid, routeParams] = equalPath(pathRouter, router.path); 
            if(isPathValid && router.path !== "?"){
                if(router.hasRouteParam === true) routeParameters = routeParams;
                return true;
            };
            return false;
        });

        if(!!router){
            if(routeParameters !== undefined){
                if (typeof router.element === 'function') {
                    
                    const Element = router.element as React.ComponentType<{ setRouter: any, routeParams: any }>;
                    return <Element 
                        setRouter={router.setRouter} 
                        routeParams={routeParameters} 
                        {...router.props}
                    />;
                }
            }
            return <router.element 
                setRouter={router.setRouter} 
                {...router.props}
            />;

        }else{
            const notFound = configRouters.find(router => router.path === "?" );

            if(!!notFound) {

                const url = new URL(window.location.toString());
                url.pathname = "/not-found";
                window.history.replaceState({}, "", url);
                return <notFound.element 
                    setRouter={notFound.setRouter} 
                    {...notFound.props}
                />;

            }
        }
        return <></>
    }
    
    return [Router, setRouter, pathRouter]
};

interface LinkProps extends ComponentProps<"a">{
    to: string | null,
    children: React.ReactNode,
};

export function getLinkRouterDom(setRouter: SetRouterType) {

    return function Link({to, ...props}: LinkProps) : React.ReactNode {

        return (
            <a {...props} onClick={() => {
                if(to !== null) setRouter(to)
            }}>
                {props.children}
            </a>
        )
    }

};

type RouterParam = {
    [key: string]: string;
};
function equalPath(current: string, path: string) : [boolean, RouterParam | undefined]{
    const response: RouterParam = {};
    if(path.includes("/:")){

        const tempCurrent = current.split("/");
        const tempPath = path.split("/");
        if(tempCurrent.length !== tempPath.length) 
            return [false, undefined];

        return [tempPath.every((pathname, index) => {
            if(pathname.match(/^[:]/g)){
                const routeParam = tempCurrent[index];
                const routeNameParam = pathname.replace(/[:]([\S]+)/gui, "$1");
                response[routeNameParam] = routeParam;
                return true
            }else{
                return pathname === tempCurrent[index];
            }
        }), response ]
    }
    return [current === path, undefined];
};

type convertToStr<T> = (param: T) => string;
type convertToType<T> = (param: string) => T;

type useUrlStateReturnType<T> = [T, (newValue: T) => void, () => void];

export function useUrlState<T>(param: string, initial: T, strToType: convertToType<T>, typeToStr: convertToStr<T> = (v) => String(v)) : useUrlStateReturnType<T> {
    const getUrl = () => new URL(window.location.toString());
    const hasQuery = (url: URL) => ![null, "", "null"].includes(url.searchParams.get(param))

    const [state, setState] = useState<T>(() => {
        const url = getUrl();

        if(hasQuery(url)) 
            return strToType(url.searchParams.get(param)!);

        return initial;
    });

    const setCurrentState = function (newValue: T) : void {
        const url = getUrl();

        url.searchParams.set(param, typeToStr(newValue));

        window.history.pushState({}, "", url);
        setState(newValue)
    }

    const hiddenState = function () : void {
        const url = getUrl();

        if(url.searchParams.has(param)){
            url.searchParams.delete(param);
            window.history.pushState({}, "", url);
        }
            
    }

    return [state, setCurrentState, hiddenState];
};