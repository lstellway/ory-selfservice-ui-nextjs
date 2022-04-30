import { AxiosError } from "axios";
import { NextRouter } from "next/router";

import { OryFlowType } from "./utils";

/**
 * Helper to handle Ory flow errors
 */
export const HandleOryFlowError =
    (router: NextRouter, flowType: OryFlowType) => (error: AxiosError) => {
        const errorId = error.response?.data.error?.id;
        const redirectTo = error.response?.data.redirect_browser_to;
        const status = error.response?.status;

        switch (true) {
            case errorId === "session_already_available": // User already authenticated
            case status === 400: // User already authenticated
                router.push("/");
                break;
            case errorId === "session_inactive": // User not logged in
                router.push("/login");
                break;
            case errorId === "session_aal2_required" && !!redirectTo: // 2FA enforced, but not performed
            case errorId === "session_refresh_required" && !!redirectTo: // Re-authentication required
            case errorId === "browser_location_change_required" && !!redirectTo: // Redirect requested
                router.push(redirectTo);
                break;
            case errorId === "self_service_flow_return_to_forbidden": // Return to URL forbidden
            case errorId === "security_csrf_violation": // CSRF violation
            case errorId === "security_identity_mismatch": // Requested flow identity mismatch
            case errorId === "self_service_flow_expired": // Flow expired
            case status === 410: // Flow expired
            case status === 403: // Other issue (e.g. CSRF)
                router.push(`/${flowType}`);
                break;
            default: // Return error by default
                return Promise.reject(error);
                break;
        }
    };
