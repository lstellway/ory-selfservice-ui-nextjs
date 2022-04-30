import {
    ButtonPrimary,
    ButtonPrimaryHover,
    ButtonSm,
} from "@lib/components/button";
import { UiNodeAnchorAttributes, UiNode } from "@ory/client";
import { getNodeId } from "@ory/integrations/ui";
import Link from "next/link";

/**
 * Ory UI node anchor properties
 */
interface OryUiNodeAnchorProps {
    node: UiNode;
}

/**
 * Ory UI node anchor
 */
export const OryUiNodeAnchor = ({ node }: OryUiNodeAnchorProps) => {
    const attributes = node.attributes as UiNodeAnchorAttributes;

    return (
        <Link href={attributes.href}>
            <a className={`${ButtonSm} ${ButtonPrimary} ${ButtonPrimaryHover}`}>
                {attributes.title.text}
            </a>
        </Link>
    );
};
