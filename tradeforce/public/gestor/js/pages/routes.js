document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. DADOS (MOCK DATABASE) ---
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
        // 1. Pega dados do dia (Total disponível para este dia = Y)
        const dayData = rawData.filter(item => item.day === selectedDay);
        
        let filtered = [...dayData]; // Clona para filtrar (X)

        // Filtros
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

        // Ordenação
        filtered.sort((a, b) => {
            return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });

        const sortCheckinVal = filters.sortCheckin.value;
        if (sortCheckinVal) {
            filtered.sort((a, b) => {
                const timeA = a.checkin ? parseInt(a.checkin.replace(':', '')) : (sortCheckinVal === 'recent' ? -1 : 9999);
                const timeB = b.checkin ? parseInt(b.checkin.replace(':', '')) : (sortCheckinVal === 'recent' ? -1 : 9999);
                return sortCheckinVal === 'recent' ? timeB - timeA : timeA - timeB;
            });
        }

        // Renderiza passando: (DadosFiltrados, TotalDoDia)
        renderTable(filtered, dayData.length);
    }

    function renderTable(data, totalForDay) {
        tableBody.innerHTML = '';
        
        // Atualiza contador: Mostrando X de Y resultados
        const counterElem = document.getElementById('resultsCount');
        counterElem.innerHTML = `Mostrando <strong>${data.length}</strong> de <strong>${totalForDay}</strong> resultados`;

        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fa-solid fa-map-location-dot"></i>
                        <h4>Nenhuma rota encontrada</h4>
                        <p>Ajuste os filtros ou troque o dia.</p>
                    </td>
                </tr>`;
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
                    <div>
                        <span class="fw-500">${item.name}</span>
                        <span class="sub-text">${item.route}</span>
                    </div>
                </td>
                <td><span class="status-badge ${statusInfo.class}">${statusInfo.label}</span></td>
                <td>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${item.progress}%; background-color: ${statusInfo.color};"></div>
                    </div>
                    <span class="progress-text">${item.progress}%</span>
                </td>
                <td>${item.visitsReal} / ${item.visitsTotal}</td>
                <td>${item.checkin || '--:--'}</td>
                <td class="action-cell">
                    <button class="btn-icon-small" title="Ver Detalhes"><i class="fa-solid fa-eye"></i></button>
                    <button class="btn-icon-small" title="Ver Mapa"><i class="fa-solid fa-map-marked-alt"></i></button>
                </td>
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

    generateWeekDays(getMonday(currentWeekStart));
    applyFiltersAndRender();
});