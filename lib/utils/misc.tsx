import Script from "next/script";

/**
 * Helper to implement an inline delay
 */
export const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

/**
 * Get URL
 */
export const getUrl = (path?: string) =>
    new URL(`${path || "/"}`, `${process.env.NEXT_PUBLIC_BASE_URL || ""}`).href;

/**
 * Lock scrolling position
 */
export const scrollLock = (lock: boolean) => {
    const html = document.documentElement;
    const body = document.body;

    const preventScroll = (event: Event) => {
        event.preventDefault();
    };

    if (lock) {
        html.classList.add("overflow-hidden");
        body.classList.add("overflow-hidden");
        html.addEventListener("scroll", preventScroll);
        body.addEventListener("scroll", preventScroll);
    } else {
        html.classList.remove("overflow-hidden");
        body.classList.remove("overflow-hidden");
        html.removeEventListener("scroll", preventScroll);
        body.removeEventListener("scroll", preventScroll);
    }
};

/**
 * Add a class to the HTML body element
 */
export const BodyClass = ({ className }: { className: string }) => {
    return (
        <Script
            id="bodyClass"
            dangerouslySetInnerHTML={{
                __html: `document.body.classList.add("${className}");`,
            }}
        />
    );
};
