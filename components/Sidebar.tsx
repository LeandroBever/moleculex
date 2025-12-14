
import React, { useCallback } from 'react';
import { ViewType } from '../App';

interface SidebarProps {
    onSetView: (view: ViewType) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onOpenSettings: () => void;
}

const NavLink: React.FC<{
    onClick: () => void;
    label: string;
    children: React.ReactNode;
}> = React.memo(({ onClick, label, children }) => (
     <a
        href="#"
        onClick={(e) => { e.preventDefault(); onClick(); }}
        className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-[#a89984] hover:text-white transition-colors group"
    >
        <span className="group-hover:text-white transition-colors">{children}</span>
        <span>{label}</span>
    </a>
));

const Sidebar: React.FC<SidebarProps> = ({ onSetView, isOpen, setIsOpen, onOpenSettings }) => {
    
    const menuConfig = [
        { 
            label: 'Dashboard', 
            view: 'dashboard', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg> 
        },
        { 
            label: 'Molecules', 
            view: 'library', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="7" cy="7" r="3" /><circle cx="15" cy="10" r="6" /><circle cx="9" cy="17" r="2" /></svg> 
        },
        { 
            label: 'Formulary', 
            view: 'formulary', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> 
        },
        { 
            label: 'Product Studio', 
            view: 'product-studio', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> 
        },
        { 
            label: 'Training Gym', 
            view: 'training-gym', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> 
        },
        { 
            label: 'About Us', 
            view: 'about-us', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
        }
    ];

    const handleSetView = useCallback((view: ViewType) => {
        onSetView(view);
        setIsOpen(false);
    }, [onSetView, setIsOpen]);

    return (
        <aside className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-gray-50 dark:bg-[#111111] border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col z-30 w-80`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Molecule<span className="text-[#a89984]">X</span></h1>
                 <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
            </div>

            <nav className="p-4 space-y-1 flex-grow overflow-y-auto">
                {menuConfig.map(item => (
                    <NavLink 
                        key={item.label} 
                        label={item.label} 
                        onClick={() => handleSetView(item.view as ViewType)}
                    >
                        {item.icon}
                    </NavLink>
                ))}
            </nav>

             <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <button 
                    onClick={onOpenSettings}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors w-full px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 group-hover:text-[#a89984] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                </button>
            </div>
        </aside>
    );
};

export default React.memo(Sidebar);
