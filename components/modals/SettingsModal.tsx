
import React, { useState, useRef } from 'react';
import BaseModal from '../ui/BaseModal';

interface SettingsModalProps {
    onClose: () => void;
    onClearAll: () => void;
    onRestoreTemplates: () => void;
    onExportBackup: () => void;
    onImportBackup: (file: File) => void;
    currency: string;
    setCurrency: (currency: string) => void;
    theme: 'dark' | 'light';
    setTheme: (theme: 'dark' | 'light') => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    onClose, onClearAll, onRestoreTemplates, onExportBackup, onImportBackup,
    currency, setCurrency, theme, setTheme
}) => {
    const [activeTab, setActiveTab] = useState<'general' | 'data'>('general');
    const [confirmingReset, setConfirmingReset] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImportBackup(e.target.files[0]);
            onClose();
        }
    };

    return (
        <BaseModal title="Settings" onClose={onClose} size="md">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                    className={`px-4 py-2 font-semibold text-sm transition-colors relative ${activeTab === 'general' ? 'text-[#a89984]' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                    onClick={() => setActiveTab('general')}
                >
                    General
                    {activeTab === 'general' && <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-[#a89984]"></span>}
                </button>
                <button
                    className={`px-4 py-2 font-semibold text-sm transition-colors relative ${activeTab === 'data' ? 'text-[#a89984]' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                    onClick={() => setActiveTab('data')}
                >
                    Data Management
                    {activeTab === 'data' && <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-[#a89984]"></span>}
                </button>
            </div>

            <div className="space-y-8 p-1 min-h-[300px]">
                {activeTab === 'general' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Theme Toggle */}
                        <div className="bg-white dark:!bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex justify-between items-center shadow-sm dark:shadow-none">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center">
                                    Appearance
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Choose your preferred interface theme.</p>
                            </div>
                            <div className="flex bg-gray-200 dark:bg-black rounded-lg p-1 border border-gray-300 dark:border-gray-700">
                                <button 
                                    onClick={() => setTheme('light')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${theme === 'light' ? 'bg-white text-black shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
                                >
                                    Light
                                </button>
                                <button 
                                    onClick={() => setTheme('dark')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${theme === 'dark' ? 'bg-[#333] text-white shadow-sm ring-1 ring-white/10' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
                                >
                                    Dark
                                </button>
                            </div>
                        </div>

                        {/* Currency Selector */}
                        <div className="bg-white dark:!bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex justify-between items-center shadow-sm dark:shadow-none">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center">
                                    Currency
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Set your default currency for costs.</p>
                            </div>
                             <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="bg-gray-50 dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#a89984] focus:border-[#a89984] w-32 cursor-pointer shadow-sm"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="BRL">BRL (R$)</option>
                                <option value="JPY">JPY (¥)</option>
                                <option value="CAD">CAD (C$)</option>
                                <option value="AUD">AUD (A$)</option>
                                <option value="CHF">CHF (Fr.)</option>
                                <option value="CNY">CNY (¥)</option>
                                <option value="INR">INR (₹)</option>
                                <option value="AED">AED (dh)</option>
                            </select>
                        </div>
                    </div>
                )}

                {activeTab === 'data' && (
                    !confirmingReset ? (
                        <div className="space-y-6 animate-fade-in">
                             {/* Backup & Restore */}
                            <div className="bg-white dark:!bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm dark:shadow-none">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center mb-2">
                                    Backup & Restore
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-4 leading-relaxed">
                                    Save your work securely. Download a backup file containing all your molecules, formulas, and products.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={onExportBackup}
                                        className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-md transition-colors text-xs flex items-center justify-center border border-gray-300 dark:border-gray-600 shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download Backup
                                    </button>
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-md transition-colors text-xs flex items-center justify-center border border-gray-300 dark:border-gray-600 shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        Restore from File
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileChange} 
                                        className="hidden" 
                                        accept=".json" 
                                    />
                                </div>
                            </div>

                            {/* Template Data */}
                            <div className="bg-white dark:!bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm dark:shadow-none">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center mb-2">
                                    Restore Templates
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-4 leading-relaxed">
                                    Missing the example formulas (Summer Citrus, Modern Barber) or products? 
                                    This will add them back to your library.
                                </p>
                                <button 
                                    onClick={() => { onRestoreTemplates(); onClose(); }}
                                    className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-md transition-colors text-xs w-full border border-gray-300 dark:border-gray-600 shadow-sm"
                                >
                                    Restore Example Data
                                </button>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-50 dark:!bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg p-4">
                                <h3 className="text-base font-bold text-red-700 dark:text-red-500 flex items-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    Danger Zone
                                </h3>
                                <p className="text-red-600/80 dark:text-red-400/70 text-xs mb-4 leading-relaxed">
                                    Want a completely fresh start? This will <strong>permanently delete</strong> all molecules, formulas, and products.
                                </p>
                                <button 
                                    onClick={() => setConfirmingReset(true)}
                                    className="bg-white dark:bg-transparent border border-red-200 dark:border-red-800 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold py-2 px-4 rounded-md transition-colors text-xs w-full shadow-sm"
                                >
                                    Factory Reset (Clear All Data)
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Confirmation View */
                        <div className="text-center py-6 animate-fade-in">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Are you absolutely sure?</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto text-sm">
                                This action cannot be undone. This will permanently delete your entire database.
                            </p>
                            <div className="flex flex-col space-y-3">
                                <button 
                                    onClick={() => { onClearAll(); onClose(); }}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md transition-colors shadow-lg text-sm"
                                >
                                    Yes, Delete Everything
                                </button>
                                <button 
                                    onClick={() => setConfirmingReset(false)}
                                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium py-2 text-sm"
                                >
                                    Cancel, keep my data
                                </button>
                            </div>
                        </div>
                    )
                )}
            </div>
        </BaseModal>
    );
};

export default SettingsModal;
