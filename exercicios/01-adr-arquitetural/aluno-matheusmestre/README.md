# Atividade 1 — ADR: Stack mobile para logística/delivery

**Aluno:** Matheus Mestre Picerne  
**GitHub:** https://github.com/matheusmestre/puc-iec-mobile-multiplataforma 
**Disciplina:** Arquitetura Mobile Multiplataforma — PUC IEC 2026

## ADR

[ADR-0001-stack-mobile-logistica-delivery.md](./ADR-0001-stack-mobile-logistica-delivery.md)

## Contexto resumido

O ADR analisa a escolha de stack mobile para o app de motoristas de última milha da LogiTrack Entregas S.A., empresa com 50.000 motoristas ativos em expansão para 120.000. As forças determinantes do cenário são o requisito **offline-first** (40% das entregas sem cobertura de sinal), o **rastreio GPS contínuo em background** por até 12h/dia e a necessidade de desempenho em **dispositivos Android entry-level** (88% da frota). A decisão aponta para **Flutter**, que equilibra performance próxima ao nativo com reuso integral de codebase entre iOS e Android, aproveitando a expertise do time atual e cumprindo o prazo de 6 meses.
