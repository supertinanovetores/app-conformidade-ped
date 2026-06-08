import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renderiza título e conteúdo', () => {
    render(<Modal titulo="Olá" onClose={() => {}}><p>corpo</p></Modal>);
    expect(screen.getByText('Olá')).toBeInTheDocument();
    expect(screen.getByText('corpo')).toBeInTheDocument();
  });
  it('chama onClose ao clicar no overlay', () => {
    const onClose = vi.fn();
    const { container } = render(<Modal titulo="X" onClose={onClose}><p>c</p></Modal>);
    fireEvent.click(container.querySelector('.overlay')!);
    expect(onClose).toHaveBeenCalled();
  });

  it('expõe aria-labelledby apontando para o título', () => {
    render(<Modal titulo="Olá" onClose={() => {}}><p>corpo</p></Modal>);
    const dialog = screen.getByRole('dialog');
    const labelId = dialog.getAttribute('aria-labelledby');
    expect(labelId).toBeTruthy();
    expect(document.getElementById(labelId!)?.textContent).toBe('Olá');
  });

  it('restaura o foco ao elemento anterior quando fecha', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const { unmount } = render(
      <Modal titulo="X" onClose={() => {}}><button>dentro</button></Modal>
    );
    expect(document.activeElement).not.toBe(trigger);

    unmount();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('prende o foco: Tab no último foca o primeiro', () => {
    render(
      <Modal titulo="X" onClose={() => {}}>
        <button>primeiro</button>
        <button>ultimo</button>
      </Modal>
    );
    const primeiro = screen.getByText('primeiro');
    const ultimo = screen.getByText('ultimo');
    ultimo.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(primeiro);
  });

  it('prende o foco: Shift+Tab no primeiro foca o último', () => {
    render(
      <Modal titulo="X" onClose={() => {}}>
        <button>primeiro</button>
        <button>ultimo</button>
      </Modal>
    );
    const primeiro = screen.getByText('primeiro');
    const ultimo = screen.getByText('ultimo');
    primeiro.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(ultimo);
  });
});
