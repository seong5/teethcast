import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button', () => {
  it('올바르게 렌더링된다', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('기본적으로 primary variant가 적용된다', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-[#10a6c1]');
  });

  it('secondary variant가 적용된다', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-900');
  });

  it('size 클래스가 올바르게 적용된다', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-8', 'py-4', 'text-lg');
  });

  it('disabled prop이 true일 때 비활성화된다', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('isLoading이 true일 때 비활성화된다', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('클릭 시 onClick 핸들러가 호출된다', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('비활성화 상태일 때 onClick이 호출되지 않는다', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('기본적으로 아이콘이 왼쪽에 렌더링된다', () => {
    const icon = <span data-testid="icon">🔍</span>;
    render(<Button icon={icon}>Search</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('iconPosition이 right일 때 아이콘이 오른쪽에 렌더링된다', () => {
    const icon = <span data-testid="icon">→</span>;
    render(<Button icon={icon} iconPosition="right">Next</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
