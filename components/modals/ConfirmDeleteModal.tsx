
import React from 'react';
import BaseModal from '../ui/BaseModal';

interface ConfirmDeleteModalProps {
    itemName: string;
    itemType: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ itemName, itemType, onConfirm, onCancel }) => {
    return (
        <BaseModal title="Confirm Deletion" onClose={onCancel} size="md">
            <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-white">Delete {itemType}?</h3>
                <p className="mt-2 text-sm text-gray-400">
                    Are you sure you want to delete <strong className="text-gray-200">{itemName}</strong>? 
                    This action is irreversible.
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                    <button
                        onClick={onCancel}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="border border-red-900 text-red-500 hover:bg-red-900/20 font-semibold py-2 px-6 rounded-md transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default ConfirmDeleteModal;
