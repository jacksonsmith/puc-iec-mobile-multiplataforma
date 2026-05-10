/**
 * Validator — Atividade 5 — Integração GraphQL + OAuth/PKCE (Mobile Multi).
 *
 * Critérios (10 pts total):
 *   1. Apollo Client configurado (InMemoryCache + ApolloProvider)        — 3pts
 *   2. Queries/Mutations GraphQL definidas                                — 2pts
 *   3. OIDC com PKCE (react-native-app-auth ou expo-auth-session)         — 2pts
 *   4. Secure storage (Keychain/Keystore via react-native-keychain)       — 2pts
 *   5. README cobrindo 3 itens OWASP Mobile Top 10 mitigados              — 1pt
 */

import { writeFileSync } from 'node:fs';
import {
  type GradeCriterion,
  type GradeResult,
  buildBreakdowns,
  computeScore,
  passThreshold,
} from '../compute-score.js';
import { parseArgs, findFiles, fileMatchesAny, findReadme, readFileSafe } from '../utils.js';

async function main() {
  const args = parseArgs();
  const criteria: GradeCriterion[] = [];
  const codeFiles = findFiles(args.entrega, ['.ts', '.tsx', '.js', '.jsx']);

  // Critério 1: Apollo Client
  const hasApollo = fileMatchesAny(codeFiles, [
    /from\s+['"]@apollo\/client['"]/,
    /new\s+ApolloClient/,
    /ApolloProvider/,
    /InMemoryCache/,
  ]);
  criteria.push({
    id: 'apollo',
    description: 'Apollo Client configurado (InMemoryCache + ApolloProvider)',
    weight: 3,
    earned: hasApollo ? 3 : 0,
    publicNote: hasApollo ? 'Apollo Client detectado' : 'Não encontrei imports de @apollo/client',
  });

  // Critério 2: queries/mutations
  const hasGqlOps = fileMatchesAny(codeFiles, [
    /gql\s*`/,
    /useQuery\s*\(/,
    /useMutation\s*\(/,
    /query\s+\w+/,
  ]);
  const gqlFiles = findFiles(args.entrega, ['.gql', '.graphql']);
  const hasGqlSchema = gqlFiles.length > 0;
  criteria.push({
    id: 'gql-ops',
    description: 'Queries/Mutations GraphQL definidas',
    weight: 2,
    earned: hasGqlOps || hasGqlSchema ? 2 : 0,
    publicNote: hasGqlOps ? 'gql/useQuery/useMutation detectado' : hasGqlSchema ? `${gqlFiles.length} arquivo(s) .gql/.graphql` : 'Nenhuma operação GraphQL encontrada',
  });

  // Critério 3: OIDC + PKCE
  const hasAuth = fileMatchesAny(codeFiles, [
    /from\s+['"]react-native-app-auth['"]/,
    /from\s+['"]expo-auth-session['"]/,
    /usePKCE\s*:\s*true/,
    /authorize\s*\(\s*config/,
  ]);
  criteria.push({
    id: 'oidc-pkce',
    description: 'OIDC com PKCE habilitado',
    weight: 2,
    earned: hasAuth ? 2 : 0,
    publicNote: hasAuth ? 'Lib auth detectada (react-native-app-auth ou expo-auth-session)' : 'Não encontrei configuração OIDC',
  });

  // Critério 4: Secure storage
  const hasSecureStorage = fileMatchesAny(codeFiles, [
    /from\s+['"]react-native-keychain['"]/,
    /from\s+['"]expo-secure-store['"]/,
    /from\s+['"]@react-native-async-storage\/encrypted['"]/,
    /SecureStore\.|Keychain\./,
  ]);
  criteria.push({
    id: 'secure-storage',
    description: 'Secure storage (Keychain/Keystore — não AsyncStorage padrão)',
    weight: 2,
    earned: hasSecureStorage ? 2 : 0,
    publicNote: hasSecureStorage ? 'Secure storage detectado' : 'Não encontrei react-native-keychain ou expo-secure-store',
  });

  // Critério 5: README com OWASP
  const readme = findReadme(args.entrega);
  const readmeContent = readme ? readFileSafe(readme) ?? '' : '';
  const owaspItems = [/M\d/, /OWASP/i, /Mobile Top 10/i];
  const hasOwasp = readmeContent && owaspItems.some((p) => p.test(readmeContent));
  criteria.push({
    id: 'owasp-readme',
    description: 'README cobrindo OWASP Mobile Top 10 (3 itens mitigados)',
    weight: 1,
    earned: hasOwasp ? 1 : readme ? 0.5 : 0,
    publicNote: hasOwasp ? 'OWASP mencionado no README' : readme ? 'README presente sem menção a OWASP' : 'README ausente',
  });

  const { total, score } = computeScore(criteria);
  const minimo = passThreshold(total, 60);
  const { publicBreakdown, privateBreakdown } = buildBreakdowns(criteria);

  const result: GradeResult = {
    atividade: 'MOBILE-A5-GraphQL-Auth',
    total,
    score: +score.toFixed(2),
    minimo,
    pass: score >= minimo,
    criteria,
    publicBreakdown,
    privateBreakdown,
    metadata: {
      studentLogin: args.studentLogin,
      entregaPath: args.entrega,
      timestamp: new Date().toISOString(),
      commitSha: args.commitSha,
    },
  };

  writeFileSync(args.output, JSON.stringify(result, null, 2));
  console.log(`Grade: ${result.score}/${result.total} (min ${result.minimo}) — ${result.pass ? 'PASS' : 'FAIL'}`);
  process.exit(result.pass ? 0 : 1);
}

main().catch((e) => {
  console.error('Validator error:', e);
  process.exit(2);
});
