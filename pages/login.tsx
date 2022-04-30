import { useEffect, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Script from "next/script";
import {
    SelfServiceLoginFlow,
    SubmitSelfServiceLoginFlowBody,
} from "@ory/client";

import {
    HandleOryFlowError,
    OryFlowUi,
    OryLogoutToken,
    OrySdk,
    OryFlowValues,
    OryLogout,
    OryPageQuery,
    OryGetOrInitializeFlow,
} from "@lib/ory";
import { SeoMeta } from "@lib/components/seo";
import {
    ButtonPrimary,
    ButtonPrimaryHover,
    ButtonPrimaryOutline,
    ButtonSm,
} from "@lib/components/button";
import { Header } from "@lib/components/layout";

/**
 * Login page
 */
export const LoginPage: NextPage = () => {
    const router = useRouter();
    const query = router.query as OryPageQuery;
    const loggedIn = query.aal || query.refresh;
    const [flow, setFlow] = useState<SelfServiceLoginFlow>();
    const [logoutToken, setLogoutToken] = useState<string>("");

    // Initialize login flow
    useEffect(() => {
        // Return early if the router is not ready yet,
        // or we already have a flow
        if (!router.isReady || flow) {
            return;
        }

        // Get flow
        OryGetOrInitializeFlow("login", query, router).then((data) =>
            setFlow(data as SelfServiceLoginFlow)
        );
    }, [router, router.isReady, flow, query]);

    // Get a logout token
    useEffect(() => {
        if (loggedIn && !logoutToken) {
            OryLogoutToken().then((token) => token && setLogoutToken(token));
        }
    }, [loggedIn, logoutToken]);

    /**
     * Handle form submission
     */
    const SubmitHandler = (values: OryFlowValues) => {
        const flowId = `${flow?.id || ""}`;

        // Add flow ID to the URL to prevent losing data on reload
        router
            .push(`/login?flow=${flowId}`, undefined, { shallow: true })
            .then(() =>
                // Perform login
                OrySdk.submitSelfServiceLoginFlow(
                    flowId,
                    undefined,
                    values as SubmitSelfServiceLoginFlowBody
                )
                    .then(() => {
                        if (flow?.return_to) {
                            window.location.href = flow?.return_to;
                        } else {
                            router.push("/"); // Return home
                        }
                    })
                    .catch(HandleOryFlowError(router, "login"))
                    .catch((err) => {
                        const responseStatus = err.response?.status;

                        switch (true) {
                            case responseStatus === 400:
                                setFlow(err.response?.data);
                                break;
                            default:
                                return Promise.reject(err);
                                break;
                        }
                    })
            );
    };

    return (
        <>
            <SeoMeta title="Sign in" />
            <Script
                id="bodyClass"
                dangerouslySetInnerHTML={{
                    __html: `document.body.classList.add("bg-blue-800");`,
                }}
            />
            <main className="pb-20 px-4">
                <Header />
                <div className="max-w-sm mx-auto p-3 sm:p-6 bg-white shadow-2xl rounded-xl">
                    {/* <h2>
                        {(() => {
                            switch (true) {
                                case !!flow?.refresh:
                                    return "Confirm Action";
                                    break;
                                case flow?.requested_aal === "aal2":
                                    return "Two-Factor Authentication";
                                    break;
                                default:
                                    return "Sign In";
                            }
                        })()}
                    </h2> */}
                    <OryFlowUi flow={flow} submitHandler={SubmitHandler} />

                    {/* Other Actions */}
                    <div className="mt-6 pt-6 border-t border-gray-300">
                        {loggedIn && (
                            <a
                                onClick={(event) => {
                                    event.preventDefault();

                                    // Logout
                                    if (logoutToken) {
                                        OryLogout(logoutToken, router);
                                    }
                                }}
                                className={`${ButtonSm} ${ButtonPrimary} ${ButtonPrimaryHover}`}
                            >
                                Log out
                            </a>
                        )}
                        {!loggedIn && (
                            <Link href="/registration" passHref>
                                <a
                                    className={`${ButtonSm} ${ButtonPrimaryOutline}`}
                                >
                                    Create account
                                </a>
                            </Link>
                        )}
                    </div>
                </div>
                {!loggedIn && (
                    <div className="max-w-sm mx-auto p-3 sm:p-6">
                        <Link href="/recovery" passHref>
                            <a
                                className={`font-bold underline text-white ${ButtonSm}`}
                            >
                                Recover your account
                            </a>
                        </Link>
                    </div>
                )}
            </main>
        </>
    );
};

export default LoginPage;
