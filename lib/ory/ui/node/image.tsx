import { UiNode, UiNodeImageAttributes } from "@ory/client";
import { getNodeId } from "@ory/integrations/ui";

/**
 * Ory image node properties
 */
export interface OryUiNodeImageProps {
    node: UiNode;
}

/**
 * Ory image node
 */
export const OryUiNodeImage = ({ node }: OryUiNodeImageProps) => {
    const attributes = node.attributes as UiNodeImageAttributes;

    return <img src={attributes.src} alt={node.meta.label?.text || ""} />;
};
