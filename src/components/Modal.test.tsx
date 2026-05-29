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
});
