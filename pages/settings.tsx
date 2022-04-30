import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import {
    SelfServiceSettingsFlow,
    SubmitSelfServiceSettingsFlowBody,
} from "@ory/client";

import {
    HandleOryFlowError,
    OryFlowUi,
    OryFlowValues,
    OryGetOrInitializeFlow,
    OryPageQuery,
    OrySdk,
} from "@lib/ory";
import { SeoMeta } from "@lib/components/seo";
import { BodyClass } from "@lib/utils/misc";
import { ButtonSm } from "@lib/components/button";
import { Header } from "@lib/components/layout";

/**
 * Helper to determine if flow section has nodes
 */
const SectionHasFields = (flow?: SelfServiceSettingsFlow, only?: string) => {
    const nodes = flow?.ui.nodes || [];
    const filtered = only ? nodes.filter(({ group }) => group === only) : nodes;

    return filtered.length > 0;
};

/**
 * Settings page
 */
export const SettingsPage: NextPage = () => {
    const router = useRouter();
    const query = router.query as OryPageQuery;
    const [flow, setFlow] = useState<SelfServiceSettingsFlow>();

    // Initialize flow
    useEffect(() => {
        // If the router is not ready yet, or we already have a flow, do nothing.
        if (!router.isReady || flow) {
            return;
        }

        // Get flow
        OryGetOrInitializeFlow("settings", query, router).then((data) => {
            setFlow(data as SelfServiceSettingsFlow);
        });
    }, [router, router.isReady, flow, query]);

    // Handle form submission
    const HandleSubmit = (values: OryFlowValues) => {
        const flowId = flow?.id || "";

        // Update flow ID in URL in case page is reloaded
        router
            .push(`/settings?flow=${flowId}`, undefined, {
                shallow: true,
            })
            .then(() =>
                // Update user settings
                OrySdk.submitSelfServiceSettingsFlow(
                    flowId,
                    undefined,
                    values as SubmitSelfServiceSettingsFlowBody
                )
                    .then(({ data }) => setFlow(data))
                    .catch(HandleOryFlowError(router, "settings"))
                    .catch((error) => {
                        const status = error.response?.status;

                        switch (true) {
                            case status === 400: // Likely a form validation error
                                setFlow(error.response?.data);
                                break;
                            default:
                                return Promise.reject(error);
                                break;
                        }
                    })
            );
    };

    return (
        <>
            <SeoMeta title="Profile Management and Security Settings" />
            <BodyClass className="bg-blue-800" />
            <main className="pb-20 px-4">
                <Header />
                {/* Profile */}
                {SectionHasFields(flow, "profile") && (
                    <div className="max-w-sm mx-auto p-3 pb-1 sm:p-6 sm:pb-3 mb-6 bg-white shadow-2xl rounded-xl">
                        <h2 className="pb-6 text-center font-bold text-xl">
                            Profile Settings
                        </h2>
                        <OryFlowUi
                            submitHandler={HandleSubmit}
                            only="profile"
                            flow={flow}
                        />
                    </div>
                )}

                {/* Password */}
                {SectionHasFields(flow, "password") && (
                    <div className="max-w-sm mx-auto p-3 pb-1 sm:p-6 sm:pb-3 mb-6 bg-white shadow-2xl rounded-xl">
                        <h2 className="pb-6 text-center font-bold text-xl">
                            Change Password
                        </h2>
                        <OryFlowUi
                            submitHandler={HandleSubmit}
                            only="password"
                            flow={flow}
                        />
                    </div>
                )}

                {/* Social Profiles */}
                {SectionHasFields(flow, "oidc") && (
                    <div className="max-w-sm mx-auto p-3 pb-1 sm:p-6 sm:pb-3 mb-6 bg-white shadow-2xl rounded-xl">
                        <h2 className="pb-6 text-center font-bold text-xl">
                            Manage Social Sign In
                        </h2>
                        <OryFlowUi
                            submitHandler={HandleSubmit}
                            only="oidc"
                            flow={flow}
                        />
                    </div>
                )}

                {/* 2FA Codes */}
                {SectionHasFields(flow, "lookup_secret") && (
                    <div className="max-w-sm mx-auto p-3 pb-1 sm:p-6 sm:pb-3 mb-6 bg-white shadow-2xl rounded-xl">
                        <h2 className="pb-6 text-center font-bold text-xl">
                            Manage 2FA Backup Recovery Codes
                        </h2>
                        <p className="pb-6">
                            Recovery codes can be used in panic situations where{" "}
                            you have lost access to your 2FA device.
                        </p>
                        <OryFlowUi
                            submitHandler={HandleSubmit}
                            only="lookup_secret"
                            flow={flow}
                        />
                    </div>
                )}

                {/* 2FA Authenticator */}
                {SectionHasFields(flow, "totp") && (
                    <div className="max-w-sm mx-auto p-3 pb-1 sm:p-6 sm:pb-3 mb-6 bg-white shadow-2xl rounded-xl">
                        <h2 className="pb-6 text-center font-bold text-xl">
                            Manage 2FA TOTP Authenticator App
                        </h2>
                        <p className="pb-6">
                            Add a TOTP Authenticator App to your account to
                            improve your account security. Popular Authenticator
                            Apps are{" "}
                            <a
                                href="https://www.lastpass.com"
                                rel="noreferrer"
                                target="_blank"
                            >
                                LastPass
                            </a>{" "}
                            and Google Authenticator (
                            <a
                                href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                                target="_blank"
                                rel="noreferrer"
                            >
                                iOS
                            </a>
                            ,{" "}
                            <a
                                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Android
                            </a>
                            ).
                        </p>
                        <OryFlowUi
                            submitHandler={HandleSubmit}
                            only="totp"
                            flow={flow}
                        />
                    </div>
                )}

                {/* 2FA Authenticator */}
                {SectionHasFields(flow, "webauthn") && (
                    <div className="max-w-sm mx-auto p-3 pb-1 sm:p-6 sm:pb-3 bg-white shadow-2xl rounded-xl">
                        <h2 className="pb-6 text-center font-bold text-xl">
                            Manage Hardware Tokens and Biometrics
                        </h2>
                        <p className="pb-6">
                            Use Hardware Tokens (e.g. YubiKey) or Biometrics{" "}
                            (e.g. FaceID, TouchID) to enhance your account{" "}
                            security.
                        </p>
                        <OryFlowUi
                            submitHandler={HandleSubmit}
                            only="webauthn"
                            flow={flow}
                        />
                    </div>
                )}

                <div className="max-w-sm mx-auto px-6 pb-6">
                    <Link href="/" passHref>
                        <a
                            className={`font-bold underline text-white ${ButtonSm}`}
                        >
                            Go Back
                        </a>
                    </Link>
                </div>
            </main>
        </>
    );
};

export default SettingsPage;
