import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export function Layout({ cartCount, theme, onToggleTheme, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand-link" aria-label="На главную страницу книжного магазина">
          полка<span>.</span>
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

        </div>
      </header>

      <main className="page-wrap">{children}</main>

      <footer className="site-footer">
        Учебная витрина. Названия, авторы и обложки — Open Library. Цены условные, оплата не подключена.
      </footer>
    </div>
  )
}

export function HeroBanner({ totalProducts }) {
  return <section className="book-feature"><div className="book-intro"><p>Книжный магазин для любопытных</p><h1>Хорошие идеи<br/>живут на полке.</h1><p>Код, дизайн и вещи вокруг нас. Собираем небольшую библиотеку больших идей.</p><Link to="/catalog" className="btn btn-primary">В каталог · {totalProducts} книг ↗</Link></div><div className="cover-installation"><img src="./photos/book-0.jpg" alt="Eloquent JavaScript, Marijn Haverbeke"/><img src="./photos/book-2.jpg" alt="CSS: The Definitive Guide, Eric A. Meyer"/><p>Читать. Пробовать. Возвращаться.</p></div></section>
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
          placeholder="Название, автор или тема"
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
      <div className="product-cover"><img src={product.image} alt={`Обложка: ${product.title}`} loading="lazy"/>
        <span className="product-tag">{product.tag}</span>
      </div>

      <div className="product-body">
        <p className="product-category">{product.category}</p>
        <h3>{product.title}</h3>
        <p className="product-text">{product.description}</p>

        <div className="product-meta">
          <strong>{product.price.toLocaleString('ru-RU')} ₽</strong>
          <a href={product.source} target="_blank" rel="noreferrer">Об издании ↗</a>
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
