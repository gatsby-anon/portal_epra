# PRODUCT.md - Visão do Produto EPRA Portal

## 1. Visão Geral (Product Vision)

O **EPRA Portal v5.0** (Engenharia de Projetos e Robótica Aplicada) é um **Research Management System (RMS)** desenvolvido para o laboratório de robótica da Universidade Federal do Ceará - Campus Russas.

### Missão do Produto

> Democratizar a tecnologia de ponta no coração de Russas, transformando linhas de código em movimento através da engenharia prática com Arduino, C++ e Python.

### Valores Fundamentais

| Valor | Descrição |
|-------|-----------|
| **Inovação** | Tornar a engenharia complexa acessível |
| **Educação** | Proporcionar conhecimento em programação e robótica |
| **Comunidade** | Romper barreiras e incluir a comunidade local |
| **Excelência** | Manter padrão técnico de alta qualidade |

---

## 2. Personas (User Personas)

### 2.1 Professor Orientador (ORIENTADOR)

| Atributo | Descrição |
|----------|-----------|
| **Nome** | Dr. Ricardo Vance |
| **Perfil** | Professor titular da UFC Russas, coordinator do EPRA |
| **Objetivo** | Gerenciar projetos, orientar alunos e moderar conteúdo |
| **Dor** | Falta de ferramentas centralizadas para gestão |
| **Contexto RBAC** | `ORIENTADOR` - Acesso total ao sistema |

**Permissões:**
- [x] Visualizar Identity Core (Perfil)
- [x] Acessar Content Manager
- [x] Moderir depósitos e depoimentos
- [x] Gerenciar Controle de Acesso
- [x] Override total de protocolos

---

### 2.2 Aluno Interno (ALUNO_INTERNO)

| Atributo | Descrição |
|----------|-----------|
| **Nome** | Ana Silva (CODENAME: SYS_ADM_ROOT) |
| **Perfil** | Aluna do curso de Engenharia, membra ativa do EPRA |
| **Objetivo** | Acessar conteúdos, acompanhar projetos e desenvolver habilidades |
| **Dor** | Dificuldade em encontrar materiais centralizados |
| **Contexto RBAC** | `ALUNO_INTERNO` - Acesso intermediário |

**Permissões:**
- [x] Visualizar Identity Core (Perfil)
- [x] Acessar Content Manager
- [x] Moderar depoimentos (com aprovação)
- [ ] Controle de Acesso
- [ ] Telemetria Log Terminal

---

### 2.3 Aluno Externo (USUARIO_EXTERNO)

| Atributo | Descrição |
|----------|-----------|
| **Nome** | Carlos Oliveira (CODENAME: OPER_8823) |
| **Perfil** | Estudante de escola pública, interesse em robótica |
| **Objetivo** | Explorar cursos, ver tutoriais e entender o EPRA |
| **Dor** | Sem acesso ao laboratório, busca informações online |
| **Contexto RBAC** | `USUARIO_EXTERNO` - Acesso apenas público |

**Permissões:**
- [x] Cadastro na plataforma (UC1) e confirmação de e-mail
- [x] Submissão de desafios
- [ ] Identity Core (Perfil completo)
- [ ] Content Manager
- [ ] Controle de Acesso
- [x] Landing Page completa
- [x] Formulário de inscrição

---

## 3. KPIs de Impacto Social

### 3.1 Métricas Atuais (Dashboard)

```json
{
  "stats": [
    { "label": "TOTAL_ALUNOS", "value": "847", "progress": 75 },
    { "label": "PARCERIAS_ESCOLAS", "value": "23", "progress": 50 },
    { "label": "LAB_HOURS_LOGGED", "value": "3.240", "progress": 83 },
    { "label": "PROJECTS_DEPLOYED", "value": "156", "progress": 66 }
  ]
}
```

### 3.2 KPIs Planejados

| KPI | Meta 2026 | Status |
|-----|-----------|--------|
| Total Alunos | 1.000+ | Em progresso |
| Escolas Parceiras | 30+ | Em progresso |
| Projetos Implantados | 200+ | Em progresso |
| Horas de Laboratório | 5.000+ | Em progresso |

---

## 4. Funcionalidades do Produto

### 4.1 Landing Page (10 Seções)

| # | Seção | Descrição |
|---|-------|-----------|
| 1 | **Header** | Navegação com autenticação |
| 2 | **Hero** | Terminal principal com CTA |
| 3 | **Metrics** | Dashboard de impacto social |
| 4 | **Mission Log** | História da UFC Russas |
| 5 | **Module Grid** | Nodos de aprendizado |
| 6 | **Challenge** | Protocolo de Alarme |
| 7 | **Testimonials** | Feedback dos terminais |
| 8 | **Courses** | Protocolos Ativos |
| 9 | **Portfolio** | Showcase de Hardware |
| 10 | **Recruitment / Footer** | Alistamento e rodapé |

### 4.2 Painel Administrativo

| Módulo | Descrição | Acesso |
|--------|-----------|--------|
| **Identity Core** | Perfil do usuário e segurança | ALUNO_INTERNO+ |
| **Content Manager** | CRUD de Cursos, Desafios, Tutoriais | ALUNO_INTERNO+ |
| **Access Control** | Matriz de permissões | ORIENTADOR |
| **Log Terminal** | Telemetria e alertas | ORIENTADOR |

---

## 5. Roadmap de Produto

### Fase Atual: v3.1.0 (Em Andamento)
- [ ] Dashboard administrativo completo
- [ ] Sistema de autenticação mockado
- [ ] Landing Page com 10 seções

### Fase v5.0 (Planejada)
- [ ] Monorepo Turborepo
- [ ] Banco de dados PostgreSQL
- [ ] NextAuth com JWT
- [ ] Component Library compartilhada

---

## 6. Regras de Ouro para IA

> **ATENÇÃO: Regras que a IA NUNCA deve violar ao editar este documento**

1. **Personas** devem corresponder exatamente ao RBAC definido em `AuthContext`
2. **KPIs** devem refletir dados reais do `content.json` e `dashboard-content.json`
3. **Funcionalidades** devem listar TODAS as 10 seções da Landing Page
4. **Versão atual** é `3.0.42` do sistema, NÃO `v5.0`
5. **Não inventar** métricas ou personas não existentes no código

---

## 7. Referências

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Estrutura técnica
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Tokens e estilos
- [UX.md](./UX.md) - Jornada do usuário
- [USABILITY.md](./USABILITY.md) - Acessibilidade