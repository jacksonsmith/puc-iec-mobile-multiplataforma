# Relatório Comparativo — Native Biometrics

## Caso de uso
App bancário precisa autenticar via biometria (Face ID / Touch ID / Fingerprint).

## Matriz comparativa

| Critério | RN | Flutter | KMP | Nativo puro |
|---------|----|---------|-----|-------------|
| Performance | 8 | 8 | 9 | 10 |
| Time-to-market | 9 | 8 | 7 | 5 |
| Talent pool | 9 | 7 | 5 | 8 |
| Acesso API nativo | 8 (via TurboModule) | 7 | 9 | 10 |

## Decisão
RN com TurboModule é viável e oferece melhor ROI para produto em escala.

## Referências
- Newman, S. (2021). *Building Microservices*. O'Reilly.
- Charland & Leroux (2011). *Mobile App Dev: Web vs Native*. CACM.
- Joorabchi et al. (2013). *Real Challenges in Mobile App Dev*. ESEM.
