import { getNodeLabel } from "@ory/integrations/ui";
import { UiNode } from "@ory/client";

/**
 * Ory UI node label properties
 */
export type OryUiNodeLabelProps = {
    node: UiNode;
};

/**
 * Ory UI node label
 */
export const OryUiNodeLabel = ({ node }: OryUiNodeLabelProps) => {
    const label = getNodeLabel(node);

    return !label ? null : (
        <label className="block font-bold pb-3">{label}</label>
    );
};
