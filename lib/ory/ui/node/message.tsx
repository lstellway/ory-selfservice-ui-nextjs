import { PropsWithChildren } from "react";

/**
 * Ory UI node message
 */
export const OryUiNodeMessage = (
    props: PropsWithChildren<{
        id?: string;
        type: string;
    }>
) => {
    return (
        <p
            className={`pt-1 px-1 uppercase text-xs ${
                props.type === "error" ? "text-rose-500" : ""
            }`}
        >
            {props.children}
        </p>
    );
};
