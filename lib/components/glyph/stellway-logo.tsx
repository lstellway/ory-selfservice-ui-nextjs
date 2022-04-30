import { AbstractGlyph, GlyphProps } from "./abstract";

export const StellwayLogo = (props: GlyphProps) => {
    return (
        <AbstractGlyph viewBox="0 0 100 100" {...props}>
            <g transform="translate(20.000000, 0.000000)" fill="inherit">
                <polygon
                    transform="translate(19.728114, 81.221491) rotate(45.000000) translate(-19.728114, -81.221491) "
                    points="6.07555019 67.5689275 33.4079827 67.5416224 33.3806776 94.8740549 6.04824506 94.90136"
                />
                <polygon
                    transform="translate(40.106748, 60.955928) rotate(45.000000) translate(-40.106748, -60.955928) "
                    points="26.4541843 47.3033645 53.7866168 47.2760594 53.7593117 74.6084919 26.4268792 74.635797"
                />
                <polygon
                    transform="translate(19.715802, 40.617970) rotate(45.000000) translate(-19.715802, -40.617970) "
                    points="6.06323832 26.9654064 33.3956708 26.9381013 33.3683657 54.2705338 6.03593319 54.2978389"
                />
                <polygon
                    transform="translate(40.136802, 20.310066) rotate(45.000000) translate(-40.136802, -20.310066) "
                    points="26.4842383 6.65750221 53.8166708 6.63019708 53.7893657 33.9626296 26.4569332 33.9899347"
                />
            </g>
        </AbstractGlyph>
    );
};
