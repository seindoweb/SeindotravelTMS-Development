import React, { useEffect, useRef } from 'react';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Heading2,
    Heading3,
    RemoveFormatting,
    Undo,
    Redo,
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
    minHeight?: string;
}

export const sanitizeHtml = (dirtyHtml: string): string => {
    if (!dirtyHtml || dirtyHtml === '<br>') return '';

    const temp = document.createElement('div');
    temp.innerHTML = dirtyHtml;

    // 1. Remove all style attributes completely (prevents Tailwind --tw-* pollution)
    const styledElements = temp.querySelectorAll('[style]');
    styledElements.forEach((el) => {
        el.removeAttribute('style');
    });

    // 2. Unwrap all span elements
    const spans = Array.from(temp.querySelectorAll('span'));
    spans.forEach((span) => {
        const parent = span.parentNode;
        if (parent) {
            while (span.firstChild) {
                parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
        }
    });

    // 3. Remove useless empty formatting tags
    const emptyTags = temp.querySelectorAll('b, i, u, strong, em, h2, h3, p, span');
    emptyTags.forEach((el) => {
        if (!el.textContent?.trim() && !el.querySelector('br, img')) {
            el.remove();
        }
    });

    let clean = temp.innerHTML.trim();
    // Regex cleanup passes for stray spans or empty tags
    clean = clean.replace(/<span\s*>([\s\S]*?)<\/span>/gi, '$1');
    clean = clean.replace(/<(b|i|u|strong|em)\s*><\/\1>/gi, '');

    return clean === '<br>' ? '' : clean;
};

export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'Write content here...',
    className = '',
    minHeight = 'min-h-[180px]',
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    // Sync external value to innerHTML when not focused or when value changed externally
    useEffect(() => {
        if (editorRef.current) {
            const isFocused = document.activeElement === editorRef.current;
            if (!isFocused && editorRef.current.innerHTML !== value) {
                editorRef.current.innerHTML = value || '';
            }
        }
    }, [value]);

    const handleFocus = () => {
        try {
            document.execCommand('styleWithCSS', false, 'false');
            document.execCommand('defaultParagraphSeparator', false, 'p');
        } catch {
            // ignore fallback
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            const raw = editorRef.current.innerHTML;
            const cleaned = sanitizeHtml(raw);
            onChange(cleaned);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
        handleInput();
    };

    const executeCommand = (command: string, arg?: string) => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
        try {
            document.execCommand('styleWithCSS', false, 'false');
            document.execCommand(command, false, arg);
        } catch {
            // fallback
        }
        handleInput();
    };

    return (
        <div
            className={`border border-[#E2E8F0] rounded-xl overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all duration-150 ${className}`}
        >
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-[#F8FAFC] border-b border-[#E2E8F0] text-gray-600">
                <button
                    type="button"
                    title="Bold"
                    onClick={() => executeCommand('bold')}
                    className="p-1.5 rounded hover:bg-slate-200 hover:text-gray-900 transition-colors"
                >
                    <Bold size={15} />
                </button>
                <button
                    type="button"
                    title="Italic"
                    onClick={() => executeCommand('italic')}
                    className="p-1.5 rounded hover:bg-slate-200 hover:text-gray-900 transition-colors"
                >
                    <Italic size={15} />
                </button>
                <button
                    type="button"
                    title="Underline"
                    onClick={() => executeCommand('underline')}
                    className="p-1.5 rounded hover:bg-slate-200 hover:text-gray-900 transition-colors"
                >
                    <Underline size={15} />
                </button>

                <div className="h-4 w-[1px] bg-gray-300 mx-1" />

                <button
                    type="button"
                    title="Heading 2"
                    onClick={() => executeCommand('formatBlock', '<h2>')}
                    className="px-2 py-1 text-xs font-bold rounded hover:bg-slate-200 hover:text-gray-900 transition-colors flex items-center gap-1"
                >
                    <Heading2 size={15} />
                </button>
                <button
                    type="button"
                    title="Heading 3"
                    onClick={() => executeCommand('formatBlock', '<h3>')}
                    className="px-2 py-1 text-xs font-semibold rounded hover:bg-slate-200 hover:text-gray-900 transition-colors flex items-center gap-1"
                >
                    <Heading3 size={15} />
                </button>
                <button
                    type="button"
                    title="Paragraph"
                    onClick={() => executeCommand('formatBlock', '<p>')}
                    className="px-2 py-1 text-xs font-medium rounded hover:bg-slate-200 hover:text-gray-900 transition-colors"
                >
                    P
                </button>

                <div className="h-4 w-[1px] bg-gray-300 mx-1" />

                <button
                    type="button"
                    title="Bullet List"
                    onClick={() => executeCommand('insertUnorderedList')}
                    className="p-1.5 rounded hover:bg-slate-200 hover:text-gray-900 transition-colors"
                >
                    <List size={15} />
                </button>
                <button
                    type="button"
                    title="Numbered List"
                    onClick={() => executeCommand('insertOrderedList')}
                    className="p-1.5 rounded hover:bg-slate-200 hover:text-gray-900 transition-colors"
                >
                    <ListOrdered size={15} />
                </button>

                <div className="h-4 w-[1px] bg-gray-300 mx-1" />

                <button
                    type="button"
                    title="Clear Formatting"
                    onClick={() => executeCommand('removeFormat')}
                    className="p-1.5 rounded hover:bg-slate-200 hover:text-gray-900 transition-colors"
                >
                    <RemoveFormatting size={15} />
                </button>
                <button
                    type="button"
                    title="Undo"
                    onClick={() => executeCommand('undo')}
                    className="p-1.5 rounded hover:bg-slate-200 hover:text-gray-900 transition-colors"
                >
                    <Undo size={15} />
                </button>
                <button
                    type="button"
                    title="Redo"
                    onClick={() => executeCommand('redo')}
                    className="p-1.5 rounded hover:bg-slate-200 hover:text-gray-900 transition-colors"
                >
                    <Redo size={15} />
                </button>
            </div>

            {/* Editable Content */}
            <div
                ref={editorRef}
                contentEditable
                onFocus={handleFocus}
                onInput={handleInput}
                onPaste={handlePaste}
                data-placeholder={placeholder}
                className={`p-3 text-sm text-gray-800 focus:outline-none overflow-y-auto ${minHeight} [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400 [&:empty]:before:pointer-events-none [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mb-1.5 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mb-1 [&_p]:mb-1.5 leading-relaxed`}
            />
        </div>
    );
}
