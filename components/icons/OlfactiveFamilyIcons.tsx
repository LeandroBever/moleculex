
import React from 'react';
import { OlfactiveFamily } from '../../types';

interface OlfactiveFamilyIconProps extends React.SVGProps<SVGSVGElement> {
    family: OlfactiveFamily;
}

const OlfactiveFamilyIcon: React.FC<OlfactiveFamilyIconProps> = ({ family, ...props }) => {
    switch (family) {
        case OlfactiveFamily.CITRUS:
            return (
                <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v20" />
                    <path d="M12 12l7.07-7.07" />
                    <path d="M12 12l-7.07 7.07" />
                    <path d="M12 12l7.07 7.07" />
                    <path d="M12 12l-7.07-7.07" />
                </svg>
            );
        case OlfactiveFamily.FLORAL:
            return (
                <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12 5.5A2.5 2.5 0 0 0 9.5 8a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 14.5 8a2.5 2.5 0 0 0-2.5-2.5m6.5 2.5A2.5 2.5 0 0 0 16 8a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 21 8a2.5 2.5 0 0 0-2.5-2.5m-13 0A2.5 2.5 0 0 0 3 8a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 8 8a2.5 2.5 0 0 0-2.5-2.5m6.5 6.5A2.5 2.5 0 0 0 9.5 16a2.5 2.5 0 0 0 2.5 2.5a2.5 2.5 0 0 0 2.5-2.5a2.5 2.5 0 0 0-2.5-2.5z" />
                </svg>
            );
        case OlfactiveFamily.WOODY:
            return (
                <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                </svg>
            );
        case OlfactiveFamily.SPICY:
            return (
                <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                    <path d="m12 2-2.83 8.5H2l7.42 5.2-2.83 8.5L12 18.2l5.23 3.5-2.83-8.5L22 10.5h-7.17L12 2z" />
                </svg>
            );
        case OlfactiveFamily.GREEN:
            return (
                <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                     <path d="M20.39 8.39A8.5 8.5 0 0 0 12 3.5a8.5 8.5 0 0 0-8.39 4.89A6 6 0 0 0 6 8a6 6 0 0 0-6 6 6 6 0 0 0 6 6h12a5 5 0 0 0 5-5 5 5 0 0 0-2.61-4.22z" />
                </svg>
            );
        case OlfactiveFamily.FRUITY:
            return (
                <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="15.5" cy="7.5" r="3.5" />
                    <circle cx="8.5" cy="8.5" r="2.5" />
                    <circle cx="12" cy="14.5" r="4.5" />
                </svg>
            );
        case OlfactiveFamily.GOURMAND:
             return (
                <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
            );
        case OlfactiveFamily.AMBER:
            return (
                <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 4.17 4.42 9.92 6.24 12.11a.999.999 0 0 0 1.53 0C14.58 18.92 19 13.17 19 9c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                </svg>
            );
        case OlfactiveFamily.MUSK:
            return (
                <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                </svg>
            );
        case OlfactiveFamily.AQUATIC:
            return (
                <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12h2.5c2.5 0 5-5 7.5-5s5 5 7.5 5H21" />
                    <path d="M3 7h2.5c2.5 0 5 5 7.5 5s5-5 7.5-5H21" />
                    <path d="M3 17h2.5c2.5 0 5-5 7.5-5s5 5 7.5 5H21" />
                </svg>
            );
        case OlfactiveFamily.AROMATIC:
            return (
                <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                   <path d="M11 2v2c0 1.1-.9 2-2 2H7c-1.1 0-2 .9-2 2v2H3c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h2c1.1 0 2 .9 2 2v2c1.1 0 2 .9 2 2h2c1.1 0 2-.9 2-2v-2c0-1.1.9-2 2-2h2c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-2c-1.1 0-2-.9-2-2V4c-1.1 0-2-.9-2-2h-2z" />
                </svg>
            );
        case OlfactiveFamily.BALSAMIC:
            return (
                <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
            );
        default:
            return (
                 <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                </svg>
            );
    }
};

export default OlfactiveFamilyIcon;