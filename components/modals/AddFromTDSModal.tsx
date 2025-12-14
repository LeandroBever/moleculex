import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Molecule, OlfactiveFamily } from '../../types';
import BaseModal from '../ui/BaseModal';

interface AddFromTDSModalProps {
    onExtractionComplete: (data: Partial<Molecule>) => void;
    onClose: () => void;
}

// Function to convert a file to a base64 string
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            }
        };
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

// Define the expected JSON schema for Gemini's response
const moleculeSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The common name of the perfumery material." },
        casNumber: { type: Type.STRING, description: "The CAS number of the material." },
        olfactiveFamily: { type: Type.STRING, description: "The main olfactive family (e.g., Citrus, Woody, Floral)." },
        odorProfile: { type: Type.STRING, description: "A brief, one-sentence description of the scent." },
        impact: { type: Type.NUMBER, description: "The longevity or tenacity in hours. Extract the highest number if a range is given." },
        IFRA_MAX_CONCENTRATION: { type: Type.NUMBER, description: "The maximum IFRA concentration percentage. Just the number." },
    },
};


const AddFromTDSModal: React.FC<AddFromTDSModalProps> = ({ onExtractionComplete, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setError(null);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            setFile(event.dataTransfer.files[0]);
            setError(null);
        }
    };

    const triggerFilePicker = () => fileInputRef.current?.click();

    const handleSubmit = async () => {
        if (!file) {
            setError('Please select a file first.');
            return;
        }
        setIsProcessing(true);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const filePart = await fileToGenerativePart(file);

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { text: "You are an expert perfumery chemist. Analyze the following technical data sheet for a perfumery ingredient. Extract the key information and provide it in the requested JSON format. If a value is not present, omit the key." },
                        filePart,
                    ],
                },
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: moleculeSchema,
                },
            });

            const jsonString = response.text;
            const extractedData = JSON.parse(jsonString);

            // Basic data cleaning and mapping
            const finalData: Partial<Molecule> = {};
            if (extractedData.name) finalData.name = extractedData.name;
            if (extractedData.casNumber) finalData.casNumber = extractedData.casNumber;
            if (extractedData.olfactiveFamily) {
                // Attempt to match to our enum
                const familyKey = Object.keys(OlfactiveFamily).find(key => 
                    OlfactiveFamily[key as keyof typeof OlfactiveFamily].toLowerCase() === extractedData.olfactiveFamily.toLowerCase()
                );
                if (familyKey) {
                    finalData.olfactiveFamily = OlfactiveFamily[familyKey as keyof typeof OlfactiveFamily];
                }
            }
            if (extractedData.impact) finalData.impact = extractedData.impact;
            if (extractedData.IFRA_MAX_CONCENTRATION) finalData.IFRA_MAX_CONCENTRATION = extractedData.IFRA_MAX_CONCENTRATION;

            onExtractionComplete(finalData);

        } catch (e) {
            console.error('Error processing TDS:', e);
            setError('Sorry, I couldn\'t extract data from that document. Please try a clearer file or enter the data manually.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    return (
        <BaseModal title="Add Molecule from Technical Data Sheet" onClose={onClose} size="lg">
            <div className="space-y-6">
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
                
                {file ? (
                    <div className="flex items-center justify-between p-3 bg-[#111] border border-gray-700 rounded-md">
                        <div className="flex items-center space-x-3 truncate">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-300 truncate">{file.name}</span>
                        </div>
                        <div className="flex space-x-2 flex-shrink-0">
                            <button type="button" onClick={triggerFilePicker} className="text-xs font-semibold text-[#a89984] hover:underline">Replace</button>
                            <button type="button" onClick={() => setFile(null)} className="text-xs font-semibold text-red-500 hover:underline">Remove</button>
                        </div>
                    </div>
                ) : (
                    <div 
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={triggerFilePicker} 
                        className="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-[#a89984] transition-colors"
                    >
                        <div className="space-y-1 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <div className="flex text-sm text-gray-400 justify-center">
                                <span>Drag & Drop or Click to Upload</span>
                            </div>
                            <p className="text-xs text-gray-500">PDF, PNG, or JPG files are best</p>
                        </div>
                    </div>
                )}

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <div className="pt-5">
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-700 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-600" disabled={isProcessing}>
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            onClick={handleSubmit} 
                            className="bg-[#a89984] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black hover:bg-opacity-80 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                            disabled={!file || isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : 'Scan & Create'}
                        </button>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default AddFromTDSModal;