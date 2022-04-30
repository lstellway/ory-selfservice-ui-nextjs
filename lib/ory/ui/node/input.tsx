import { UiNodeInputAttributes } from "@ory/client";
import { getNodeLabel } from "@ory/integrations/ui";

import { OryUiNodeLabel } from "./label";
import { OryUiNodeProps } from "./node";
import {
    ButtonPrimary,
    ButtonPrimaryHover,
    ButtonSm,
} from "@lib/components/button";
import { OryUiNodeMessage } from "./message";
import { ButtonHTMLAttributes, useEffect, useRef, useState } from "react";

/**
 * Ory UI node input text
 */
export const OryUiNodeInputText = ({
    node,
    register,
    formState,
}: OryUiNodeProps) => {
    const attributes = node.attributes as UiNodeInputAttributes;
    const formError = formState.errors[attributes.name]?.message;
    const hasError =
        node.messages.filter(({ type }) => type === "error").length > 0 ||
        !!formError;

    return (
        <div className="pb-6">
            <OryUiNodeLabel node={node} />
            <input
                title={node.meta.label?.text}
                type={attributes.type}
                {...register(attributes.name)}
                defaultValue={attributes.value || ""}
                placeholder={`Enter ${getNodeLabel(node)}`}
                disabled={attributes.disabled || formState.isSubmitting}
                className={`w-full h-12 rounded-md px-4 flex items-center outline-none ${
                    hasError
                        ? "bg-rose-50 border border-rose-500"
                        : "bg-zinc-100 border-zinc-100"
                }`}
            />
            {/* Ory input messages */}
            {node.messages.map(({ text, id, type }, index) => (
                <OryUiNodeMessage key={index} type={type} id={`${id}`}>
                    {text}
                </OryUiNodeMessage>
            ))}
            {/* Form error message */}
            {!!formError && (
                <OryUiNodeMessage type={"error"}>{formError}</OryUiNodeMessage>
            )}
        </div>
    );
};

/**
 * Ory UI node input text
 */
export const OryUiNodeInputCheckbox = ({
    node,
    register,
    formState,
}: OryUiNodeProps) => {
    const attributes = node.attributes as UiNodeInputAttributes;
    const formError = formState.errors[attributes.name]?.message;

    return (
        <div className="pb-6">
            <OryUiNodeLabel node={node} />
            <input
                type={attributes.type}
                {...register(attributes.name)}
                defaultChecked={attributes.value === true}
                disabled={attributes.disabled || formState.isSubmitting}
            />
            {/* Ory input messages */}
            {node.messages.map(({ text, id, type }, index) => (
                <OryUiNodeMessage key={index} type={type} id={`${id}`}>
                    {text}
                </OryUiNodeMessage>
            ))}
            {/* Form error message */}
            {!!formError && (
                <OryUiNodeMessage type={"error"}>{formError}</OryUiNodeMessage>
            )}
        </div>
    );
};

/**
 * Ory UI node input button
 */
export const OryUiNodeInputButton = ({
    node,
    formState,
    register,
    setValue,
}: OryUiNodeProps) => {
    const attributes = node.attributes as UiNodeInputAttributes;
    const buttonType =
        attributes.type as ButtonHTMLAttributes<HTMLButtonElement>["type"];

    return (
        <>
            <button
                // {...register(attributes.name)}
                // value={attributes.value || ""}
                type={buttonType}
                onClick={() => {
                    // Click action provided by Ory
                    if (attributes.onclick) {
                        new Function(attributes.onclick)();
                    }

                    // Set value if the button has one
                    if (attributes.value) {
                        setValue(attributes.name, attributes.value);
                    }
                }}
                disabled={attributes.disabled || formState.isSubmitting}
                className={`w-full ${ButtonSm} ${ButtonPrimary} ${ButtonPrimaryHover} mb-3`}
            >
                {getNodeLabel(node)}
            </button>
        </>
    );
};

/**
 * Ory UI node input
 */
export const OryUiNodeInput = ({
    node,
    register,
    formState,
    setValue,
}: OryUiNodeProps) => {
    const attributes = node.attributes as UiNodeInputAttributes;

    switch (attributes.type) {
        // Render a hidden input field
        case "hidden":
            return (
                <input
                    type={attributes.type}
                    {...register(attributes.name)}
                    value={attributes.value || "true"}
                />
            );
            break;
        // Render a checkbox. We have one hidden element which is the real value (true/false), and one
        // display element which is the toggle value (true)!
        case "checkbox":
            <OryUiNodeInputCheckbox
                node={node}
                register={register}
                formState={formState}
                setValue={setValue}
            />;
            break;
        // Render a button
        case "button":
        case "submit":
            return (
                <OryUiNodeInputButton
                    node={node}
                    register={register}
                    formState={formState}
                    setValue={setValue}
                />
            );
            break;
        // Default text input
        default:
            return (
                <OryUiNodeInputText
                    node={node}
                    register={register}
                    formState={formState}
                    setValue={setValue}
                />
            );
            break;
    }

    return null;
};
