import { PropsWithChildren, CSSProperties } from "react";

export type GlyphProps = {
    fill?: string;
    height?: number;
    stroke?: string;
    viewBox?: string;
    width?: number;
    className?: string;
    style?: CSSProperties;
};

export const AbstractGlyph = ({
    children,
    className,
    fill = "current",
    height,
    stroke,
    viewBox,
    width,
    style = {},
}: PropsWithChildren<GlyphProps>) => (
    <svg
        className={className}
        height={height}
        stroke={stroke}
        version="1.1"
        viewBox={viewBox}
        width={width}
        style={{ fill, ...style }}
    >
        {children}
    </svg>
);
