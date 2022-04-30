import { useEffect, useState } from "react";
import {
    SelfServiceRecoveryFlow,
    SubmitSelfServiceRecoveryFlowBody,
} from "@ory/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { ButtonSm } from "@lib/components/button";
import { Header } from "@lib/components/layout";
import { SeoMeta } from "@lib/components/seo";
import {
    HandleOryFlowError,
    OryFlowUi,
    OryFlowValues,
    OryGetOrInitializeFlow,
    OryPageQuery,
    OrySdk,
} from "@lib/ory";
import { BodyClass } from "@lib/utils/misc";

export const RecoveryPage: NextPage = () => {
    const router = useRouter();
    const query = router.query as OryPageQuery;
    const [flow, setFlow] = useState<SelfServiceRecoveryFlow>();

    // Initialize flow
    useEffect(() => {
        // Return early if the router is not ready yet,
        // or we already have a flow
        if (!router.isReady || flow) {
            return;
        }

        // Get flow
        OryGetOrInitializeFlow("recovery", query, router).then((data) => {
            setFlow(data as SelfServiceRecoveryFlow);
        });
    }, [router, router.isReady, flow, query]);

    // Handle form submission
    const HandleSubmit = (values: OryFlowValues) => {
        const flowId = flow?.id || "";
        console.log("Values", values);

        // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
        // his data when she/he reloads the page.
        router
            .push(`/recovery?flow=${flowId}`, undefined, { shallow: true })
            .then(() => {
                // Submit recovery request
                OrySdk.submitSelfServiceRecoveryFlow(
                    flowId,
                    undefined,
                    values as SubmitSelfServiceRecoveryFlowBody
                )
                    .then(({ data }) => setFlow(data))
                    .catch(HandleOryFlowError(router, "recovery"))
                    .catch((err) => {
                        const status = err.response?.status;

                        switch (true) {
                            case status === 400: // Likely a form validation error
                                setFlow(err.response?.data);
                                break;
                            default:
                                return Promise.reject(err);
                                break;
                        }
                    });
            });
    };

    return (
        <>
            <SeoMeta title="Recover your account" />
            <BodyClass className="bg-blue-800" />
            <main className="pb-20 px-4">
                <Header />
                <div className="max-w-sm mx-auto p-3 sm:p-6 bg-white shadow-2xl rounded-xl">
                    <h2 className="pb-6 text-center font-bold text-xl">
                        Recover Your Account
                    </h2>
                    <OryFlowUi submitHandler={HandleSubmit} flow={flow} />
                </div>
                <div className="max-w-sm mx-auto p-3 sm:p-6">
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

export default RecoveryPage;
