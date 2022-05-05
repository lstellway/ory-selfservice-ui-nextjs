import { useEffect, useState } from "react";
import {
    SelfServiceRegistrationFlow,
    SubmitSelfServiceRegistrationFlowBody,
} from "@ory/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import {
    HandleOryFlowError,
    OryFlowUi,
    OryFlowValues,
    OryGetOrInitializeFlow,
    OryPageQuery,
    OrySdk,
} from "@lib/ory";
import { SeoMeta } from "@lib/components/seo";
import { ButtonPrimaryOutline, ButtonSm } from "@lib/components/button";
import { BodyClass } from "@lib/utils/misc";
import { Header } from "@lib/components/layout";

/**
 * Registration page
 */
export const RegistrationPage: NextPage = () => {
    const router = useRouter();
    const [flow, setFlow] = useState<SelfServiceRegistrationFlow>();

    useEffect(() => {
        // Return early if the router is not ready,
        // or we already have a flow object
        if (!router.isReady || flow) {
            return;
        }

        // Get flow
        OryGetOrInitializeFlow<SelfServiceRegistrationFlow>(
            "registration",
            router
        ).then(setFlow);
    }, [router, router.isReady, flow]);

    const HandleSubmit = (values: OryFlowValues) => {
        console.log("Submitting", values);
        const flowId = `${flow?.id || ""}`;
        // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
        // his data when she/he reloads the page.
        router
            .push(`/registration?flow=${flowId}`, undefined, {
                shallow: true,
            })
            .then(() =>
                OrySdk.submitSelfServiceRegistrationFlow(
                    flowId,
                    values as SubmitSelfServiceRegistrationFlowBody
                )
            )
            .then(({ data }) => {
                // If we ended up here, it means we are successfully signed up!
                // You can do cool stuff here, like having access to the identity which just signed up:
                // console.log("This is the user session: ", data, data.identity);
                // For now however we just want to redirect home!
                router.push(flow?.return_to || "/");
            })
            .catch(HandleOryFlowError(router, "registration"))
            .catch((err) => {
                const responseStatus = err.response?.status;
                switch (true) {
                    case responseStatus === 400: // Likely a form validation error
                        setFlow(err.response?.data);
                        break;
                    default:
                        return Promise.reject(err);
                        break;
                }
            });
    };

    return (
        <>
            <SeoMeta title="Create an account" />
            <BodyClass className="bg-blue-800" />
            <main className="pb-20 px-4">
                <Header />
                <div className="max-w-sm mx-auto p-3 sm:p-6 bg-white shadow-2xl rounded-xl">
                    <h1 className="pb-6 text-xl font-bold text-center text-blue-800">
                        Create Account
                    </h1>
                    <OryFlowUi flow={flow} submitHandler={HandleSubmit} />
                    {/* Other Actions */}
                    <div className="pt-6 mt-6 border-t border-gray-300">
                        <Link href="/login" as="/login" passHref>
                            <a
                                className={`${ButtonSm} ${ButtonPrimaryOutline}`}
                            >
                                Sign in
                            </a>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
};

export default RegistrationPage;
