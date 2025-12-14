
import React from 'react';

interface BaseModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'md' | 'lg' | 'xl' | 'full';
}

const BaseModal: React.FC<BaseModalProps> = ({ title, onClose, children, size = 'xl' }) => {
    const sizeClasses = {
        'md': 'max-w-2xl',
        'lg': 'max-w-4xl',
        'xl': 'max-w-6xl',
        'full': 'max-w-full h-full rounded-none',
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className={`!bg-white dark:!bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl flex flex-col w-full ${sizeClasses[size]} ${size !== 'full' ? 'max-h-[90vh]' : ''} transition-colors duration-300`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-[#1C1C1C] rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {/* Content */}
                <div className="flex-grow overflow-y-auto p-6 text-gray-900 dark:text-gray-200 bg-white dark:bg-[#1C1C1C] rounded-b-lg">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default BaseModal;
