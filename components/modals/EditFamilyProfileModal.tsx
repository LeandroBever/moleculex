
import React, { useState, useEffect } from 'react';
import { OlfactiveFamily, OlfactiveFamilyProfile } from '../../types';
import BaseModal from '../ui/BaseModal';

interface EditFamilyProfileModalProps {
    family: OlfactiveFamily;
    profile: OlfactiveFamilyProfile;
    onSave: (family: OlfactiveFamily, newProfile: OlfactiveFamilyProfile) => void;
    onCancel: () => void;
}

const EditFamilyProfileModal: React.FC<EditFamilyProfileModalProps> = ({ family, profile, onSave, onCancel }) => {
    const [editedProfile, setEditedProfile] = useState<OlfactiveFamilyProfile>(profile);

    useEffect(() => {
        setEditedProfile(profile);
    }, [profile]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(family, editedProfile);
    };

    return (
        <BaseModal title={`Edit Profile: ${family}`} onClose={onCancel} size="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="mainCharacter" className="block text-sm font-medium text-gray-400">Main Character</label>
                    <input
                        type="text"
                        id="mainCharacter"
                        name="mainCharacter"
                        value={editedProfile.mainCharacter}
                        onChange={handleChange}
                        className="mt-1 block w-full bg-[#111] border-gray-700 rounded-md shadow-sm focus:ring-[#a89984] focus:border-[#a89984] sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-400">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={editedProfile.description}
                        onChange={handleChange}
                        rows={6}
                        className="mt-1 block w-full bg-[#111] border-gray-700 rounded-md shadow-sm focus:ring-[#a89984] focus:border-[#a89984] sm:text-sm"
                        required
                    />
                </div>
                <div className="pt-5">
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onCancel} className="bg-gray-700 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-600">
                            Cancel
                        </button>
                        <button type="submit" className="bg-[#a89984] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black hover:bg-opacity-80">
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </BaseModal>
    );
};

export default EditFamilyProfileModal;
