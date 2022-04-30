import Head from "next/head";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

import { getUrl } from "@lib/utils/misc";

/**
 * OpenGraph properties
 */
export type SeoMetaProps = {
    description?: string;
    keywords?: string;
    title?: string;
    url?: string;
    images?: string[];
    imageAlt?: string;
    siteName?: string;
    type?: string;
    locale?: string;
};

/**
 * Meta data for <head />
 *
 * @param MetaDataProps props
 * @return ReactNode
 */
export const SeoMeta: FunctionComponent<SeoMetaProps> = ({
    description,
    keywords,
    locale,
    images = [],
    imageAlt = "",
    siteName = process.env.NEXT_PUBLIC_SITE_NAME || "",
    title,
    type,
    url,
}) => {
    const router = useRouter();
    const currentUrl = url || getUrl(router?.asPath);

    return (
        <Head>
            {!!title && (
                <>
                    <title>{title}</title>
                    <meta name="og:title" content={title} />
                </>
            )}
            {!!description && (
                <>
                    <meta name="description" content={description} />
                    <meta name="og:description" content={description} />
                </>
            )}
            {!!images.length && (
                <>
                    {images.map((src, index) => (
                        <meta key={index} name="og:image" content={src} />
                    ))}
                    {!!imageAlt && (
                        <meta name="og:image:alt" content={imageAlt} />
                    )}
                </>
            )}
            {!!keywords && <meta name="keywords" content={keywords} />}
            {!!locale && <meta name="og:locale" content={locale} />}
            {!!siteName && <meta property="og:site_name" content={siteName} />}
            {!!type && <meta name="og:type" content={type} />}
            <meta name="og:url" content={currentUrl} />
            <link rel="canonical" href={currentUrl} />
        </Head>
    );
};
