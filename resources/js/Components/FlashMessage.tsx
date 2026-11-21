import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Info,
    X,
} from 'lucide-react';
import { PageProps } from '@/types';

type MessageType = 'success' | 'error' | 'warning' | 'info';

interface Message {
    type: MessageType;
    text: string;
}

const styles = {
    success: {
        container: 'bg-emerald-600',
        description: 'text-emerald-100',
        close: 'text-emerald-200 hover:text-white',
        icon: CheckCircle2,
        title: 'Success!',
    },
    error: {
        container: 'bg-red-600',
        description: 'text-red-100',
        close: 'text-red-200 hover:text-white',
        icon: AlertCircle,
        title: 'Something Went Wrong!',
    },
    warning: {
        container: 'bg-amber-500',
        description: 'text-amber-100',
        close: 'text-amber-100 hover:text-white',
        icon: AlertTriangle,
        title: 'Warning!',
    },
    info: {
        container: 'bg-blue-600',
        description: 'text-blue-100',
        close: 'text-blue-200 hover:text-white',
        icon: Info,
        title: 'Information',
    },
};

export default function FlashMessage() {
    const { flash } = usePage<PageProps>().props;

    const [message, setMessage] = useState<Message | null>(null);

    useEffect(() => {
        const type = (['success', 'error', 'warning', 'info'] as const).find(
            (key) => flash?.[key],
        );

        if (type) {
            setMessage({
                type,
                text: flash[type]!,
            });
        } else {
            setMessage(null);
        }
    }, [flash]);

    if (!message) return null;

    const style = styles[message.type];
    const Icon = style.icon;

    return (
        <div
            className={`top-6 right-6 fixed z-[70] ${style.container} text-white px-5 py-4 rounded-2xl shadow-2xl gap-3 animate-in fade-in slide-in-from-top-4 max-w-md flex items-center duration-300`}
        >
            <Icon size={24} className="text-white shrink-0" />

            <div className="flex-1">
                <h5 className="text-sm font-bold">{style.title}</h5>

                <p className={`${style.description} text-xs`}>{message.text}</p>
            </div>

            <button
                type="button"
                onClick={() => setMessage(null)}
                className={`ml-3 cursor-pointer ${style.close}`}
            >
                <X size={18} />
            </button>
        </div>
    );
}
