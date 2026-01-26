document.addEventListener('DOMContentLoaded', function() {
    // --- DADOS MOCKADOS (Simulando Banco de Dados) ---
    const mockPDVs = [
        { id: 1, nome: 'Carrefour - Loja 102', cidade: 'São Paulo - SP' },
        { id: 2, nome: 'Pão de Açúcar - Leblon', cidade: 'Rio de Janeiro - RJ' },
        { id: 3, nome: 'Mercadinho do Bairro', cidade: 'Viana - ES' },
        { id: 4, nome: 'Extra Supermercados', cidade: 'Belo Horizonte - MG' },
        { id: 5, nome: 'Atacadão - Centro', cidade: 'Vitória - ES' },
        { id: 6, nome: 'Leroy Merlin', cidade: 'São Paulo - SP' },
        { id: 7, nome: 'Farmácia Pague Menos', cidade: 'Salvador - BA' },
        { id: 8, nome: 'Shopping Vitória', cidade: 'Vitória - ES' }
    ];

    // --- SELETORES GERAIS ---
    const modal = document.getElementById('modalCollaborator');
    const modalDelete = document.getElementById('modalDelete');
    const pdvListContainer = document.getElementById('pdvListContainer');
    const filterInput = document.getElementById('filterPDV');
    const selectedCountSpan = document.getElementById('selectedCount');
    
    // Botões Principais
    const btnNew = document.querySelector('.btn-primary'); // Botão Novo Colaborador
    const btnEdit = document.querySelector('.header-actions-group .btn-secondary:first-child');
    const btnDelete = document.querySelector('.header-actions-group .btn-secondary:last-child');
    
    // Botões Modais
    const btnCloseModal = document.getElementById('closeModal');
    const btnCancel = document.getElementById('cancelBtn');
    const btnCancelDelete = document.getElementById('cancelDelete');
    
    // --- FUNÇÕES AUXILIARES ---

    // 1. Renderizar Lista de PDVs
    function renderPDVs(filterText = '') {
        pdvListContainer.innerHTML = ''; // Limpa lista
        let count = 0;

        mockPDVs.forEach(pdv => {
            // Filtro (Nome ou Cidade)
            if (pdv.nome.toLowerCase().includes(filterText) || pdv.cidade.toLowerCase().includes(filterText)) {
                
                const div = document.createElement('div');
                div.className = 'pdv-item';
                div.innerHTML = `
                    <input type="checkbox" class="custom-checkbox pdv-checkbox" value="${pdv.id}">
                    <div class="pdv-info">
                        <span class="pdv-name">${pdv.nome}</span>
                        <span class="pdv-loc">${pdv.cidade}</span>
                    </div>
                `;
                pdvListContainer.appendChild(div);
                count++;
            }
        });

        // Atualizar contador de selecionados ao clicar
        const checkboxes = pdvListContainer.querySelectorAll('.pdv-checkbox');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', updateSelectedCount);
        });

        if (count === 0) {
            pdvListContainer.innerHTML = '<div style="padding:15px; text-align:center; color:#94a3b8; font-size:13px;">Nenhum PDV encontrado.</div>';
        }
    }

    // 2. Atualizar contador de PDVs selecionados
    function updateSelectedCount() {
        const total = document.querySelectorAll('.pdv-list-container .pdv-checkbox:checked').length;
        selectedCountSpan.innerText = `${total} selecionados`;
    }

    // 3. Abrir Modal de Edição/Criação
    function openModal(isEdit = false) {
        const title = document.getElementById('modalTitle');
        title.innerText = isEdit ? 'Editar Colaborador' : 'Novo Colaborador';
        
        // Limpar form se for novo
        if (!isEdit) {
            document.getElementById('collaboratorForm').reset();
            renderPDVs(); // Renderiza limpo
            updateSelectedCount();
        } else {
            // Se for editar, aqui você puxaria os dados da linha selecionada
            // Simulando preenchimento:
            document.getElementById('inputName').value = "Andreza Silva";
            document.getElementById('inputEmail').value = "andreza.silva@tradeforce.com";
            document.getElementById('inputRole').value = "promotor";
            
            renderPDVs(); 
            // Simula alguns PDVs já marcados
            const checkboxes = pdvListContainer.querySelectorAll('.pdv-checkbox');
            if(checkboxes.length > 0) checkboxes[0].checked = true;
            updateSelectedCount();
        }

        modal.classList.remove('hidden');
    }

    // --- EVENT LISTENERS ---

    // Botão Novo
    btnNew.addEventListener('click', () => openModal(false));

    // Botão Editar
    btnEdit.addEventListener('click', () => {
        // Verifica se está habilitado
        if (!btnEdit.hasAttribute('disabled')) {
            openModal(true);
        }
    });

    // Botão Excluir (Abre Modal de Confirmação)
    btnDelete.addEventListener('click', () => {
        if (!btnDelete.hasAttribute('disabled')) {
            modalDelete.classList.remove('hidden');
        }
    });

    // Fechar Modais
    [btnCloseModal, btnCancel].forEach(el => el.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('hidden');
    }));

    btnCancelDelete.addEventListener('click', () => modalDelete.classList.add('hidden'));

    // Filtro de PDV
    filterInput.addEventListener('input', (e) => {
        const text = e.target.value.toLowerCase();
        renderPDVs(text);
    });

    // Manter lógica de checkbox da tabela principal (do seu código anterior)
    const selectAllCheckbox = document.querySelector('thead .custom-checkbox');
    const rowCheckboxes = document.querySelectorAll('tbody .custom-checkbox');

    function updateActionButtons() {
        const checkedCount = document.querySelectorAll('tbody .custom-checkbox:checked').length;
        if (checkedCount > 0) {
            btnDelete.removeAttribute('disabled');
            // Editar só habilita se tiver exatamente 1 selecionado
            if (checkedCount === 1) {
                btnEdit.removeAttribute('disabled');
            } else {
                btnEdit.setAttribute('disabled', 'disabled');
            }
        } else {
            btnEdit.setAttribute('disabled', 'disabled');
            btnDelete.setAttribute('disabled', 'disabled');
        }
    }

    if(selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(cb => cb.checked = this.checked);
            updateActionButtons();
        });
    }

    rowCheckboxes.forEach(cb => {
        cb.addEventListener('change', function() {
            const allChecked = Array.from(rowCheckboxes).every(c => c.checked);
            selectAllCheckbox.checked = allChecked;
            updateActionButtons();
        });
    });
});