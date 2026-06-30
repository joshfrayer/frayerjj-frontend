import React, { useMemo, useState } from 'react';

export function HasManyField({
    name,
    options = [],
    allowNone = false,
    noneLabel = 'None',
    buttonLabel = 'Select Objects',
    selectedIds,
    defaultSelectedIds = [],
    onChange
}) {
    const controlled = Array.isArray(selectedIds);
    const [internalIds, setInternalIds] = useState(defaultSelectedIds);
    const activeIds = controlled ? selectedIds : internalIds;

    const selectedSet = useMemo(() => new Set(activeIds), [activeIds]);

    const update = nextIds => {
        if (!controlled) {
            setInternalIds(nextIds);
        }
        onChange?.(nextIds);
    };

    const toggle = id => {
        const next = new Set(selectedSet);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        update(Array.from(next));
    };

    return (
        <div className="hasmany">
            <div className="card">
                <ul className="list-group list-group-flush hasmany-selected-list">
                    {activeIds.length === 0 && <li className="list-group-item text-muted">No selections</li>}
                    {activeIds.map(id => {
                        const option = options.find(opt => String(opt.id) === String(id));
                        return (
                            <li key={id} className="list-group-item hasmany-selected-item">
                                {option?.label ?? String(id)}
                                <input type="hidden" name={`${name}[]`} value={id} />
                            </li>
                        );
                    })}
                </ul>
                <div className="card-footer bg-transparent">
                    <details>
                        <summary className="btn btn-outline-secondary w-100">{buttonLabel}</summary>
                        <ul className="list-group list-group-flush hasmany-modal-list mt-2">
                            {allowNone && (
                                <li className="list-group-item hasmany-check-item">
                                    <input
                                        type="checkbox"
                                        className="form-check-input mt-0"
                                        checked={activeIds.length === 0}
                                        onChange={event => {
                                            if (event.target.checked) {
                                                update([]);
                                            }
                                        }}
                                    />
                                    <label className="form-check-label ms-2 flex-grow-1">{noneLabel}</label>
                                </li>
                            )}
                            {options.map(option => (
                                <li key={option.id} className="list-group-item hasmany-check-item">
                                    <input
                                        type="checkbox"
                                        className="form-check-input mt-0"
                                        checked={selectedSet.has(option.id)}
                                        onChange={() => toggle(option.id)}
                                    />
                                    <label className="form-check-label ms-2 flex-grow-1">{option.label}</label>
                                </li>
                            ))}
                        </ul>
                    </details>
                </div>
            </div>
        </div>
    );
}
