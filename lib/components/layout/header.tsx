import Link from "next/link";
import { StellwayLogo } from "../glyph";

export const Header = () => {
    return (
        <div className="pt-8 text-center">
            <Link href="/">
                <a className="mx-auto inline-block p-8">
                    <StellwayLogo
                        width={100}
                        height={100}
                        className="fill-current text-white"
                    />
                </a>
            </Link>
        </div>
    );
};
