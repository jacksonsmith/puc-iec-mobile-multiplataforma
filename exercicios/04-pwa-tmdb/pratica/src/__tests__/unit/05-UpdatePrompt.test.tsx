import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { UpdatePrompt } from '../../components/UpdatePrompt';

const sw = vi.hoisted(() => ({
  offlineReady: false, needRefresh: false,
  setOfflineReady: vi.fn(), setNeedRefresh: vi.fn(), updateServiceWorker: vi.fn(),
}));
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    offlineReady: [sw.offlineReady, sw.setOfflineReady],
    needRefresh: [sw.needRefresh, sw.setNeedRefresh],
    updateServiceWorker: sw.updateServiceWorker,
  }),
}));
beforeEach(() => {
  vi.clearAllMocks();
  sw.offlineReady = false;
  sw.needRefresh = false;
});
afterEach(cleanup);

it('não mostra aviso quando não há evento do service worker', () => {
  const { container } = render(<UpdatePrompt />);
  expect(container).toBeEmptyDOMElement();
});
it('informa disponibilidade offline e permite fechar', () => {
  sw.offlineReady = true;
  render(<UpdatePrompt />);
  expect(screen.getByText('App pronto para uso offline')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
  expect(sw.setOfflineReady).toHaveBeenCalledWith(false);
});
it('só ativa nova versão quando o usuário escolhe Atualizar', () => {
  sw.needRefresh = true;
  render(<UpdatePrompt />);
  expect(screen.getByText('Nova versão disponível')).toBeVisible();
  expect(sw.updateServiceWorker).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }));
  expect(sw.updateServiceWorker).toHaveBeenCalledWith(true);
});
it('Depois dispensa o aviso sem atualizar', () => {
  sw.needRefresh = true;
  render(<UpdatePrompt />);
  fireEvent.click(screen.getByRole('button', { name: 'Depois' }));
  expect(sw.setNeedRefresh).toHaveBeenCalledWith(false);
  expect(sw.updateServiceWorker).not.toHaveBeenCalled();
});
