import { UiNode, UiNodeScriptAttributes } from "@ory/client";
import { getNodeId } from "@ory/integrations/ui";
import { HTMLAttributeReferrerPolicy, useEffect } from "react";
import Script from "next/script";

/**
 * Ory UI node script properties
 */
interface OryUiNodeScriptProps {
    node: UiNode;
}

/**
 * Ory UI node script
 */
export const OryUiNodeScript = ({ node }: OryUiNodeScriptProps) => {
    const attributes = node.attributes as UiNodeScriptAttributes;

    return (
        <Script
            id={`node/script/${getNodeId(node)}`}
            src={attributes.src}
            async={attributes.async}
            crossOrigin={attributes.crossorigin}
            integrity={attributes.integrity}
            referrerPolicy={
                attributes.referrerpolicy as HTMLAttributeReferrerPolicy
            }
            type={attributes.type}
        />
    );
};
