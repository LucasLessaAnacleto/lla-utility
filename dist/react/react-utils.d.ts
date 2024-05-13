import React, { ComponentProps } from "react";
export declare function useDebounce<T>(callback: Function, delay: number): (args: T) => void;
export type RouterType = (props: RouterProps) => JSX.Element;
export type SetRouterType = (path: string) => void;
interface RouterProps {
    configRouters: {
        path: string;
        element: ([key]: any) => JSX.Element;
        setRouter?: SetRouterType;
        hasRouteParam?: boolean;
        props?: {
            [propName: string]: any;
        };
    }[];
}
export declare function useRouterDom(pathInitial?: string): [RouterType, SetRouterType, string];
interface LinkProps extends ComponentProps<"a"> {
    to: string | null;
    children: React.ReactNode;
}
export declare function getLinkRouterDom(setRouter: SetRouterType): ({ to, ...props }: LinkProps) => React.ReactNode;
type convertToStr<T> = (param: T) => string;
type convertToType<T> = (param: string) => T;
type useUrlStateReturnType<T> = [T, (newValue: T) => void, () => void];
export declare function useUrlState<T>(param: string, initial: T, strToType: convertToType<T>, typeToStr?: convertToStr<T>): useUrlStateReturnType<T>;
export {};
