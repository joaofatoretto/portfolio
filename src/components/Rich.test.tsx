import { render, screen } from '@testing-library/react';
import { Rich } from './Rich';

describe('Rich', () => {
  it('renders bold, italic and links', () => {
    render(<p><Rich text="A **bold** move, _quietly_, see [the article](https://example.com)." /></p>);
    expect(screen.getByText('bold').tagName).toBe('STRONG');
    expect(screen.getByText('quietly').tagName).toBe('EM');
    const link = screen.getByRole('link', { name: 'the article' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('leaves plain text alone', () => {
    const { container } = render(<p><Rich text="Nothing special here" /></p>);
    expect(container.textContent).toBe('Nothing special here');
  });
});
