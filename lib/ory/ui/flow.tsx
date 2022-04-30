import { UiNode } from "@ory/client";
import { useForm } from "react-hook-form";

import { OryUiNode, OryUiNodeMessage } from "./node";
import { OryFlowMethod, OryFlowObject, OryFlowValues } from "../utils";

export type OryFlowUiProps<T> = {
    flow?: OryFlowObject;
    // Only show certain nodes. We will always render the default nodes for CSRF tokens.
    only?: OryFlowMethod;
    // Is triggered on submission
    submitHandler: (values: T) => void | Promise<void>;
    // Do not show the global messages. Useful when rendering them elsewhere.
    hideGlobalMessages?: boolean;
};

export const OryFlowUi = ({
    flow,
    only,
    hideGlobalMessages,
    submitHandler,
}: OryFlowUiProps<OryFlowValues>) => {
    // Initialize form
    const { formState, register, handleSubmit, setValue } =
        useForm<OryFlowValues>({ mode: "onSubmit" });

    // Get a list of filtered UI nodes
    const uiNodes: UiNode[] = flow?.ui.nodes || [];
    const uiNodeFilters = only ? ["default", only] : [];
    const globalMessages = flow?.ui.messages || [];
    const getUiNodes = () =>
        !uiNodeFilters.length
            ? uiNodes
            : uiNodes.filter(({ group }) => uiNodeFilters.indexOf(group) >= 0);

    return !flow ? null : (
        <>
            <form
                onSubmit={handleSubmit(submitHandler)}
                className={`relative transition-opacity duration-300 ${
                    formState.isSubmitting ? "opacity-50" : ""
                }`}
            >
                {!hideGlobalMessages && globalMessages.length ? (
                    <div className="pb-3">
                        {globalMessages.map(({ id, type, text }, index) => (
                            <OryUiNodeMessage
                                key={index}
                                id={`${id}`}
                                type={type}
                            >
                                {text}
                            </OryUiNodeMessage>
                        ))}
                    </div>
                ) : null}

                {/* UI nodes */}
                {getUiNodes().map((node, index) => (
                    <OryUiNode
                        key={index}
                        node={node}
                        register={register}
                        formState={formState}
                        setValue={setValue}
                    />
                ))}
            </form>
        </>
    );
};
