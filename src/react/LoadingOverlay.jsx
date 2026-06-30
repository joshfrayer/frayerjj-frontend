import React from 'react';

export function LoadingOverlay({ active = false, text = 'Loading', style = 'default' }) {
    if (!active) {
        return null;
    }

    const isPlanetarium = style === 'planetarium';

    return (
        <div className="loading">
            <div className={isPlanetarium ? 'loader planetarium' : 'loader'}>
                <div className="loader-circle" />
                {isPlanetarium ? (
                    <div className="loader-shadow">
                        <div className="loader-logo" />
                    </div>
                ) : (
                    <div className="loader-line-mask">
                        <div className="loader-line" />
                    </div>
                )}
                {!isPlanetarium && <div className="loader-logo" />}
                <div className="loader-text">{text}</div>
            </div>
        </div>
    );
}
