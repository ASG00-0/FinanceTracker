// src/types/reactbits.d.ts
import * as React from 'react';

export interface ReactBitsProps extends React.HTMLAttributes<HTMLDivElement> {
    speed?: string;
    color?: string;
    className?: string;
}

export const Bounce: React.FC<ReactBitsProps>;
export const StarBorder: React.FC<ReactBitsProps>;
