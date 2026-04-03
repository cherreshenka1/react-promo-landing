import { Link, NavLink } from 'react-router-dom'

export function Layout({ cartCount, theme, onToggleTheme, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand-link" aria-label="React Store Lab home">
          React<span>Store</span>Lab
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/catalog">Catalog</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-pill" aria-label={`Open cart with ${cartCount} items`}>
            Cart <span>{cartCount}</span>
          </Link>
          <button type="button" className="theme-button" onClick={onToggleTheme}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>

      <main className="page-wrap">{children}</main>

      <footer className="site-footer">
        Built with React, React Router and Vite. Designed as a portfolio marketplace demo.
      </footer>
    </div>
  )
}

export function HeroBanner({ totalProducts, cartCount }) {
  return (
    <section className="hero-panel">
      <p className="eyebrow">Portfolio marketplace concept</p>
      <h1>React Store Lab</h1>
      <p className="hero-copy">
        A curated mini marketplace that highlights frontend skills: reusable components,
        async states, routing, local persistence, adaptive layout and polished UI details.
      </p>

      <div className="hero-actions">
        <Link to="/catalog" className="btn btn-primary">
          Browse catalog
        </Link>
        <Link to="/cart" className="btn btn-secondary">
          Open cart ({cartCount})
        </Link>
      </div>

      <dl className="hero-stats">
        <div>
          <dt>Products</dt>
          <dd>{totalProducts}</dd>
        </div>
        <div>
          <dt>UI theme</dt>
          <dd>Dark / Light</dd>
        </div>
        <div>
          <dt>Stack</dt>
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
      <div className="category-row" role="tablist" aria-label="Category filters">
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
        <span className="sr-only">Search products</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search products and skills"
        />
      </label>
    </div>
  )
}

export function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card">
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
          <span>Rating {product.rating}</span>
        </div>

        <button type="button" className="btn btn-primary btn-full" onClick={() => onAddToCart(product)}>
          Add to cart
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
        <p>{item.price.toLocaleString('ru-RU')} ₽ per item</p>
      </div>

      <div className="quantity-controls" aria-label={`Quantity controls for ${item.title}`}>
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
        Remove
      </button>
    </article>
  )
}
