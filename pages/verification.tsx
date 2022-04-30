import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import {
    SelfServiceVerificationFlow,
    SubmitSelfServiceVerificationFlowBody,
} from "@ory/client";

import {
    OryFlowUi,
    OryFlowValues,
    OryGetOrInitializeFlow,
    OryPageQuery,
    OrySdk,
} from "@lib/ory";
import { SeoMeta } from "@lib/components/seo";
import { BodyClass } from "@lib/utils/misc";
import { Header } from "@lib/components/layout";
import { ButtonSm } from "@lib/components/button";

/**
 * Verification page
 */
export const VerificationPage: NextPage = () => {
    const router = useRouter();
    const query = router.query as OryPageQuery;
    const [flow, setFlow] = useState<SelfServiceVerificationFlow>();

    // Initialize the flow
    useEffect(() => {
        // If the router is not ready yet, or we already have a flow, do nothing.
        if (!router.isReady || flow) {
            return;
        }

        // Get flow
        OryGetOrInitializeFlow("verification", query, router).then((data) => {
            setFlow(data as SelfServiceVerificationFlow);
        });
    }, [router, router.isReady, flow, query]);

    // Handle form submission
    const HandleSubmit = (values: OryFlowValues) => {
        const flowId = flow?.id || "";
        // Add flow ID to URL for persistence
        router
            .push(`/verification?flow=${flowId}`, undefined, {
                shallow: true,
            })
            .then(() => {
                OrySdk.submitSelfServiceVerificationFlow(
                    flowId,
                    undefined,
                    values as SubmitSelfServiceVerificationFlowBody
                )
                    .then(({ data }) => setFlow(data))
                    .catch((error) => {
                        const status = error.response?.status;
                        switch (true) {
                            case status === 400: // Form validation
                                setFlow(error.response?.data);
                                break;
                            default:
                                return Promise.reject(error);
                                break;
                        }
                    });
            });
    };

    return (
        <>
            <SeoMeta title="Verify your account" />
            <BodyClass className="bg-blue-800" />
            <Header />
            <main className="px-4">
                <div className="max-w-sm mx-auto p-3 pb-1 sm:p-6 sm:pb-3 bg-white shadow-2xl rounded-xl">
                    <h1 className="text-center font-bold text-xl pb-6">
                        Verify Your Account
                    </h1>
                    <OryFlowUi flow={flow} submitHandler={HandleSubmit} />
                </div>
                <div className="max-w-sm mx-auto p-3 sm:p-6">
                    <Link href="/" passHref>
                        <a
                            className={`font-bold underline text-white ${ButtonSm}`}
                        >
                            Go back
                        </a>
                    </Link>
                </div>
            </main>
        </>
    );
};

export default VerificationPage;
