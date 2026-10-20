import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { UpdatePrompt } from '../../components/UpdatePrompt';

const sw = vi.hoisted(() => ({
  offlineReady: false,
  needRefresh: false,
  setOfflineReady: vi.fn(),
  setNeedRefresh: vi.fn(),
  updateServiceWorker: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    offlineReady: [sw.offlineReady, sw.setOfflineReady],
    needRefresh: [sw.needRefresh, sw.setNeedRefresh],
    updateServiceWorker: sw.updateServiceWorker,
  }),
}));
beforeEach(() => {
  sw.offlineReady = false;
  sw.needRefresh = false;
  vi.clearAllMocks();
});
afterEach(cleanup);

describe('UpdatePrompt', () => {
  it('não mostra aviso quando não há evento', () => {
    const { container } = render(<UpdatePrompt />);
    expect(container).toBeEmptyDOMElement();
  });

  it('mostra e permite dispensar o aviso de pronto para offline', () => {
    sw.offlineReady = true;
    render(<UpdatePrompt />);
    expect(screen.getByText('App pronto para uso offline')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(sw.setOfflineReady).toHaveBeenCalledWith(false);
    expect(sw.updateServiceWorker).not.toHaveBeenCalled();
  });

  it('atualiza somente quando o usuário confirma', () => {
    sw.needRefresh = true;
    render(<UpdatePrompt />);
    expect(screen.getByText('Nova versão disponível')).toBeInTheDocument();
    expect(sw.updateServiceWorker).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }));
    expect(sw.updateServiceWorker).toHaveBeenCalledWith(true);
  });

  it('permite adiar a atualização sem recarregar', () => {
    sw.needRefresh = true;
    render(<UpdatePrompt />);
    fireEvent.click(screen.getByRole('button', { name: 'Depois' }));
    expect(sw.setNeedRefresh).toHaveBeenCalledWith(false);
    expect(sw.updateServiceWorker).not.toHaveBeenCalled();
  });
});
