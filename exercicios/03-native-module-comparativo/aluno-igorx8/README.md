# Atividade 3 — Native Module + comparativo

Aluno: Igorx8

## Entrega

Esta pasta implementa um exemplo de TurboModule chamado `NativeDeviceIntegrity`.
O modulo expoe informacoes simples do dispositivo e um snapshot de integridade:

- `getDeviceName(): string`
- `getOsVersion(): string`
- `isRunningOnEmulator(): boolean`
- `getIntegritySnapshot(): Promise<DeviceIntegritySnapshot>`

## Estrutura

```text
aluno-igorx8/
├── specs/
│   └── NativeDeviceIntegrity.ts
├── android/
│   ├── NativeDeviceIntegrityModule.kt
│   └── NativeDeviceIntegrityPackage.kt
├── ios/
│   ├── NativeDeviceIntegrity.swift
│   └── NativeDeviceIntegrity.mm
├── relatorio.md
└── README.md
```

## Como integrar em um app React Native

1. Copiar `specs/NativeDeviceIntegrity.ts` para a pasta de specs do app.
2. Configurar Codegen no `package.json` do app apontando para a spec.
3. Registrar `NativeDeviceIntegrityPackage` no Android, quando o autolinking nao for usado.
4. Incluir os arquivos Swift/Objective-C++ no target iOS.
5. Rodar Codegen e compilar Android/iOS com a New Architecture habilitada.

Exemplo de consumo:

```ts
import NativeDeviceIntegrity from './specs/NativeDeviceIntegrity';

const snapshot = await NativeDeviceIntegrity.getIntegritySnapshot();
console.log(snapshot.platform, snapshot.isEmulator);
```

## Validacao local

O autograder da atividade verifica a estrutura da entrega:

```bash
npx --yes tsx grader/lib/validators/native-module.ts \
  --entrega exercicios/03-native-module-comparativo/aluno-igorx8 \
  --output /tmp/grade-a3.json \
  --student-login Igorx8 \
  --commit-sha local
```

## Observacoes

- A spec usa `TurboModuleRegistry.getEnforcing`, evitando o padrao legado de bridge.
- Android foi implementado em Kotlin.
- iOS foi implementado em Swift, com arquivo `.mm` para exportacao para React Native.
- O comparativo entre React Native, Flutter, KMP e nativo esta em `relatorio.md`.
