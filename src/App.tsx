
import { useEffect, useState } from 'react';
import { Menu, X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

type User = {
  id: number;
  name: string;
  status: string;
};

const slides = [
  { title: 'Good Afternoon', subtitle: 'Spaces and Cybers.' },
  { title: 'Good Morning', subtitle: 'Cybers and Spaces.' },
  { title: 'Welcome Home', subtitle: 'A place to get started.' },
];

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3000/api/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu.');
        }
        return response.json();
      })
      .then((data: User[]) => setUsers(data))
      .catch(() => {
        setError('Không thể kết nối đến máy chủ. Hãy kiểm tra backend và tải lại trang.');
      })
      .finally(() => setLoading(false));
  }, []);

  const changeSlide = (direction: number) => {
    setSlide((current) => (current + direction + slides.length) % slides.length);
  };

  const closeNavigation = () => {
    setMenuOpen(false);
    setOptionsOpen(false);
  };

  return (
    <div className="page">
      <header className="topbar">
        <a className="brand" href="#home" onClick={closeNavigation}>
          MY APP
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={25} /> : <Menu size={27} />}
        </button>

        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          <a className="active" href="#home" onClick={closeNavigation}>
            Home
          </a>

          <a href="#users" onClick={closeNavigation}>
            Link
          </a>

          <div className="nav-dropdown">
            <button
              type="button"
              className={optionsOpen ? 'dropdown-trigger open' : 'dropdown-trigger'}
              aria-expanded={optionsOpen}
              aria-haspopup="true"
              onClick={() => setOptionsOpen((open) => !open)}
            >
              Options
              <span
                className={optionsOpen ? 'dropdown-arrow rotated' : 'dropdown-arrow'}
              >
                ⌄
              </span>
            </button>

            {optionsOpen && (
              <div className="dropdown-menu">
                <a href="#users" onClick={closeNavigation}>
                  User list
                </a>
                <a href="#footer" onClick={closeNavigation}>
                  About
                </a>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main id="home">
        <section className="banner" aria-label="Featured slides">
          <button
            className="slide-arrow left"
            type="button"
            aria-label="Ảnh trước"
            onClick={() => changeSlide(-1)}
          >
            <ChevronLeft size={28} />
          </button>

          <div className="banner-copy" key={slide}>
            <h1>{slides[slide].title}</h1>
            <p>{slides[slide].subtitle}</p>
          </div>

          <button
            className="slide-arrow right"
            type="button"
            aria-label="Ảnh tiếp theo"
            onClick={() => changeSlide(1)}
          >
            <ChevronRight size={28} />
          </button>

          <div className="slide-dots">
            {slides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Chuyển đến ảnh ${index + 1}`}
                aria-pressed={index === slide}
                className={index === slide ? 'dot selected' : 'dot'}
                onClick={() => setSlide(index)}
              />
            ))}
          </div>
        </section>

        <section className="content" id="users">
          <div className="section-heading">
            <h2>User list</h2>
            <span>Data from API</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={3} className="message">
                      Loading data...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={3} className="message error">
                      {error}
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.id}</td>
                      <td>
                        <span className="status">
                          <span />
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                {!loading && !error && users.length === 0 && (
                  <tr>
                    <td colSpan={3} className="message">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer id="footer">
        <MapPin size={17} strokeWidth={1.8} />
        <span>
          Hanoi,{' '}
          {new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric',
          }).format(new Date())}
        </span>
      </footer>
    </div>
  );
}
