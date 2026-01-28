document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // --- 1. DADOS E DASHBOARD (MOCK DB) ---
    // ==========================================

    const rawData = [
        { id: 1, day: '26', name: 'Marcos Costa', route: 'Zona Leste', status: 'done', progress: 100, visitsReal: 15, visitsTotal: 15, checkin: '16:30' },
        { id: 2, day: '26', name: 'Luana B.', route: 'Centro', status: 'late', progress: 0, visitsReal: 0, visitsTotal: 10, checkin: null },
        { id: 3, day: '27', name: 'Andreza Silva', route: 'Zona Norte', status: 'done', progress: 100, visitsReal: 12, visitsTotal: 12, checkin: '09:45' },
        { id: 4, day: '27', name: 'Katia Regina', route: 'Centro', status: 'pending', progress: 60, visitsReal: 6, visitsTotal: 10, checkin: '10:15' },
        { id: 5, day: '27', name: 'João Silva', route: 'Zona Sul', status: 'late', progress: 0, visitsReal: 0, visitsTotal: 8, checkin: null },
        { id: 6, day: '27', name: 'Beatriz Lima', route: 'Oeste', status: 'pending', progress: 40, visitsReal: 4, visitsTotal: 10, checkin: '09:00' },
        { id: 7, day: '28', name: 'Ana Dias', route: 'Grande Vitória', status: 'pending', progress: 20, visitsReal: 2, visitsTotal: 14, checkin: '08:30' },
        { id: 8, day: '28', name: 'Carlos H.', route: 'Vila Velha', status: 'done', progress: 100, visitsReal: 8, visitsTotal: 8, checkin: '14:20' }
    ];

    let currentWeekStart = new Date();
    let selectedDay = new Date().getDate().toString();
    let sortDirection = 'asc'; 

    const tableBody = document.getElementById('routesTableBody');
    const weekContainer = document.getElementById('weekDaysContainer');
    
    const filters = {
        name: document.getElementById('filterName'),
        sortNameBtn: document.getElementById('sortNameBtn'),
        status: document.getElementById('filterStatus'),
        progress: document.getElementById('filterProgress'),
        visits: document.getElementById('filterVisits'),
        sortCheckin: document.getElementById('sortCheckin'),
        clearBtn: document.getElementById('clearFilters')
    };

    // --- LÓGICA DE SEMANA ---
    function getMonday(d) {
        d = new Date(d);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    function generateWeekDays(startDate) {
        weekContainer.innerHTML = '';
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        let currentLoopDate = new Date(startDate);

        for (let i = 0; i < 7; i++) {
            const dayNum = currentLoopDate.getDate();
            const dayName = days[currentLoopDate.getDay()];
            const div = document.createElement('div');
            div.className = 'day-card';
            
            if (dayNum.toString() === selectedDay) div.classList.add('active');
            if (dayName === 'Dom') div.classList.add('disabled');

            div.innerHTML = `<span class="day-name">${dayName}</span><span class="day-number">${dayNum}</span>`;
            
            if (dayName !== 'Dom') {
                div.addEventListener('click', () => {
                    document.querySelectorAll('.day-card').forEach(c => c.classList.remove('active'));
                    div.classList.add('active');
                    selectedDay = dayNum.toString();
                    applyFiltersAndRender();
                });
            }
            weekContainer.appendChild(div);
            currentLoopDate.setDate(currentLoopDate.getDate() + 1);
        }
    }

    document.getElementById('prevWeekBtn').addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        generateWeekDays(getMonday(currentWeekStart));
    });

    document.getElementById('nextWeekBtn').addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        generateWeekDays(getMonday(currentWeekStart));
    });

    // --- LÓGICA DE FILTRAGEM ---
    function getAvatarColor(name) {
        const colors = [{bg:'#dbeafe',tx:'#1e40af'},{bg:'#d1fae5',tx:'#065f46'},{bg:'#ffedd5',tx:'#9a3412'},{bg:'#fce7f3',tx:'#9d174d'},{bg:'#f3f4f6',tx:'#374151'}];
        return colors[name.length % colors.length];
    }

    function getStatusLabel(status) {
        const map = {
            'done': { label: 'Finalizado', class: 'status-done', color: 'var(--success)' },
            'pending': { label: 'Em Rota', class: 'status-pending', color: 'var(--warning)' },
            'late': { label: 'Não Iniciado', class: 'status-late', color: 'var(--error)' }
        };
        return map[status] || map['late'];
    }

    function applyFiltersAndRender() {
        const dayData = rawData.filter(item => item.day === selectedDay);
        let filtered = [...dayData];

        const nameVal = filters.name.value.toLowerCase();
        if (nameVal) filtered = filtered.filter(item => item.name.toLowerCase().includes(nameVal));
        if (filters.status.value !== 'all') filtered = filtered.filter(item => item.status === filters.status.value);
        
        const progVal = filters.progress.value;
        if (progVal !== 'all') {
            if (progVal === '100') filtered = filtered.filter(i => i.progress === 100);
            else if (progVal === '0') filtered = filtered.filter(i => i.progress === 0);
            else if (progVal === '50-99') filtered = filtered.filter(i => i.progress >= 50 && i.progress < 100);
            else if (progVal === '0-49') filtered = filtered.filter(i => i.progress > 0 && i.progress < 50);
        }

        const visitVal = filters.visits.value;
        if (visitVal !== 'all') {
            if (visitVal === 'high') filtered = filtered.filter(i => i.visitsTotal > 10);
            else if (visitVal === 'medium') filtered = filtered.filter(i => i.visitsTotal >= 5 && i.visitsTotal <= 10);
            else if (visitVal === 'low') filtered = filtered.filter(i => i.visitsTotal < 5);
        }

        filtered.sort((a, b) => sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

        const sortCheckinVal = filters.sortCheckin.value;
        if (sortCheckinVal) {
            filtered.sort((a, b) => {
                const timeA = a.checkin ? parseInt(a.checkin.replace(':', '')) : (sortCheckinVal === 'recent' ? -1 : 9999);
                const timeB = b.checkin ? parseInt(b.checkin.replace(':', '')) : (sortCheckinVal === 'recent' ? -1 : 9999);
                return sortCheckinVal === 'recent' ? timeB - timeA : timeA - timeB;
            });
        }
        renderTable(filtered, dayData.length);
    }

    function renderTable(data, totalForDay) {
        tableBody.innerHTML = '';
        const counterElem = document.getElementById('resultsCount');
        counterElem.innerHTML = `Mostrando <strong>${data.length}</strong> de <strong>${totalForDay}</strong> resultados`;

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="empty-state"><i class="fa-solid fa-map-location-dot"></i><h4>Nenhuma rota encontrada</h4><p>Ajuste os filtros ou troque o dia.</p></td></tr>`;
            return;
        }

        data.forEach(item => {
            const initials = item.name.match(/\b\w/g) || [];
            const avatarTxt = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
            const colors = getAvatarColor(item.name);
            const statusInfo = getStatusLabel(item.status);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="promoter-cell">
                    <div class="activity-avatar small" style="background: ${colors.bg}; color: ${colors.tx};">${avatarTxt}</div> 
                    <div><span class="fw-500">${item.name}</span><span class="sub-text">${item.route}</span></div>
                </td>
                <td><span class="status-badge ${statusInfo.class}">${statusInfo.label}</span></td>
                <td><div class="progress-bar-container"><div class="progress-bar" style="width: ${item.progress}%; background-color: ${statusInfo.color};"></div></div><span class="progress-text">${item.progress}%</span></td>
                <td>${item.visitsReal} / ${item.visitsTotal}</td>
                <td>${item.checkin || '--:--'}</td>
                <td class="action-cell"><button class="btn-icon-small" title="Ver Detalhes"><i class="fa-solid fa-eye"></i></button><button class="btn-icon-small" title="Ver Mapa"><i class="fa-solid fa-map-marked-alt"></i></button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    filters.sortNameBtn.addEventListener('click', () => {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        filters.sortNameBtn.innerHTML = sortDirection === 'asc' ? '<i class="fa-solid fa-sort-alpha-down"></i>' : '<i class="fa-solid fa-sort-alpha-up"></i>';
        applyFiltersAndRender();
    });

    Object.values(filters).forEach(el => {
        if(el && el.tagName !== 'BUTTON') {
            el.addEventListener('change', applyFiltersAndRender);
            if(el.tagName === 'INPUT') el.addEventListener('keyup', applyFiltersAndRender);
        }
    });

    filters.clearBtn.addEventListener('click', () => {
        filters.name.value = '';
        filters.status.value = 'all';
        filters.progress.value = 'all';
        filters.visits.value = 'all';
        filters.sortCheckin.value = '';
        sortDirection = 'asc';
        filters.sortNameBtn.innerHTML = '<i class="fa-solid fa-sort"></i>';
        applyFiltersAndRender();
    });

    // ==========================================
    // --- 2. LÓGICA DO MODAL (3 ETAPAS) ---
    // ==========================================
    
    const modal = document.getElementById('createRouteModal');
    const btnOpenModal = document.querySelector('.header-actions .btn-primary'); 
    
    // Botões Navegação
    const btnCancel = document.getElementById('btnCancel');
    const btnNext = document.getElementById('btnNext');
    const btnBack = document.getElementById('btnBack');
    const btnSave = document.getElementById('btnSave');

    // Steps
    const step1Content = document.getElementById('step1-content');
    const step2Content = document.getElementById('step2-content');
    const step3Content = document.getElementById('step3-content');
    
    const step1Indicator = document.getElementById('step1-indicator');
    const step2Indicator = document.getElementById('step2-indicator');
    const step3Indicator = document.getElementById('step3-indicator');
    const stepTitle = document.getElementById('stepTitle');
    
    // Promotor Elements
    const promoterListEl = document.getElementById('promoterList');
    const searchPromoterInput = document.getElementById('searchPromoter');
    const selectedPromoterInput = document.getElementById('selectedPromoterId');

    // Variáveis Globais do Modal
    let currentStep = 1;
    let map = null;
    let routingControl = null;
    let mapMarkers = []; 
    let selectedRouteIds = []; 

    // Dados Mock Modal
    const promotersData = [
        { id: 1, name: 'Marcos Costa', role: 'Promotor Jr', initials: 'MC' },
        { id: 2, name: 'Luana B.', role: 'Promotor Pleno', initials: 'LB' },
        { id: 3, name: 'Andreza Silva', role: 'Promotor Sr', initials: 'AS' },
        { id: 4, name: 'João Paulo', role: 'Promotor Jr', initials: 'JP' },
        { id: 5, name: 'Carla Dias', role: 'Repositor', initials: 'CD' },
        { id: 6, name: 'Roberto Firmino', role: 'Promotor Pleno', initials: 'RF' }
    ];

    const pdvCoordinates = {
        'pdv1': { lat: -20.3193, lng: -40.3377, title: 'Supermercado Central' },
        'pdv2': { lat: -20.3222, lng: -40.3399, title: 'Mercadinho da Esquina' },
        'pdv3': { lat: -20.3478, lng: -40.2945, title: 'Hiper Extra' }, 
        'pdv4': { lat: -20.2912, lng: -40.3122, title: 'Atacadão do Povo' }
    };

    // --- FUNÇÕES DE PROMOTOR ---
    function renderPromoters(filter = '') {
        promoterListEl.innerHTML = '';
        const filtered = promotersData.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

        if(filtered.length === 0) {
            promoterListEl.innerHTML = '<div style="padding:10px; text-align:center; color:#94a3b8; font-size:0.8rem;">Nenhum promotor encontrado.</div>';
            return;
        }

        filtered.forEach(p => {
            const div = document.createElement('div');
            div.className = `promoter-option ${selectedPromoterInput.value == p.id ? 'selected' : ''}`;
            div.innerHTML = `
                <div class="promoter-avatar-small">${p.initials}</div>
                <div class="promoter-info"><strong>${p.name}</strong><span>${p.role}</span></div>
            `;
            div.addEventListener('click', () => selectPromoter(p.id, div));
            promoterListEl.appendChild(div);
        });
    }

    function selectPromoter(id, element) {
        selectedPromoterInput.value = id;
        document.querySelectorAll('.promoter-option').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
    }

    searchPromoterInput.addEventListener('keyup', (e) => renderPromoters(e.target.value));

    // --- FUNÇÕES DE CONTROLE DO MODAL ---
    function toggleModal(show) {
        if (show) {
            modal.classList.remove('hidden');
            resetModal();
            renderPromoters(''); 
            
            // Inicializa mapa (necessário mesmo que não mostre rotas ainda)
            setTimeout(() => {
                if (!map) initMap();
                map.invalidateSize();
            }, 200);

        } else {
            modal.classList.add('hidden');
        }
    }

    function resetModal() {
        currentStep = 1;
        updateStepUI();
        
        // Limpa campos
        selectedPromoterInput.value = "";
        document.getElementById('inputDate').value = "";
        searchPromoterInput.value = "";
        document.querySelectorAll('.pdv-list input[type="checkbox"]').forEach(cb => cb.checked = false);
        
        // Limpa Dados
        selectedRouteIds = [];
        renderSequenceList();
        if(map) refreshMap(); 
    }

    function updateStepUI() {
        // 1. Reseta tudo
        step1Content.classList.remove('active');
        step2Content.classList.remove('active');
        step3Content.classList.remove('active');
        
        step1Indicator.classList.remove('active');
        step2Indicator.classList.remove('active');
        step3Indicator.classList.remove('active');

        btnBack.classList.remove('hidden');
        btnNext.classList.remove('hidden');
        btnSave.classList.add('hidden');

        // 2. Ativa a etapa certa
        if (currentStep === 1) {
            step1Content.classList.add('active');
            step1Indicator.classList.add('active');
            btnBack.classList.add('hidden'); 
            stepTitle.innerText = "Selecione o Promotor e a Data";
        
        } else if (currentStep === 2) {
            step2Content.classList.add('active');
            step1Indicator.classList.add('active');
            step2Indicator.classList.add('active');
            stepTitle.innerText = "Selecione os Pontos de Venda";
            
            // Hack para garantir mapa renderizado se necessário
            setTimeout(() => { if(map) map.invalidateSize(); }, 100);

        } else if (currentStep === 3) {
            step3Content.classList.add('active');
            step1Indicator.classList.add('active');
            step2Indicator.classList.add('active');
            step3Indicator.classList.add('active');
            
            btnNext.classList.add('hidden'); // Sai Próximo
            btnSave.classList.remove('hidden'); // Entra Salvar
            stepTitle.innerText = "Defina a Ordem de Visita";
            
            // Renderiza ordem e mapa
            renderSequenceList();
            refreshMap(); 
            setTimeout(() => { if(map) map.invalidateSize(); }, 100);
        }
    }

    // --- NAVEGAÇÃO ENTRE ETAPAS ---

    btnNext.addEventListener('click', () => {
        if (currentStep === 1) {
            // Validação Etapa 1
            if (!selectedPromoterInput.value) { alert("Por favor, selecione um promotor."); return; }
            if (!document.getElementById('inputDate').value) { alert("Por favor, selecione a data."); return; }
            currentStep = 2;
        
        } else if (currentStep === 2) {
            // Validação Etapa 2
            if (selectedRouteIds.length === 0) { alert("Selecione pelo menos um Ponto de Venda."); return; }
            currentStep = 3;
        }
        updateStepUI();
    });

    btnBack.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepUI();
        }
    });

    btnSave.addEventListener('click', () => {
        if(selectedRouteIds.length === 0) { alert("Erro: Roteiro vazio."); return; }
        
        alert(`Roteiro salvo com sucesso para o dia ${document.getElementById('inputDate').value}!`);
        toggleModal(false);
    });

    // --- FUNÇÕES DO MAPA E DRAG & DROP ---

    const sequenceListEl = document.getElementById('routeSequenceList');
    // Inicializa SortableJS
    new Sortable(sequenceListEl, {
        animation: 150,
        ghostClass: 'bg-blue-50',
        onEnd: function () {
            updateArrayFromDOM();
            refreshMap();
        }
    });

    function initMap() {
        if (map) return;
        map = L.map('mapRoute').setView([-20.3155, -40.3128], 12);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    }

    function togglePdvSelection(pdvId, isChecked) {
        if (isChecked) {
            if (!selectedRouteIds.includes(pdvId)) selectedRouteIds.push(pdvId);
        } else {
            selectedRouteIds = selectedRouteIds.filter(id => id !== pdvId);
        }
        // Nota: na etapa 2 só atualizamos o array, não desenhamos a lista ainda
    }

    function renderSequenceList() {
        sequenceListEl.innerHTML = '';
        if (selectedRouteIds.length === 0) {
            sequenceListEl.innerHTML = '<li class="empty-sequence">Nenhum PDV selecionado</li>';
            return;
        }

        selectedRouteIds.forEach((id, index) => {
            const data = pdvCoordinates[id];
            const li = document.createElement('li');
            li.className = 'sequence-item';
            li.setAttribute('data-id', id);
            li.innerHTML = `
                <div class="seq-number">${index + 1}</div>
                <div class="seq-info">${data.title}</div>
                <button class="btn-remove-item" onclick="removePdv('${id}')"><i class="fa-solid fa-times"></i></button>
            `;
            sequenceListEl.appendChild(li);
        });
    }

    window.removePdv = function(id) {
        const checkbox = document.getElementById(id);
        if(checkbox) checkbox.checked = false;
        togglePdvSelection(id, false);
        // Se estiver na etapa 3, atualiza visual
        if(currentStep === 3) {
            renderSequenceList();
            refreshMap();
        }
    }

    function updateArrayFromDOM() {
        const newOrder = [];
        document.querySelectorAll('.sequence-item').forEach(item => {
            newOrder.push(item.getAttribute('data-id'));
        });
        selectedRouteIds = newOrder;
        renderSequenceList(); 
    }

    function refreshMap() {
        if (!map) return;

        // Limpa tudo
        mapMarkers.forEach(m => map.removeLayer(m));
        mapMarkers = [];
        if (routingControl) {
            map.removeControl(routingControl);
            routingControl = null;
        }

        const waypoints = [];

        selectedRouteIds.forEach((id, index) => {
            const coords = pdvCoordinates[id];
            if (!coords) return;

            const numberIcon = L.divIcon({
                className: 'custom-marker-icon',
                html: `<div class="marker-pin"></div><span class="marker-number">${index + 1}</span>`,
                iconSize: [30, 42],
                iconAnchor: [15, 42],
                popupAnchor: [0, -35]
            });

            const marker = L.marker([coords.lat, coords.lng], { icon: numberIcon })
                .bindPopup(`<b>${index + 1}. ${coords.title}</b>`)
                .addTo(map);
            
            mapMarkers.push(marker);
            waypoints.push(L.latLng(coords.lat, coords.lng));
        });

        if (waypoints.length >= 2) {
            routingControl = L.Routing.control({
                waypoints: waypoints,
                routeWhileDragging: false,
                serviceUrl: 'https://router.project-osrm.org/route/v1',
                show: false,
                addWaypoints: false,
                createMarker: function() { return null; },
                lineOptions: { styles: [{color: '#2563eb', opacity: 0.7, weight: 5}] }
            }).addTo(map);
        }

        if (waypoints.length > 0) {
            const group = new L.featureGroup(mapMarkers);
            map.fitBounds(group.getBounds(), { padding: [50, 50] });
        }
    }

    // --- EVENT LISTENERS GERAIS ---

    btnOpenModal.addEventListener('click', () => toggleModal(true));
    btnCancel.addEventListener('click', () => toggleModal(false));
    modal.addEventListener('click', (e) => { if (e.target === modal) toggleModal(false); });

    document.querySelectorAll('.pdv-list input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', (e) => togglePdvSelection(e.target.id, e.target.checked));
    });

    // Inicia Dashboard
    generateWeekDays(getMonday(currentWeekStart));
    applyFiltersAndRender();
});