import { UiNode, UiNodeTextAttributes, UiText } from "@ory/client";
import { getNodeId, getNodeLabel } from "@ory/integrations/ui";
import { OryUiNodeLabel } from "./label";

/**
 * Ory UI node text properties
 */
export type OryUiNodeTextProps = {
    node: UiNode;
};

/**
 * Ory UI node text secrets
 */
export type OryUiNodeTextSecrets = {
    secrets: UiText[];
};

/**
 * Ory UI node text
 */
export const OryUiNodeText = ({ node }: OryUiNodeTextProps) => {
    const attributes = node.attributes as UiNodeTextAttributes;
    const label = getNodeLabel(node);

    const getTextNode = () => {
        switch (attributes.text.id) {
            // Text ID's with ID `1050015` contain lookup secrets.
            // Let's make them a bit more beautiful!
            case 1050015:
                return (
                    (attributes.text.context as OryUiNodeTextSecrets)
                        ?.secrets || []
                ).map(({ text, id }, index) => (
                    <code key={index} className="overflow-x-auto mb-3">
                        {/* Used lookup_secret has ID 1050014 */}
                        {id === 1050014 ? "Used" : text}
                    </code>
                ));
                break;
            // Default text node layout
            default:
                return (
                    <code className="overflow-x-auto mb-3">
                        {attributes.text.text}
                    </code>
                );
                break;
        }
    };

    return (
        <div className="pb-3">
            {!!label && <label className="block font-bold pb-3">{label}</label>}
            {getTextNode()}
        </div>
    );
};
