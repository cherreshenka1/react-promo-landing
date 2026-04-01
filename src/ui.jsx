import { Link, NavLink } from 'react-router-dom'

export function Layout({ children, cartCount, theme, onToggleTheme }) {
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="logo">ReactStore</Link>
        <nav className="nav">
          <NavLink to="/" end>Главная</NavLink>
          <NavLink to="/catalog">Каталог</NavLink>
          <NavLink to="/cart">Корзина ({cartCount})</NavLink>
          <NavLink to="/theme">Тема</NavLink>
          <NavLink to="/refactor">Refactor</NavLink>
          <NavLink to="/contact">Контакты</NavLink>
        </nav>
        <button className="theme-btn" onClick={onToggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>

      <main className="container">{children}</main>

      <footer className="footer">
        <p>ReactStore — современный магазин на React + Vite.</p>
      </footer>
    </div>
  )
}

export function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}

export function ProductCard({ product, onAdd }) {
  return (
    <article className="card product">
      <span className="tag">{product.tag}</span>
      <h3>{product.title}</h3>
      <p>{product.desc}</p>
      <div className="row">
        <strong>{product.price} ₽</strong>
        <button onClick={() => onAdd(product)}>В корзину</button>
      </div>
    </article>
  )
}

export function CartItem({ item, onInc, onDec, onRemove }) {
  return (
    <div className="card cart-item">
      <div>
        <h3>{item.title}</h3>
        <p>{item.price} ₽ × {item.qty}</p>
      </div>
      <div className="row">
        <button onClick={() => onDec(item.id)}>-</button>
        <button onClick={() => onInc(item.id)}>+</button>
        <button className="danger" onClick={() => onRemove(item.id)}>Удалить</button>
      </div>
    </div>
  )
}