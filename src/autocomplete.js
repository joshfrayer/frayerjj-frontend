export const autocomplete = {
    registry: new Map(),
    evalPattern: (pattern, item) => {
        let result = pattern.replace(/\$\{(\w+)\}/g, (match, key) => {
            return item[key] !== undefined && item[key] !== null ? item[key] : '';
        });
        result = result.replace(/\(\s*\)/g, '').trim();
        return result.replace(/\s+/g, ' ');
    },
    populate: (name, items, patternOverride) => {
        const entry = autocomplete.registry.get(name);
        if (!entry) return;
        const { ul, el, display_pattern } = entry;
        const pattern = patternOverride ?? display_pattern;
        ul.innerHTML = '';        
        if (items.length > 0) {
            items.forEach(it => {
                const li = document.createElement('li');
                const label = autocomplete.evalPattern(pattern, it);
                li.textContent = label;
                li.addEventListener('click', () => {
                    el.value = label;
                    ul.innerHTML = '';
                    ul.style.display = 'none';
                    const selectedEvent = new Event('autocomplete.selected', { bubbles: true });
                    selectedEvent.selection = it;
                    el.dispatchEvent(selectedEvent);
                });
                ul.appendChild(li);
            });
            ul.style.display = 'block';
        } else ul.style.display = 'none';
    },
    init: () => {
        document.querySelectorAll('input.autocomplete').forEach(el => {
            const uri = el.getAttribute('data-uri');
            const num_results = el.getAttribute('num-results') ?? 10;
            const expire_length = el.getAttribute('expire-length') ?? 250;
            const display_pattern = el.getAttribute('display-pattern') ?? '${name}';
            const name = el.getAttribute('name');
            const ul = document.createElement('ul');
            ul.classList.add('autocomplete-dropdown');
            ul.style.display = 'none';
            el.parentElement.classList.add('position-relative')
            el.parentElement.append(ul);
            if (name) autocomplete.registry.set(name, { el, ul, display_pattern });
            let timeout = null;
            el.addEventListener('input', () => {
                clearTimeout(timeout);
                if (el.value.length < 3) {
                    ul.style.display = 'none';
                    return;
                }
                timeout = setTimeout(async () => {
                    try {
                        const response = await fetch(`${uri}?q=${el.value}&num_results=${num_results}`);
                        const data = await response.json();
                        autocomplete.populate(name, data);
                    } catch (err) {
                        msg.error("Autocomplete fetch failed", err);
                    }
                }, expire_length);
            });
            document.addEventListener('click', ev => {
                if (!el.contains(ev.target) && !ul.contains(ev.target)) ul.style.display = 'none';
            });
        });
    }
};