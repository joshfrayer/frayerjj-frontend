import React, { useEffect, useMemo, useRef, useState } from 'react';

const defaultRenderItem = item => item?.name ?? '';

export function AutocompleteInput({
    fetchUri,
    name,
    minChars = 3,
    maxResults = 10,
    debounceMs = 250,
    queryParam = 'q',
    value,
    onChange,
    onSelect,
    placeholder,
    renderItem = defaultRenderItem,
    className = 'form-control'
}) {
    const [text, setText] = useState(value ?? '');
    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        setText(value ?? '');
    }, [value]);

    useEffect(() => {
        const handleClickOutside = event => {
            if (!wrapperRef.current?.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!fetchUri || text.length < minChars) {
            setItems([]);
            setOpen(false);
            return;
        }

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(async () => {
            try {
                setLoading(true);
                const url = new URL(fetchUri, window.location.origin);
                url.searchParams.set(queryParam, text);
                url.searchParams.set('num_results', String(maxResults));
                const response = await fetch(url.toString());
                const data = await response.json();
                setItems(Array.isArray(data) ? data : []);
                setOpen(true);
            } catch (_err) {
                setItems([]);
                setOpen(false);
            } finally {
                setLoading(false);
            }
        }, debounceMs);

        return () => clearTimeout(timeoutRef.current);
    }, [debounceMs, fetchUri, maxResults, minChars, queryParam, text]);

    const listId = useMemo(() => `autocomplete-${name ?? 'input'}`, [name]);

    const handleSelect = item => {
        const nextText = renderItem(item);
        setText(nextText);
        setOpen(false);
        onChange?.(nextText);
        onSelect?.(item);
    };

    return (
        <div className="position-relative" ref={wrapperRef}>
            <input
                type="text"
                name={name}
                value={text}
                placeholder={placeholder}
                className={className}
                autoComplete="off"
                aria-expanded={open}
                aria-controls={listId}
                onChange={event => {
                    const nextValue = event.target.value;
                    setText(nextValue);
                    onChange?.(nextValue);
                }}
            />
            {open && (
                <ul id={listId} className="autocomplete-dropdown" role="listbox">
                    {loading && <li>Loading...</li>}
                    {!loading && items.length === 0 && <li>No results</li>}
                    {!loading &&
                        items.map((item, index) => (
                            <li
                                key={item.id ?? index}
                                role="option"
                                onMouseDown={event => {
                                    event.preventDefault();
                                    handleSelect(item);
                                }}
                            >
                                {renderItem(item)}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
}
