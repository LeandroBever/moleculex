
import React from 'react';
import { ViewType } from '../../App';

interface AboutUsViewProps {
    onSetView: (view: ViewType) => void;
}

const JourneyCard: React.FC<{ icon: React.ReactNode; title: string; description: string; color: string }> = ({ icon, title, description, color }) => (
    <div className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center transform hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-full">
        <div className={`mx-auto h-14 w-14 flex items-center justify-center rounded-full ${color} text-white mb-4 shadow-inner`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
);

const FeatureItem: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#222] transition-colors">
        <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#a89984]"></div>
        <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        </div>
    </div>
);

const AboutUsView: React.FC<AboutUsViewProps> = ({ onSetView }) => {
    return (
        <div className="animate-fade-in pt-6 md:pt-12 max-w-6xl mx-auto px-4 pb-16 space-y-12 md:space-y-20">
            
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                    Your Safe Space & <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a89984] to-[#d4c5b0]">Best Buddy.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    MoleculeX is the operating system for modern perfumery. 
                    From your first accord to your final product, we provide the memory, the math, and the safety net.
                </p>
                <button 
                    onClick={() => onSetView('dashboard')}
                    className="inline-flex items-center px-8 py-4 rounded-full bg-[#a89984] text-black font-bold text-lg shadow-lg hover:bg-[#bcaaa4] hover:scale-105 transition-all transform"
                >
                    Enter the Lab
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Journey Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <JourneyCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                    title="The Student"
                    description="Master the fundamentals. Visualize olfactory families, memorize raw materials in the Gym, and study evaporation curves to understand the physics of scent."
                    color="bg-green-600"
                />
                <JourneyCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.24a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    title="The Artisan"
                    description="Create with precision. Use the Smart Formulary to build complex accords, manage your inventory batches, and track formula evolution over time."
                    color="bg-blue-600"
                />
                <JourneyCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    title="The Nose"
                    description="Scale your brand. Calculate exact COGS in the Product Studio, manage IFRA compliance automatically, and export professional batch sheets."
                    color="bg-[#a89984]"
                />
            </div>

            {/* Feature Highlights */}
            <div className="bg-gray-100 dark:bg-[#111] rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Everything Connected</h2>
                        <div className="space-y-4">
                            <FeatureItem title="Dynamic Costing" description="Update an ingredient price, and every formula cost updates instantly." />
                            <FeatureItem title="Inventory Tracking" description="See exactly how much stock you have left while you formulate." />
                            <FeatureItem title="Visual Physics" description="Your library isn't just a list; it's a mindmap sorted by family and physics." />
                            <FeatureItem title="Safety First" description="Automatic alerts when you exceed IFRA limits for restricted materials." />
                        </div>
                    </div>
                    <div className="relative h-64 md:h-full bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-inner flex items-center justify-center overflow-hidden">
                         <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#a89984] via-transparent to-transparent"></div>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-gray-300 dark:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.24a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318z" />
                        </svg>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AboutUsView;
