import { useEffect, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Script from "next/script";
import { Session } from "@ory/client";

import { SeoMeta } from "@lib/components/seo";
import { Header } from "@lib/components/layout";
import { OrySdk, OryLogoutToken, OryLogout } from "@lib/ory";
import {
    ButtonPrimary,
    ButtonPrimaryHover,
    ButtonSm,
} from "@lib/components/button";

export const HomePage: NextPage = () => {
    const [session, setSession] = useState<Session | undefined>(undefined);
    const [logoutToken, setLogoutToken] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        // Get session data
        OrySdk.toSession()
            .then(({ data }) => {
                setSession(data);

                // Get a logout token if the user has a session
                if (!!data) {
                    OryLogoutToken().then(
                        (token) => token && setLogoutToken(token)
                    );
                }
            })
            .catch((err) => {
                switch (err.response?.status) {
                    case 403: // Legacy error (See code 422 for details)
                    case 422: // 2FA required
                        return router.push("/login?aal=aal2");
                    case 401: // User not logged in
                        return;
                    default:
                        return Promise.reject(err);
                }
            });
    }, [router]);

    return (
        <>
            <SeoMeta title="Account Profile" />
            <Script
                id="bodyClass"
                dangerouslySetInnerHTML={{
                    __html: `document.body.classList.add("bg-blue-800");`,
                }}
            />
            <main className="pb-20">
                <Header />
                <div className="max-w-sm mx-auto pt-6 px-6 pb-3 bg-white shadow-2xl rounded-xl">
                    <h1 className="text-center font-bold text-xl pb-6">
                        Welcome to Ory!
                    </h1>
                    <p className="pb-6">
                        Welcome to the Ory Managed UI. This UI implements a
                        run-of-the-mill user interface for all self-service
                        flows (login, registration, recovery, verification,
                        settings). The purpose of this UI is to help you get
                        started quickly. In the long run, you probably want to
                        implement your own custom user interface.
                    </p>

                    {/* Documentation */}
                    <h2 className="font-bold pb-3">Documentation</h2>
                    <Link href="https://www.ory.sh/docs/get-started" passHref>
                        <a
                            target="_blank"
                            className={`${ButtonSm} ${ButtonPrimary} ${ButtonPrimaryHover} mb-3`}
                        >
                            Get Started
                        </a>
                    </Link>
                    <Link
                        href="https://www.ory.sh/docs/concepts/terminology"
                        passHref
                    >
                        <a
                            target="_blank"
                            className={`${ButtonSm} ${ButtonPrimary} ${ButtonPrimaryHover} mb-3`}
                        >
                            Concepts
                        </a>
                    </Link>

                    {/* Account management */}
                    <h2 className="font-bold pt-6 pb-3">Account</h2>
                    {!session && (
                        <Link href="/login" as="/login" passHref>
                            <a
                                className={`${ButtonSm} ${ButtonPrimary} ${ButtonPrimaryHover} mb-3`}
                            >
                                Login
                            </a>
                        </Link>
                    )}
                    {!session && (
                        <Link href="/registration" as="/registration" passHref>
                            <a
                                className={`${ButtonSm} ${ButtonPrimary} ${ButtonPrimaryHover} mb-3`}
                            >
                                Create Account
                            </a>
                        </Link>
                    )}
                    {!session && (
                        <Link href="/recovery" as="/recovery" passHref>
                            <a
                                className={`${ButtonSm} ${ButtonPrimary} ${ButtonPrimaryHover} mb-3`}
                            >
                                Recover Account
                            </a>
                        </Link>
                    )}
                    <Link href="/verification" as="/verification" passHref>
                        <a
                            className={`${ButtonSm} ${ButtonPrimary} ${ButtonPrimaryHover} mb-3`}
                        >
                            Verify Account
                        </a>
                    </Link>
                    {!!session && (
                        <Link href="/settings" passHref>
                            <a
                                className={`${ButtonSm} ${ButtonPrimary} ${ButtonPrimaryHover} mb-3`}
                            >
                                Account Settings
                            </a>
                        </Link>
                    )}
                    {!!session && (
                        <button
                            type="button"
                            onClick={(event) => {
                                event.preventDefault();

                                // Logout
                                if (logoutToken) {
                                    OryLogout(logoutToken, router);
                                }
                            }}
                            className={`w-full ${ButtonSm} ${ButtonPrimary} ${ButtonPrimaryHover} mb-3`}
                        >
                            Logout
                        </button>
                    )}
                    {!!session && (
                        <>
                            <h2 className="font-bold pt-6 pb-3">
                                Session Data
                            </h2>
                            <code className="overflow-x-auto">
                                {JSON.stringify(session, null, 4)}
                            </code>
                        </>
                    )}
                </div>
            </main>
        </>
    );
};

export default HomePage;
