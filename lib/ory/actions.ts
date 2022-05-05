import { V0alpha2Api } from "@ory/client";
import { NextRouter } from "next/router";
import { AxiosResponse, AxiosRequestConfig } from "axios";

import { OrySdk } from "./sdk";
import { OryFlowObject, OryFlowType, OryPageQuery } from "./utils";
import { HandleOryFlowError } from "./errors";

/**
 * Helper to call the logout flow
 */
export const OryLogoutToken = () => {
    // Get a logout token
    return OrySdk.createSelfServiceLogoutFlowUrlForBrowsers().then(
        ({ data }) => {
            if (!data.logout_token) {
                throw "No logout token provided";
            }

            return data.logout_token;
        }
    );
};

/**
 * Ory logout with token
 */
export const OryLogout = (token: string, router: NextRouter) => {
    return OrySdk.submitSelfServiceLogoutFlow(token)
        .then(() => {
            router.push("/login");
        })
        .catch((error) => {
            // Get the response status code
            const status = error?.response?.status;

            switch (status) {
                // User is already logged out.
                // Ignore error
                case 401:
                    return;
                    break;
                default:
                    throw error;
                    break;
            }
        });
};

/**
 * Get self-service flow
 */
export const OryGetSelfServiceFlow = (
    flowType: OryFlowType,
    query: OryPageQuery
) => {
    switch (flowType) {
        case "login":
            return OrySdk.getSelfServiceLoginFlow(`${query.flow || ""}`);
            break;
        case "recovery":
            return OrySdk.getSelfServiceRecoveryFlow(`${query.flow || ""}`);
            break;
        case "registration":
            return OrySdk.getSelfServiceRegistrationFlow(`${query.flow || ""}`);
            break;
        case "settings":
            return OrySdk.getSelfServiceSettingsFlow(`${query.flow || ""}`);
            break;
        case "verification":
            return OrySdk.getSelfServiceVerificationFlow(`${query.flow || ""}`);
            break;
        default:
            return Promise.reject(`Unsupported flow type ${flowType}`);
            break;
    }
};

/**
 * Get self-service flow
 */
export const OryInitializeSelfServiceFlow = (
    flowType: OryFlowType,
    query: OryPageQuery
) => {
    switch (flowType) {
        case "login":
            return OrySdk.initializeSelfServiceLoginFlowForBrowsers(
                Boolean(query.refresh),
                query.aal,
                query.return_to
            );
            break;
        case "recovery":
            return OrySdk.initializeSelfServiceRecoveryFlowForBrowsers(
                query.return_to
            );
            break;
        case "registration":
            return OrySdk.initializeSelfServiceRegistrationFlowForBrowsers(
                query.return_to
            );
            break;
        case "settings":
            return OrySdk.initializeSelfServiceSettingsFlowForBrowsers(
                query.return_to
            );
            break;
        case "verification":
            return OrySdk.initializeSelfServiceVerificationFlowForBrowsers(
                query.return_to
            );
            break;
        default:
            return Promise.reject(`Unsupported flow type ${flowType}`);
            break;
    }
};

/**
 * Initialize a flow
 */
export const OryGetOrInitializeFlow = <S extends OryFlowObject>(
    flowType: OryFlowType,
    router: NextRouter
) => {
    const query = router.query as OryPageQuery;

    return (
        query.flow
            ? OryGetSelfServiceFlow(flowType, query)
            : OryInitializeSelfServiceFlow(flowType, query)
    )
        .catch(HandleOryFlowError(router, flowType))
        .then((data) => {
            if (!data) {
                return Promise.reject();
            }

            return data.data as S;
        });
};
