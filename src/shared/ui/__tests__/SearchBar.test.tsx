import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('올바르게 렌더링된다', () => {
    const handleChange = jest.fn();
    render(<SearchBar value="" onChange={handleChange} />);
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('placeholder가 올바르게 표시된다', () => {
    const handleChange = jest.fn();
    render(<SearchBar value="" onChange={handleChange} placeholder="지역 검색" />);
    expect(screen.getByPlaceholderText('지역 검색')).toBeInTheDocument();
  });

  it('기본 placeholder가 표시된다', () => {
    const handleChange = jest.fn();
    render(<SearchBar value="" onChange={handleChange} />);
    expect(screen.getByPlaceholderText('검색...')).toBeInTheDocument();
  });

  it('입력값이 올바르게 표시된다', () => {
    const handleChange = jest.fn();
    render(<SearchBar value="서울" onChange={handleChange} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('서울');
  });

  it('입력 시 onChange가 호출된다', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<SearchBar value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, '서울');
    
    expect(handleChange).toHaveBeenCalledTimes(2); // '서', '울' 각각 호출
  });

  it('Enter 키 입력 시 onSearchClick이 호출된다', async () => {
    const handleChange = jest.fn();
    const handleSearch = jest.fn();
    const user = userEvent.setup();
    render(<SearchBar value="서울" onChange={handleChange} onSearchClick={handleSearch} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, '{Enter}');
    
    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it('검색 버튼 클릭 시 onSearchClick이 호출된다', async () => {
    const handleChange = jest.fn();
    const handleSearch = jest.fn();
    const user = userEvent.setup();
    render(<SearchBar value="서울" onChange={handleChange} onSearchClick={handleSearch} />);
    
    const searchButton = screen.getByRole('button', { name: /검색/i });
    await user.click(searchButton);
    
    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it('onSearchClick이 없으면 검색 버튼이 표시되지 않는다', () => {
    const handleChange = jest.fn();
    render(<SearchBar value="" onChange={handleChange} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('className이 올바르게 적용된다', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <SearchBar value="" onChange={handleChange} className="custom-class" />
    );
    const searchContainer = container.querySelector('.custom-class');
    expect(searchContainer).toBeInTheDocument();
  });

  it('접근성 속성이 올바르게 설정된다', () => {
    const handleChange = jest.fn();
    render(<SearchBar value="" onChange={handleChange} placeholder="지역 검색" />);
    
    expect(screen.getByRole('search')).toHaveAttribute('aria-label', '검색');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', '지역 검색');
  });
});
