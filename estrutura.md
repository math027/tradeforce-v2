tradeforce/
│
├── public/                               # Tudo que é público (frontend)
│   ├── index.html                       # Landing / escolha de acesso
│   │
│   ├── shared/                          # 🔁 COMPARTILHADO ENTRE OS 2
│   │   ├── partials/
│   │   │   ├── footer.html
│   │   │   └── modals.html
│   │   │
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   │   ├── logo.svg
│   │   │   │   ├── avatars/
│   │   │   │   ├── backgrounds/
│   │   │   │   └── placeholders/
│   │   │   │
│   │   │   ├── icons/
│   │   │   │   ├── dashboard.svg
│   │   │   │   ├── routes.svg
│   │   │   │   └── reports.svg
│   │   │   │
│   │   │   └── fonts/
│   │   │       └── inter/
│   │   │
│   │   ├── css/
│   │   │   ├── base/
│   │   │   │   ├── reset.css
│   │   │   │   ├── variables.css        # cores, spacing, radius, shadows
│   │   │   │   └── typography.css
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── buttons.css
│   │   │   │   ├── cards.css
│   │   │   │   ├── tables.css
│   │   │   │   ├── charts.css
│   │   │   │   ├── badges.css
│   │   │   │   └── modals.css
│   │   │   │
│   │   │   └── themes/
│   │   │       ├── gestor.css
│   │   │       └── promotor.css
│   │   │
│   │   ├── js/
│   │   │   ├── core/
│   │   │   │   ├── config.js            # URLs, env, configs globais
│   │   │   │   ├── api.js               # fetch wrapper
│   │   │   │   ├── auth.js              # login, token, role
│   │   │   │   ├── layout.js            # load de partials
│   │   │   │   └── state.js
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── visits.service.js
│   │   │   │   ├── routes.service.js
│   │   │   │   ├── reports.service.js
│   │   │   │   └── users.service.js
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── formatters.js
│   │   │       ├── validators.js
│   │   │       ├── dates.js
│   │   │       └── debounce.js
│   │   │
│   │   └── data/
│   │       └── mock/
│   │           ├── dashboard.json
│   │           ├── routes.json
│   │           └── reports.json
│
│   ├── gestor/                          # 🧠 APLICAÇÃO DO GESTOR
│   │   ├── pages/
│   │   │   ├── dashboard.html
│   │   │   ├── routes.html              # Roteiros e Visitas
│   │   │   ├── points-of-sale.html      # Pontos de Venda
│   │   │   ├── collaborators.html       # Colaboradores
│   │   │   ├── surveys.html             # Pesquisas
│   │   │   ├── reports.html             # Relatórios
│   │   │   └── settings.html            # Configurações
│   │   │
│   │   ├── partials/
│   │   │   ├── sidebar.html
│   │   │   └── header.html
│   │   │
│   │   ├── css/
│   │   │   ├── layout/
│   │   │   │   ├── sidebar.css
│   │   │   │   ├── header.css
│   │   │   │   └── grid.css
│   │   │   │
│   │   │   └── pages/
│   │   │       ├── dashboard.css
│   │   │       ├── routes.css
│   │   │       ├── reports.css
│   │   │       └── settings.css
│   │   │
│   │   └── js/
│   │       ├── components/
│   │       │   ├── sidebar.js
│   │       │   ├── header.js
│   │       │   ├── cards.js
│   │       │   ├── charts.js
│   │       │   └── tables.js
│   │       │
│   │       └── pages/
│   │           ├── dashboard.js
│   │           ├── routes.js
│   │           ├── reports.js
│   │           └── settings.js
│
│   ├── promotor/                        # 📱 APLICAÇÃO DO PROMOTOR
│   │   ├── pages/
│   │   │   ├── dashboard.html
│   │   │   ├── my-routes.html
│   │   │   ├── check-in.html
│   │   │   ├── surveys.html
│   │   │   └── profile.html
│   │   │
│   │   ├── partials/
│   │   │   ├── sidebar.html
│   │   │   └── header.html
│   │   │
│   │   ├── css/
│   │   │   ├── layout/
│   │   │   │   ├── header.css
│   │   │   │   └── mobile-nav.css
│   │   │   │
│   │   │   └── pages/
│   │   │       ├── dashboard.css
│   │   │       ├── my-routes.css
│   │   │       ├── check-in.css
│   │   │       └── profile.css
│   │   │
│   │   └── js/
│   │       ├── components/
│   │       │   ├── header.js
│   │       │   └── mobile-nav.js
│   │       │
│   │       └── pages/
│   │           ├── dashboard.js
│   │           ├── my-routes.js
│   │           ├── check-in.js
│   │           └── profile.js
│
├── server/                              # Backend (Node.js futuramente)
│
└── README.md
