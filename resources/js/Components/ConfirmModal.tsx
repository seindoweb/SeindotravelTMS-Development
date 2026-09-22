import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { AlertTriangle } from 'lucide-react';
import { PropsWithChildren } from 'react';

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isProcessing = false,
}: PropsWithChildren<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string | React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    isProcessing?: boolean;
}>) {
    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="mt-1">
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <div className="mt-2 text-sm text-gray-500">{message}</div>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end gap-3 bg-gray-50 px-6 py-4">
                <SecondaryButton onClick={onClose} disabled={isProcessing}>
                    {cancelText}
                </SecondaryButton>
                
                <DangerButton onClick={onConfirm} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : confirmText}
                </DangerButton>
            </div>
        </Modal>
    );
}
