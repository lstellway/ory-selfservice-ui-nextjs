import { UiNode } from "@ory/client";
import {
    isUiNodeAnchorAttributes,
    isUiNodeImageAttributes,
    isUiNodeInputAttributes,
    isUiNodeScriptAttributes,
    isUiNodeTextAttributes,
} from "@ory/integrations/ui";
import {
    UseFormRegister,
    FieldValues,
    FormState,
    UseFormSetValue,
} from "react-hook-form";
import { OryUiNodeAnchor } from "./anchor";

import { OryUiNodeImage } from "./image";
import { OryUiNodeInput } from "./input";
import { OryUiNodeScript } from "./script";
import { OryUiNodeText } from "./text";

/**
 * Ory UI node properties
 */
export type OryUiNodeProps = {
    node: UiNode;
    register: UseFormRegister<FieldValues>;
    formState: FormState<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
};

/**
 * Ory UI node
 */
export const OryUiNode = ({
    node,
    register,
    formState,
    setValue,
}: OryUiNodeProps) => {
    switch (true) {
        case isUiNodeImageAttributes(node.attributes):
            return <OryUiNodeImage node={node} />;
            break;
        case isUiNodeScriptAttributes(node.attributes):
            return <OryUiNodeScript node={node} />;
            break;
        case isUiNodeTextAttributes(node.attributes):
            return <OryUiNodeText node={node} />;
            break;
        case isUiNodeAnchorAttributes(node.attributes):
            return <OryUiNodeAnchor node={node} />;
            break;
        case isUiNodeInputAttributes(node.attributes):
            return (
                <OryUiNodeInput
                    node={node}
                    register={register}
                    formState={formState}
                    setValue={setValue}
                />
            );
            break;
        default:
            return null;
            break;
    }
};
