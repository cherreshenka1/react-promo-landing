import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export function Layout({ cartCount, theme, onToggleTheme, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand-link" aria-label="На главную страницу React Store Lab">
          React<span>Store</span>Lab
        </Link>

        <nav className="main-nav" aria-label="Основная навигация">
          <NavLink to="/" end>
            Главная
          </NavLink>
          <NavLink to="/catalog">Каталог</NavLink>
          <NavLink to="/cart">Корзина</NavLink>
          <NavLink to="/contact">Контакты</NavLink>
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-pill" aria-label={`Открыть корзину, товаров: ${cartCount}`}>
            Корзина <span>{cartCount}</span>
          </Link>
          <button type="button" className="theme-button" onClick={onToggleTheme}>
            {theme === 'dark' ? 'Светлая' : 'Тёмная'}
          </button>
        </div>
      </header>

      <main className="page-wrap">{children}</main>

      <footer className="site-footer">
        Собрано на React, React Router и Vite. Это маркетплейс-проект для портфолио.
      </footer>
    </div>
  )
}

export function HeroBanner({ totalProducts, cartCount }) {
  return (
    <section className="hero-panel">
      <p className="eyebrow">Маркетплейс для портфолио</p>
      <h1>React Store Lab</h1>
      <p className="hero-copy">
        Мини-маркетплейс, который показывает мои frontend-навыки: переиспользуемые
        компоненты, async-состояния, роутинг, сохранение данных, адаптив и UI-анимации.
      </p>

      <div className="hero-actions">
        <Link to="/catalog" className="btn btn-primary">
          Смотреть каталог
        </Link>
        <Link to="/cart" className="btn btn-secondary">
          Корзина ({cartCount})
        </Link>
      </div>

      <dl className="hero-stats">
        <div>
          <dt>Товаров</dt>
          <dd>{totalProducts}</dd>
        </div>
        <div>
          <dt>Тема</dt>
          <dd>Тёмная / светлая</dd>
        </div>
        <div>
          <dt>Стек</dt>
          <dd>React 18</dd>
        </div>
      </dl>
    </section>
  )
}

export function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

export function CategoryFilter({ categories, activeCategory, query, onCategoryChange, onQueryChange }) {
  return (
    <div className="catalog-toolbar">
      <div className="category-row" role="tablist" aria-label="Фильтр по категориям">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={activeCategory === category ? 'chip chip-active' : 'chip'}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <label className="search-field">
        <span className="sr-only">Поиск товаров</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Поиск по товарам и навыкам"
        />
      </label>
    </div>
  )
}

export function ProductCard({ product, onAddToCart }) {
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    if (!isAdded) return undefined

    const timerId = window.setTimeout(() => setIsAdded(false), 900)
    return () => window.clearTimeout(timerId)
  }, [isAdded])

  const handleAdd = () => {
    onAddToCart(product)
    setIsAdded(true)
  }

  return (
    <article className={`product-card ${isAdded ? 'product-card-added' : ''}`}>
      <div
        className="product-cover"
        style={{
          background: `linear-gradient(135deg, ${product.accent[0]}, ${product.accent[1]})`,
        }}
      >
        <span className="product-icon">{product.icon}</span>
        <span className="product-tag">{product.tag}</span>
      </div>

      <div className="product-body">
        <p className="product-category">{product.category}</p>
        <h3>{product.title}</h3>
        <p className="product-text">{product.description}</p>

        <div className="product-meta">
          <strong>{product.price.toLocaleString('ru-RU')} ₽</strong>
          <span>Рейтинг {product.rating}</span>
        </div>

        <button
          type="button"
          className={`btn btn-primary btn-full add-cart-btn ${isAdded ? 'add-cart-btn-active' : ''}`}
          onClick={handleAdd}
        >
          <span className="add-cart-text">{isAdded ? 'Добавлено!' : 'В корзину'}</span>
          <span className="cart-fly-icon" aria-hidden="true">
            🛒
          </span>
        </button>
      </div>
    </article>
  )
}

export function CartLine({ item, onChangeQuantity, onRemove }) {
  return (
    <article className="cart-line">
      <div className="cart-line-info">
        <p className="product-category">{item.category}</p>
        <h3>{item.title}</h3>
        <p>{item.price.toLocaleString('ru-RU')} ₽ за штуку</p>
      </div>

      <div className="quantity-controls" aria-label={`Количество товара ${item.title}`}>
        <button type="button" onClick={() => onChangeQuantity(item.id, item.quantity - 1)}>
          -
        </button>
        <span>{item.quantity}</span>
        <button type="button" onClick={() => onChangeQuantity(item.id, item.quantity + 1)}>
          +
        </button>
      </div>

      <strong className="line-total">
        {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
      </strong>

      <button type="button" className="remove-btn" onClick={() => onRemove(item.id)}>
        Удалить
      </button>
    </article>
  )
}
