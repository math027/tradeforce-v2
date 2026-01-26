document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    const btnCreate = document.getElementById('btnCreate');
    const btnEdit = document.getElementById('btnEdit');
    const btnDelete = document.getElementById('btnDelete');

    // Inicialização
    updateButtons();

    // Lógica para o botão "Novo"
    btnCreate.addEventListener('click', () => {
        alert('Abrir Modal: Cadastrar novo PDV');
    });

    // Lógica para o botão "Editar"
    btnEdit.addEventListener('click', () => {
        const selectedId = getSelectedRowData(); // Simulação de pegar ID
        alert(`Abrir Modal: Editar PDV selecionado`);
    });

    // Lógica para o botão "Excluir"
    btnDelete.addEventListener('click', () => {
        confirmDelete();
    });

    // Evento no Checkbox "Selecionar Todos"
    selectAllCheckbox.addEventListener('change', function() {
        const isChecked = this.checked;
        
        rowCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
            toggleRowHighlight(checkbox);
        });
        
        updateButtons();
    });

    // Eventos nos Checkboxes individuais das linhas
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            toggleRowHighlight(this);
            updateButtons();
            updateMasterCheckboxState();
        });
    });

    // Função para atualizar o estado (Enable/Disable) dos botões
    function updateButtons() {
        const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;

        // Regra 1: Criar sempre ativo (já definido no HTML)

        // Regra 2: Editar ativo APENAS se tiver exatamente 1 selecionado
        if (checkedCount === 1) {
            btnEdit.disabled = false;
        } else {
            btnEdit.disabled = true;
        }

        // Regra 3: Excluir ativo se tiver 1 ou mais selecionados
        if (checkedCount >= 1) {
            btnDelete.disabled = false;
        } else {
            btnDelete.disabled = true;
        }
    }

    // Função visual para pintar a linha selecionada
    function toggleRowHighlight(checkbox) {
        const row = checkbox.closest('tr');
        if (checkbox.checked) {
            row.classList.add('selected-row');
        } else {
            row.classList.remove('selected-row');
        }
    }

    // Atualiza o estado visual do checkbox "Selecionar Todos" (marcado/indeterminado)
    function updateMasterCheckboxState() {
        const totalRows = rowCheckboxes.length;
        const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;

        if (checkedCount === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (checkedCount === totalRows) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }

    // Simulação para obter dados da linha (ex: ID do banco)
    function getSelectedRowData() {
        // Retornaria o ID do checkbox selecionado
        return "ID_123";
    }

    // Função Global de Confirmação de Exclusão
    function confirmDelete() {
        const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;
        
        const message = checkedCount > 1 
            ? `Tem certeza que deseja excluir os ${checkedCount} PDVs selecionados?` 
            : 'Tem certeza que deseja excluir este PDV?';

        if (confirm(message)) {
            // Aqui entraria a chamada para API/Backend
            console.log('Excluindo itens...');
            
            // Simulação de sucesso
            alert('Operação realizada com sucesso!');
            
            // Resetar interface após exclusão
            rowCheckboxes.forEach(cb => { 
                if(cb.checked) {
                    // Em um cenário real, removeríamos a TR do DOM aqui
                    cb.checked = false; 
                    toggleRowHighlight(cb);
                }
            });
            updateButtons();
            updateMasterCheckboxState();
        }
    }
});