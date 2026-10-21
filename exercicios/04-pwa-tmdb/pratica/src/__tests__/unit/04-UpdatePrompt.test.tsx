import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UpdatePrompt } from '../../components/UpdatePrompt';

const sw = vi.hoisted(() => ({
  offlineReady: [false, vi.fn()],
  needRefresh: [false, vi.fn()],
  updateServiceWorker: vi.fn(),
}));

vi.mock('virtual:pwa-register/react', () => ({ useRegisterSW: () => sw }));

describe('UpdatePrompt', () => {
  beforeEach(() => {
    sw.offlineReady[0] = false;
    sw.needRefresh[0] = false;
    vi.clearAllMocks();
  });

  it('não mostra aviso sem eventos do SW', () => {
    const { container } = render(<UpdatePrompt />);
    expect(container).toBeEmptyDOMElement();
  });

  it('permite fechar o aviso de pronto para uso offline', () => {
    sw.offlineReady[0] = true;
    render(<UpdatePrompt />);
    expect(screen.getByText('App pronto para uso offline')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(sw.offlineReady[1]).toHaveBeenCalledWith(false);
  });

  it('adiar dispensa o aviso sem ativar a nova versão', () => {
    sw.needRefresh[0] = true;
    render(<UpdatePrompt />);
    fireEvent.click(screen.getByRole('button', { name: 'Depois' }));
    expect(sw.needRefresh[1]).toHaveBeenCalledWith(false);
    expect(sw.updateServiceWorker).not.toHaveBeenCalled();
  });

  it('ativar a nova versão pede recarregamento', () => {
    sw.needRefresh[0] = true;
    render(<UpdatePrompt />);
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }));
    expect(sw.updateServiceWorker).toHaveBeenCalledWith(true);
  });
});
