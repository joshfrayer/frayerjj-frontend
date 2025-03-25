import { msg } from './msg.js';
import { modal } from './modal.js';

export const hasMany = {

    sampleArgs: {
        name: 'name', // Variable name
        title: 'Title', // Verbose name
        notb: false, // Use None of the Below
        messages: {
            notbLabel: 'None', // Label for None of the Below
            close: 'Close', // Close button text
            button: 'Select Objects' // OK button text
        },
        options: [
            { id: 1, label: 'Option 1', checked: false },
            { id: 2, label: 'Option 2', checked: true }
        ]
    },

    build: {

        core: args => {
            msg.verbose('Building Has Many Inupt');
            // Create container
            let container = document.createElement('div');
            // Create list of selected items
            let list = document.createElement('ul');
            list.id = 'id_' + args.name;
            list.className = 'list-group list-group-flush';
            // Create list of all options for modal
            let modalList = document.createElement('ul');
            modalList.className = 'list-group list-group-flush';
            // Create hidden input for when there is no selected items
            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = args.name + '[]';
            // If using None of the Below
            if (args.notb)
                modalList.insertAdjacentHTML('beforeend', hasMany.build.checkItem(args.name, {
                    id: 'notb',
                    label: (args.notbLabel ?? hasMany.sampleArgs.messages.notbLabel),
                    notb: true
                }));
            // Cycle through all options
            Objects.values(args.options).forEach(option => {
                modalList.insertAdjacentHTML('beforeend', hasMany.build.checkItem(args.name, option));
                // If option is selected, add to list
                if (option.checked)
                    list.insertAdjacentHTML('beforeend', hasMany.build.item(args.name, option));
            });
            // Create modal
            let randomId = modal.randomId('hasmany');
            document.querySelector('body').insertAdjacentHTML('beforeend', modal.build.modal({
                id: randomId,
                title: args.title,
                body: modalList.outerHTML,
                buttons: [ { text: args.messages.close ?? hasMany.sampleArgs.messages.close } ]
            }));
            // Create button to open modal
            let button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-outline-secondary btn-block';
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', '#' + randomId);
            button.textContent = args.messages.button ?? hasMany.sampleArgs.messages.button;
            // Add elements to container
            container.appendChild(input);
            container.appendChild(list);
            container.appendChild(button);
            // Return container
            return container.outerHTML;
        },

        checkItem: (name, option) => {
            // Create list item
            let item = document.createElement('li');
            item.className = 'list-group-item';
            // Create checkbox
            let input = document.createElement('input');
            input.classList.add('form-check-input');
            if (option.notb)
                input.classList.add('hasmany-' + name + 'notb');
            else
                input.classList.add('hasmany-' + name);
            input.type = 'checkbox';
            if (option.checked)
                input.checked = true
            input.id = name + option.id;
            input.value = id;
            item.appendChild(input);
            // Create label
            let label = document.createElement('label');
            label.setAttribute('for', name + option.id);
            label.textContent = option.label;
            item.appendChild(label);
            return item.outerHTML;
        },

        listItem: (name, option) => {
            // Create list item
            let item = document.createElement('li');
            item.id = 'id_' + name + '_' + option.id;
            item.textContent = option.label;
            item.className = 'list-group-item';
            // Create hidden input
            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = name + '[]';
            input.value = option.id;
            item.appendChild(input);
            return item.outerHTML;
        }
    },
    
    init: () => {
        document.querySelectorAll('.has-many').forEach(el => {
            // Get arguments
            let args = JSON.parse(el.innerHTML);
            // Build has many input
            el.innerHTML = hasMany.build.core(args);
            // Add event listeners
            document.querySelectorAll('.hasmany-' + args.name).forEach(input => {
                input.addEventListener('change', ev => {
                    if (ev.target.checked) {
                        // Add item to list
                        document.querySelector('#id_' + args.name).insertAdjacentHTML('beforeend', hasMany.build.item(args.name, {
                            id: ev.target.value,
                            label: ev.target.nextElementSibling.textContent
                        }));
                        // If using None of the Below, make sure it is unchecked
                        if (args.notb)
                            document.querySelector('.hasmany-' + args.name + 'notb').checked = false;
                    } else
                        // Remove item from list
                        document.querySelector('#id_' + args.name + '_' + ev.target.value).remove();
                });
            });
            // Add event listener for None of the Below
            if (args.notb)
                document.querySelector('.hasmany-' + args.name + 'notb').addEventListener('change', ev => {
                    if (ev.target.checked)
                        // Uncheck all other items
                        document.querySelectorAll('hasmany-' + args.name).forEach(input => {
                            input.checked = false;
                        });
                        // Remove all items from list
                        document.querySelector('#id_' + args.name).innerHTML = '';
                });
        });
    }
}