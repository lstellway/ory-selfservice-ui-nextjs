import {
    SelfServiceLoginFlow,
    SelfServiceRecoveryFlow,
    SelfServiceRegistrationFlow,
    SelfServiceSettingsFlow,
    SelfServiceVerificationFlow,
    SubmitSelfServiceLoginFlowBody,
    SubmitSelfServiceRecoveryFlowBody,
    SubmitSelfServiceRegistrationFlowBody,
    SubmitSelfServiceSettingsFlowBody,
    SubmitSelfServiceVerificationFlowBody,
} from "@ory/client";

/**
 * Ory flow values
 */
export type OryFlowValues = Partial<
    | SubmitSelfServiceLoginFlowBody
    | SubmitSelfServiceRegistrationFlowBody
    | SubmitSelfServiceRecoveryFlowBody
    | SubmitSelfServiceSettingsFlowBody
    | SubmitSelfServiceVerificationFlowBody
>;

/**
 * Ory flow object
 */
export type OryFlowObject =
    | SelfServiceLoginFlow
    | SelfServiceRegistrationFlow
    | SelfServiceSettingsFlow
    | SelfServiceVerificationFlow
    | SelfServiceRecoveryFlow;

/**
 * Ory flow method
 */
export type OryFlowMethod =
    | "oidc"
    | "password"
    | "profile"
    | "totp"
    | "webauthn"
    | "link"
    | "lookup_secret";

/**
 * Ory flow type
 */
export type OryFlowType =
    | "login"
    | "registration"
    | "settings"
    | "recovery"
    | "verification";

/**
 * Ory page query
 */
export type OryPageQuery = {
    // URL to return to after logging in
    return_to?: string;
    // Existing flow ID
    flow?: string;
    // Session refresh request
    // Example use: when we want to update the password
    refresh?: string;
    // AAL = Authorization Assurance Level (two-factor auth)
    // This implies that we want to upgrade the AAL
    aal?: string;
};
