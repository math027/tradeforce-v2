document.addEventListener('DOMContentLoaded', function() {
    
    // --- MOCK DATA: PROMOTORES ---
    const promoters = [
        { id: 1, name: 'Andreza Silva', region: 'Zona Sul - SP', initials: 'AS' },
        { id: 2, name: 'Katia Regina', region: 'Zona Oeste - SP', initials: 'KR' },
        { id: 3, name: 'João Silva', region: 'Centro - SP', initials: 'JS' },
        { id: 4, name: 'Ana Dias', region: 'Zona Norte - SP', initials: 'AD' },
    ];

    // --- MOCK DATA: CARTEIRA DE PDVS ---
    const wallet = {
        1: [ 
            { id: 'p1', name: 'Carrefour Limão', address: 'Av. Otaviano Alves, 100', priority: 'normal', coords: {x: 10, y: 10} },
            { id: 'p2', name: 'Extra Freguesia', address: 'R. da Balsa, 20', priority: 'priority', coords: {x: 12, y: 80} },
            { id: 'p3', name: 'Pão de Açúcar Real', address: 'Av. Real, 90', priority: 'normal', coords: {x: 50, y: 50} },
            { id: 'p4', name: 'Walmart Morumbi', address: 'Av. Morumbi, 10', priority: 'priority', coords: {x: 15, y: 15} }
        ],
        2: [
            { id: 'p5', name: 'Sonda Pompeia', address: 'Av. Pompeia, 1200', priority: 'normal', coords: {x: 0, y: 0} },
            { id: 'p6', name: 'Zaffari Bourbon', address: 'R. Turiassu, 2100', priority: 'priority', coords: {x: 100, y: 100} }
        ],
        3: [], 4: []
    };

    // --- MOCK DATA: PESQUISAS DISPONÍVEIS (NOVO) ---
    const availableSurveys = [
        { id: 's1', title: 'Preço Regular', type: 'Preço' },
        { id: 's2', title: 'Ponta de Gôndola', type: 'Exibição' },
        { id: 's3', title: 'Ruptura Visual', type: 'Estoque' },
        { id: 's4', title: 'Share de Gôndola', type: 'Espaço' },
        { id: 's5', title: 'Ação Concorrência', type: 'Marketing' }
    ];

    // --- STATE: AGENDAMENTO DE PDVS ---
    let schedule = {
        1: { 'mon': [], 'tue': [], 'wed': [], 'thu': [], 'fri': [] },
        2: { 'mon': [], 'tue': [], 'wed': [], 'thu': [], 'fri': [] },
        3: { 'mon': [], 'tue': [], 'wed': [], 'thu': [], 'fri': [] },
        4: { 'mon': [], 'tue': [], 'wed': [], 'thu': [], 'fri': [] }
    };

    // --- STATE: AGENDAMENTO DE PESQUISAS (NOVO) ---
    let surveysSchedule = {
        1: { 'mon': [], 'tue': [], 'wed': [], 'thu': [], 'fri': [] },
        2: { 'mon': [], 'tue': [], 'wed': [], 'thu': [], 'fri': [] },
        3: { 'mon': [], 'tue': [], 'wed': [], 'thu': [], 'fri': [] },
        4: { 'mon': [], 'tue': [], 'wed': [], 'thu': [], 'fri': [] }
    };

    let currentPromoterId = 1;
    let currentModalDay = null;
    let currentModalType = 'pdv'; // 'pdv' ou 'survey'
    let currentReferenceDate = new Date();

    // --- INIT ---
    renderPromoters(promoters);
    selectPromoter(1);
    updateWeekHeader();

    // --- LISTENERS ---
    document.getElementById('searchPromoter')?.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        renderPromoters(promoters.filter(p => p.name.toLowerCase().includes(term)));
    });

    document.getElementById('searchWallet')?.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('#zone-available .pdv-card').forEach(card => {
            const txt = card.textContent.toLowerCase();
            card.style.display = txt.includes(term) ? 'block' : 'none';
        });
    });

    document.getElementById('btnSave').addEventListener('click', function() {
        const original = this.innerHTML;
        this.innerHTML = '<i class="fa-solid fa-check"></i> Salvo!';
        console.log('PDVs:', schedule, 'Pesquisas:', surveysSchedule);
        setTimeout(() => this.innerHTML = original, 2000);
    });

    document.getElementById('btnPrevWeek').addEventListener('click', () => {
        currentReferenceDate.setDate(currentReferenceDate.getDate() - 7);
        updateWeekHeader();
    });
    document.getElementById('btnNextWeek').addEventListener('click', () => {
        currentReferenceDate.setDate(currentReferenceDate.getDate() + 7);
        updateWeekHeader();
    });

    // --- CORE FUNCTIONS ---

    function selectPromoter(id) {
        currentPromoterId = id;
        const p = promoters.find(x => x.id === id);
        
        document.getElementById('displayAvatar').textContent = p.initials;
        document.getElementById('displayName').textContent = p.name;
        document.getElementById('displayRegion').textContent = p.region;

        document.querySelectorAll('.promoter-card').forEach(el => {
            el.classList.toggle('active', parseInt(el.dataset.id) === id);
        });

        loadBoard();
    }

    function loadBoard() {
        // Limpar Zonas
        document.getElementById('zone-available').innerHTML = '';
        document.querySelectorAll('.day-zone, .survey-zone').forEach(el => el.innerHTML = '');
        
        // 1. Carregar Carteira
        const userWallet = wallet[currentPromoterId] || [];
        document.getElementById('walletCount').textContent = userWallet.length;
        userWallet.forEach(pdv => {
            document.getElementById('zone-available').appendChild(createPDVCard(pdv, null, true));
        });

        const days = ['mon', 'tue', 'wed', 'thu', 'fri'];

        days.forEach(day => {
            // 2. Carregar PDVs do Dia
            const userPdvSchedule = schedule[currentPromoterId][day] || [];
            const zonePdv = document.getElementById(`zone-pdv-${day}`);
            
            userPdvSchedule.forEach(item => {
                const pdv = userWallet.find(x => x.id === item.pdvId);
                if(pdv && zonePdv) {
                    zonePdv.appendChild(createPDVCard(pdv, item.instanceId, false));
                }
            });

            // 3. Carregar Pesquisas do Dia (NOVO)
            const userSurveySchedule = surveysSchedule[currentPromoterId][day] || [];
            const zoneSurvey = document.getElementById(`zone-survey-${day}`);

            userSurveySchedule.forEach(item => {
                const survey = availableSurveys.find(x => x.id === item.surveyId);
                if(survey && zoneSurvey) {
                    zoneSurvey.appendChild(createSurveyCard(survey, item.instanceId));
                }
            });
        });
    }

    // --- COMPONENTES VISUAIS ---

    function createPDVCard(pdv, instanceId, isSource) {
        const div = document.createElement('div');
        div.className = 'pdv-card';
        if(isSource) div.classList.add('source-card');
        
        div.id = isSource ? `source_${pdv.id}` : instanceId;
        div.draggable = true;
        div.dataset.pdvId = pdv.id;
        div.dataset.source = isSource;

        div.innerHTML = `
            <span class="pdv-name">${pdv.name}</span>
            <div class="pdv-details"><i class="fa-solid fa-location-dot"></i> ${pdv.address}</div>
            <div class="status-dot ${pdv.priority === 'priority' ? 'dot-priority' : 'dot-normal'}"></div>
            ${!isSource ? `<button class="btn-remove-item" onclick="removeItem('${instanceId}', 'pdv')"><i class="fa-solid fa-times"></i></button>` : ''}
        `;

        div.addEventListener('dragstart', handleDragStart);
        return div;
    }

    function createSurveyCard(survey, instanceId) {
        const div = document.createElement('div');
        div.className = 'survey-card';
        div.id = instanceId;
        
        // Pesquisas não são "draggables" neste exemplo, apenas adicionáveis via modal
        div.innerHTML = `
            <span class="survey-title">${survey.title}</span>
            <span class="survey-type">${survey.type}</span>
            <button class="btn-remove-item" onclick="removeItem('${instanceId}', 'survey')"><i class="fa-solid fa-times"></i></button>
        `;
        return div;
    }

    // --- DRAG AND DROP (Apenas para PDVs) ---
    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            pdvId: e.target.dataset.pdvId,
            isSource: e.target.dataset.source === 'true',
            domId: e.target.id
        }));
    }

    document.querySelectorAll('.day-zone').forEach(zone => {
        zone.addEventListener('dragover', e => e.preventDefault());
        zone.addEventListener('drop', handleDrop);
    });

    function handleDrop(e) {
        e.preventDefault();
        const zone = e.currentTarget;
        const day = zone.dataset.day;
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        
        const userWallet = wallet[currentPromoterId];
        const pdv = userWallet.find(x => x.id === data.pdvId);

        // Lógica de Movimento PDV (Igual ao anterior)
        const existing = schedule[currentPromoterId][day].find(x => x.pdvId === data.pdvId);
        if(existing && existing.instanceId !== data.domId) {
            alert('PDV já agendado hoje.'); return;
        }

        const newId = `inst_pdv_${Date.now()}`;

        if(!data.isSource) {
            // Remove do local antigo
            removeItem(data.domId, 'pdv');
        }

        schedule[currentPromoterId][day].push({ instanceId: newId, pdvId: data.pdvId });
        zone.appendChild(createPDVCard(pdv, newId, false));
    }

    // --- REMOÇÃO UNIFICADA ---
    window.removeItem = function(instanceId, type) {
        const el = document.getElementById(instanceId);
        if(!el) return;

        // Achar o dia através do elemento pai
        const zone = el.parentElement; 
        const day = zone.getAttribute('data-day');

        if(day) {
            if(type === 'pdv') {
                schedule[currentPromoterId][day] = schedule[currentPromoterId][day].filter(x => x.instanceId !== instanceId);
            } else if(type === 'survey') {
                surveysSchedule[currentPromoterId][day] = surveysSchedule[currentPromoterId][day].filter(x => x.instanceId !== instanceId);
            }
        }
        el.remove();
    }

    // --- MODAL REUTILIZÁVEL ---
    window.openModal = function(day, type) {
        currentModalDay = day;
        currentModalType = type; // 'pdv' ou 'survey'
        
        const modal = document.getElementById('modalOverlay');
        const list = document.getElementById('modalList');
        const title = modal.querySelector('h3');
        list.innerHTML = '';

        if(type === 'pdv') {
            title.textContent = "Adicionar PDVs";
            const userWallet = wallet[currentPromoterId];
            
            userWallet.forEach(item => {
                const exists = schedule[currentPromoterId][day].find(x => x.pdvId === item.id);
                createCheckRow(list, item.id, item.name, item.address, exists);
            });

        } else {
            title.textContent = "Adicionar Pesquisas";
            // Para pesquisas, permitimos repetir a mesma pesquisa no mesmo dia? 
            // Vamos assumir que sim, ou não bloqueamos.
            availableSurveys.forEach(item => {
                // Aqui não checamos 'exists' pq pode ter varias pesquisas iguais
                createCheckRow(list, item.id, item.title, item.type, false);
            });
        }

        modal.classList.add('open');
    }

    function createCheckRow(container, value, title, subtitle, isDisabled) {
        const row = document.createElement('div');
        row.className = 'check-row';
        row.innerHTML = `
            <input type="checkbox" value="${value}" ${isDisabled ? 'disabled checked' : ''}>
            <div><strong>${title}</strong> <small>${subtitle}</small></div>
        `;
        row.onclick = function(e) {
            if(e.target.type !== 'checkbox' && !isDisabled) {
                const chk = this.querySelector('input'); chk.checked = !chk.checked;
            }
        };
        container.appendChild(row);
    }

    window.closeModal = function() {
        document.getElementById('modalOverlay').classList.remove('open');
    }

    window.confirmModal = function() {
        const checks = document.querySelectorAll('#modalList input:checked:not(:disabled)');
        
        checks.forEach(chk => {
            const idVal = chk.value;
            const newId = `inst_${currentModalType}_${Date.now()}_${Math.random().toString(36).substr(2,5)}`;

            if(currentModalType === 'pdv') {
                const pdv = wallet[currentPromoterId].find(x => x.id === idVal);
                schedule[currentPromoterId][currentModalDay].push({ instanceId: newId, pdvId: idVal });
                
                const zone = document.getElementById(`zone-pdv-${currentModalDay}`);
                zone.appendChild(createPDVCard(pdv, newId, false));
            
            } else {
                const survey = availableSurveys.find(x => x.id === idVal);
                surveysSchedule[currentPromoterId][currentModalDay].push({ instanceId: newId, surveyId: idVal });
                
                const zone = document.getElementById(`zone-survey-${currentModalDay}`);
                zone.appendChild(createSurveyCard(survey, newId));
            }
        });
        closeModal();
    }
    
    // --- UTILS ---
    function renderPromoters(listData) {
        const list = document.getElementById('promotersList');
        list.innerHTML = '';
        listData.forEach(p => {
            const card = document.createElement('div');
            card.className = `promoter-card ${p.id === currentPromoterId ? 'active' : ''}`;
            card.onclick = () => selectPromoter(p.id);
            card.innerHTML = `<div class="promoter-avatar">${p.initials}</div>
                              <div class="promoter-info"><h4>${p.name}</h4><p>${p.region}</p></div>`;
            list.appendChild(card);
        });
    }

    function updateWeekHeader() {
        const display = document.getElementById('weekDisplay');
        const day = currentReferenceDate.getDay(); 
        const diff = currentReferenceDate.getDate() - day + (day === 0 ? -6 : 1); 
        const monday = new Date(currentReferenceDate);
        monday.setDate(diff);

        const daysIds = ['date-mon', 'date-tue', 'date-wed', 'date-thu', 'date-fri'];
        const options = { day: '2-digit', month: '2-digit' };
        
        let loopDate = new Date(monday);
        const startStr = monday.toLocaleDateString('pt-BR', options);
        
        for(let i=0; i<5; i++) {
            const el = document.getElementById(daysIds[i]);
            if(el) el.textContent = loopDate.toLocaleDateString('pt-BR', options);
            loopDate.setDate(loopDate.getDate() + 1);
        }
        const friday = new Date(monday); friday.setDate(monday.getDate() + 4);
        display.textContent = `Semana (${startStr} a ${friday.toLocaleDateString('pt-BR', options)})`;
    }

    window.optimizeRoute = (day) => alert('Otimizando ' + day);
});