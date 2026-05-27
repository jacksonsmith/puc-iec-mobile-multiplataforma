# Guia passo a passo — Atividade 2 (Mini-app RN)

> Manual prático. ~2h se seguir o roteiro.

---

## Pré-requisitos (vimos na aula 1)

- Node 20+ (`nvm use 22` se tiver)
- Editor: VS Code, Cursor, ou outro
- Browser pra testar (Chrome/Safari/Firefox)

```bash
node --version    # v20+ ou v22
```

## Passo 1 — Criar app Expo (5min)

```bash
npx create-expo-app@latest meu-app-atv2 --template blank-typescript
cd meu-app-atv2
npx expo start --web
```

Se abrir browser com "Open up App.tsx to start working on your app!" — pronto, ambiente OK.

## Passo 2 — Stack Navigator (15min)

Instalar deps:
```bash
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

Criar `src/navigation/RootStack.tsx`:

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';

export type RootStackParamList = {
  Home: undefined;
  Detail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

`src/screens/HomeScreen.tsx`:
```tsx
import { Button, View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home</Text>
      <Button title="Ir pro Detail" onPress={() => navigation.navigate('Detail', { id: '42' })} />
    </View>
  );
}
```

`src/screens/DetailScreen.tsx`:
```tsx
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Detail: id = {route.params.id}</Text>
    </View>
  );
}
```

Trocar `App.tsx`:
```tsx
import { RootStack } from './src/navigation/RootStack';

export default function App() {
  return <RootStack />;
}
```

Refresh — agora deve navegar Home → Detail.

## Passo 3 — Bottom Tabs (20min)

```bash
npx expo install @react-navigation/bottom-tabs
```

Reorganizar — tabs no topo, stack dentro de tab:

```tsx
// src/navigation/RootTabs.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack } from './HomeStack';
import SettingsScreen from '../screens/SettingsScreen';

const Tabs = createBottomTabNavigator();

export function RootTabs() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="HomeTab" component={HomeStack} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
}
```

```tsx
// src/navigation/HomeStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';

const Stack = createNativeStackNavigator();

export function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}
```

```tsx
// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { RootTabs } from './src/navigation/RootTabs';

export default function App() {
  return (
    <NavigationContainer>
      <RootTabs />
    </NavigationContainer>
  );
}
```

`SettingsScreen.tsx` simples:
```tsx
import { Text, View } from 'react-native';

export default function SettingsScreen() {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Settings</Text></View>;
}
```

## Passo 4 — Zustand store (~30min)

```bash
npm install zustand
```

**Opção A — Counter** (mais simples):

```tsx
// src/store/counterStore.ts
import { create } from 'zustand';

type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

**Sem `Provider`, sem `configureStore`.** Hook é o store — usa direto em qualquer componente.

`App.tsx` (mantém igual ao Passo 2 — sem Provider):
```tsx
import { NavigationContainer } from '@react-navigation/native';
import { RootTabs } from './src/navigation/RootTabs';

export default function App() {
  return (
    <NavigationContainer>
      <RootTabs />
    </NavigationContainer>
  );
}
```

`HomeScreen.tsx` — consumir store:
```tsx
import { Button, View, Text } from 'react-native';
import { useCounterStore } from '../store/counterStore';

export default function HomeScreen({ navigation }) {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
      <Text style={{ fontSize: 32 }}>{count}</Text>
      <Button title="+1" onPress={increment} />
      <Button title="-1" onPress={decrement} />
      <Button title="Reset" onPress={reset} />
      <Button title="Detail" onPress={() => navigation.navigate('Detail', { id: String(count) })} />
    </View>
  );
}
```

Refresh — counter funciona + passa pro Detail.

> 💡 **Por que sem Provider?** Zustand cria o store fora da árvore React (módulo singleton). Hook usa `useSyncExternalStore` por baixo dos panos pra inscrever só os componentes que leem. Re-render automático sem boilerplate.

## Passo 5 — README + screenshot (10min)

Copia `template-relatorio.md` desta pasta pra `README.md` no seu repo. Preenche.

Tirar screenshot da `HomeScreen` mostrando contador. Salvar como `screenshot-home.png` na raiz.

## Passo 6 — Entrega

Ver guia "Como entregar atividades pelo GitHub" no Canvas (módulo Início).

## Troubleshooting

| Problema | Solução |
|---|---|
| `Cannot find module 'zustand'` | Salvou `package.json`? Rode `npm install` de novo |
| `Module not found: react-native-screens` | `npx expo install react-native-screens` |
| Web não abre | Tentou `--web`? Algumas vezes precisa Ctrl+C e rodar de novo |
| TypeScript erro nas props | Confere que importou `NativeStackScreenProps` e tipo `RootStackParamList` |
| Store atualiza mas UI não re-renderiza | Você está chamando `useCounterStore.getState()` em vez do hook. Use `useCounterStore()` dentro do componente. |
| Multiple re-renders desnecessários | Use seletor: `const count = useCounterStore((s) => s.count)` em vez de destructuring completo |

## Dica: IA pra acelerar

Prompts úteis:

> "Configure React Navigation v7 bottom tabs + stack navigator no meu app Expo blank-typescript"

> "Crie store Zustand chamado useCounterStore com count + increment/decrement/reset. Sem Provider, sem configureStore. TypeScript tipado."

> "Como tipar params do Stack Navigator no TypeScript?"

⚠️ Valide cada bloco de código antes de colar — IA às vezes mistura versões antigas/novas.
