import { useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { createOrder, getProducts, submitContactMessage } from './api.js'
import { categories } from './data.js'
import {
  CartLine,
  CategoryFilter,
  HeroBanner,
  Layout,
  ProductCard,
  SectionTitle,
} from './ui.jsx'

const CART_KEY = 'react-store-lab-cart'
const THEME_KEY = 'react-store-lab-theme'

function loadStoredCart() {
  try {
    const value = localStorage.getItem(CART_KEY)
    return value ? JSON.parse(value) : []
  } catch {
    return []
  }
}

function loadStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark'
}

export default function App() {
  const [theme, setTheme] = useState(loadStoredTheme)
  const [cart, setCart] = useState(loadStoredCart)
  const [catalog, setCatalog] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [contactStatus, setContactStatus] = useState('')
  const [orderStatus, setOrderStatus] = useState('')
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    let isMounted = true

    getProducts().then((items) => {
      if (isMounted) {
        setCatalog(items)
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return catalog.filter((product) => {
      const categoryMatches = activeCategory === 'All' || product.category === activeCategory
      const queryMatches =
        normalizedQuery.length === 0 ||
        `${product.title} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(normalizedQuery)

      return categoryMatches && queryMatches
    })
  }, [activeCategory, catalog, query])

  const cartItemsCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  )

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  )

  const addToCart = (product) => {
    setOrderStatus('')
    setCart((currentCart) => {
      const item = currentCart.find((entry) => entry.id === product.id)

      if (item) {
        return currentCart.map((entry) =>
          entry.id === product.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
        )
      }

      return [...currentCart, { ...product, quantity: 1 }]
    })
  }

  const changeQuantity = (id, nextQuantity) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (id) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id))
  }

  const handleCheckout = async () => {
    if (!cart.length || isSubmittingOrder) return

    setIsSubmittingOrder(true)
    const response = await createOrder(cart)
    setCart([])
    setOrderStatus(
      `Order ${response.orderId} confirmed. ${response.itemsCount} item(s) are ready for delivery.`,
    )
    setIsSubmittingOrder(false)
  }

  const handleContactSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setIsSubmittingContact(true)
    const response = await submitContactMessage({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    })

    setContactStatus(response.message)
    event.currentTarget.reset()
    setIsSubmittingContact(false)
  }

  return (
    <Layout
      cartCount={cartItemsCount}
      theme={theme}
      onToggleTheme={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
    >
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroBanner totalProducts={catalog.length} cartCount={cartItemsCount} />

              <section className="home-grid">
                <article className="feature-card">
                  <p className="eyebrow">State management</p>
                  <h3>Cart, theme and filters</h3>
                  <p>
                    The project uses React state, memoized selectors and localStorage persistence.
                  </p>
                </article>

                <article className="feature-card">
                  <p className="eyebrow">Async UX</p>
                  <h3>Loading, submit and checkout flows</h3>
                  <p>
                    API calls are simulated with dedicated async helpers and clear UI feedback.
                  </p>
                </article>

                <article className="feature-card">
                  <p className="eyebrow">Component architecture</p>
                  <h3>Reusable UI blocks</h3>
                  <p>
                    Shared cards, layout and page sections keep the storefront easy to extend.
                  </p>
                </article>
              </section>
            </>
          }
        />

        <Route
          path="/catalog"
          element={
            <section>
              <SectionTitle
                eyebrow="Catalog"
                title="Ready-to-ship frontend products"
                description="Filter by category, search across the catalog and add items to your cart."
              />

              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                query={query}
                onCategoryChange={setActiveCategory}
                onQueryChange={setQuery}
              />

              {isLoading ? (
                <div className="state-panel">Loading marketplace products...</div>
              ) : filteredProducts.length ? (
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="state-panel">
                  No products found. Try another category or search term.
                </div>
              )}
            </section>
          }
        />

        <Route
          path="/cart"
          element={
            <section>
              <SectionTitle
                eyebrow="Cart"
                title="Review your selected items"
                description="Update quantities, remove products or complete the checkout simulation."
              />

              {orderStatus ? <p className="status-banner">{orderStatus}</p> : null}

              {!cart.length ? (
                <div className="state-panel">
                  Your cart is empty.
                  <div className="empty-actions">
                    <Link to="/catalog" className="btn btn-primary">
                      Explore catalog
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="cart-layout">
                  <div className="cart-stack">
                    {cart.map((item) => (
                      <CartLine
                        key={item.id}
                        item={item}
                        onChangeQuantity={changeQuantity}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </div>

                  <aside className="checkout-card">
                    <p className="eyebrow">Summary</p>
                    <div className="summary-row">
                      <span>Items</span>
                      <strong>{cartItemsCount}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Total</span>
                      <strong>{cartTotal.toLocaleString('ru-RU')} ₽</strong>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-full"
                      onClick={handleCheckout}
                      disabled={isSubmittingOrder}
                    >
                      {isSubmittingOrder ? 'Processing...' : 'Checkout'}
                    </button>
                  </aside>
                </div>
              )}
            </section>
          }
        />

        <Route
          path="/contact"
          element={
            <section className="contact-shell">
              <SectionTitle
                eyebrow="Contact"
                title="Let's discuss a frontend role"
                description="Use this form as a portfolio interaction demo. The submit flow is asynchronous and returns a confirmation message."
              />

              <form className="contact-card" onSubmit={handleContactSubmit}>
                <label>
                  Name
                  <input name="name" type="text" placeholder="Your name" required />
                </label>

                <label>
                  Email
                  <input name="email" type="email" placeholder="your@email.com" required />
                </label>

                <label>
                  Message
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Tell me about your project or vacancy"
                    required
                  />
                </label>

                <button type="submit" className="btn btn-primary btn-full" disabled={isSubmittingContact}>
                  {isSubmittingContact ? 'Sending...' : 'Send message'}
                </button>

                {contactStatus ? <p className="status-banner">{contactStatus}</p> : null}
              </form>
            </section>
          }
        />

        <Route
          path="*"
          element={
            <div className="state-panel">
              This page does not exist.
              <div className="empty-actions">
                <Link to="/" className="btn btn-primary">
                  Back home
                </Link>
              </div>
            </div>
          }
        />
      </Routes>
    </Layout>
  )
}
