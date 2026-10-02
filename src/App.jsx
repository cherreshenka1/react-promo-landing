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
  const [activeCategory, setActiveCategory] = useState('Все товары')
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
      const categoryMatches =
        activeCategory === 'Все товары' || product.category === activeCategory
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
      `Демо-заказ ${response.orderId} сформирован: ${response.itemsCount} товаров. Оплата не проводилась.`,
    )
    setIsSubmittingOrder(false)
  }

  const handleContactSubmit = async (event) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const formData = new FormData(formElement)

    setIsSubmittingContact(true)
    const response = await submitContactMessage({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    })

    setContactStatus(response.message)
    formElement.reset()
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
                  <p className="eyebrow">Подборка</p>
                  <h3>Найдите подходящий набор</h3>
                  <p>
                    Отфильтруйте каталог по задаче: от лендинга до панели управления. Поиск учитывает название и описание.
                  </p>
                </article>

                <article className="feature-card">
                  <p className="eyebrow">Сравнение</p>
                  <h3>Соберите свой комплект</h3>
                  <p>
                    Добавьте несколько наборов, сравните стоимость и измените количество прямо в корзине.
                  </p>
                </article>

                <article className="feature-card">
                  <p className="eyebrow">Возвращайтесь</p>
                  <h3>Выбор останется с вами</h3>
                  <p>
                    Корзина сохраняется в этом браузере. Можно вернуться позже и продолжить с того же места.
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
                eyebrow="Каталог"
                title="Frontend-продукты и UI-наборы"
                description="Фильтруй товары по категориям, ищи по названию и добавляй позиции в корзину."
              />

              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                query={query}
                onCategoryChange={setActiveCategory}
                onQueryChange={setQuery}
              />

              {isLoading ? (
                <div className="state-panel">Загружаем товары маркетплейса...</div>
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
                  Ничего не найдено. Попробуй другую категорию или поисковый запрос.
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
                eyebrow="Корзина"
                title="Твои выбранные товары"
                description="Меняй количество, удаляй позиции и запускай демо-оформление заказа."
              />

              {orderStatus ? <p className="status-banner">{orderStatus}</p> : null}

              {!cart.length ? (
                <div className="state-panel">
                  Корзина пока пустая.
                  <div className="empty-actions">
                    <Link to="/catalog" className="btn btn-primary">
                      Перейти в каталог
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
                    <p className="eyebrow">Итого</p>
                    <div className="summary-row">
                      <span>Товаров</span>
                      <strong>{cartItemsCount}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Сумма</span>
                      <strong>{cartTotal.toLocaleString('ru-RU')} ₽</strong>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-full"
                      onClick={handleCheckout}
                      disabled={isSubmittingOrder}
                    >
                      {isSubmittingOrder ? 'Оформляем...' : 'Сформировать демо-заказ'}
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
                eyebrow="Контакты"
                title="Есть вопрос о наборе?"
                description="Демонстрационная форма: проверка полей без отправки сообщения. Не вводите настоящие контактные данные."
              />

              <form className="contact-card" onSubmit={handleContactSubmit}>
                <label>
                  Имя
                  <input name="name" type="text" placeholder="Твоё имя" required />
                </label>

                <label>
                  Email
                  <input name="email" type="email" placeholder="your@email.com" required />
                </label>

                <label>
                  Сообщение
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Расскажи о проекте, задаче или вакансии"
                    required
                  />
                </label>

                <button type="submit" className="btn btn-primary btn-full" disabled={isSubmittingContact}>
                  {isSubmittingContact ? 'Отправляем...' : 'Отправить сообщение'}
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
              Такой страницы нет.
              <div className="empty-actions">
                <Link to="/" className="btn btn-primary">
                  На главную
                </Link>
              </div>
            </div>
          }
        />
      </Routes>
    </Layout>
  )
}
