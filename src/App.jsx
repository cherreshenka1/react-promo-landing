import { useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Layout, SectionTitle, ProductCard, CartItem } from './ui'
import { getProducts, sendForm } from './api'

// basename для GitHub Pages
const basename = import.meta.env.DEV ? '/' : '/react-promo-landing/'

const savedTheme = localStorage.getItem('theme') || 'dark'
const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')

export default function App() {
  const [theme, setTheme] = useState(savedTheme)
  const [cart, setCart] = useState(savedCart)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [formStatus, setFormStatus] = useState('')

  useMemo(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useState(() => {
    getProducts().then((data) => {
      setItems(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart])
  const total = useMemo(() => cart.reduce((s, i) => s + i.qty * i.price, 0), [cart])

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((x) => x.id === product.id)
      if (exist) return prev.map((x) => (x.id === product.id ? { ...x, qty: x.qty + 1 } : x))
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const inc = (id) => setCart((prev) => prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)))
  const dec = (id) =>
    setCart((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))
    )
  const remove = (id) => setCart((prev) => prev.filter((x) => x.id !== id))

  const handleForm = async (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    const res = await sendForm(data)
    setFormStatus(res.message)
    e.target.reset()
  }

  return (
    <BrowserRouter basename={basename}>
      <Layout cartCount={cartCount} theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        <Routes>
          <Route path="/" element={
            <>
              <section className="hero card">
                <SectionTitle
                  title="ReactStore — магазин на React"
                  subtitle="SPA, имитация REST API, корзина, тёмная тема, jQuery → React."
                />
                <div className="row">
                  <Link className="primary" to="/catalog">Каталог</Link>
                  <Link className="secondary" to="/refactor">Refactor</Link>
                </div>
              </section>
            </>
          } />

          <Route path="/catalog" element={
            <>
              <SectionTitle title="Каталог" subtitle="Загрузка товаров через getProducts()" />
              {loading ? <p>Загрузка с REST‑мока…</p> : (
                <div className="grid">
                  {items.map((p) => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
                </div>
              )}
            </>
          } />

          <Route path="/cart" element={
            <>
              <SectionTitle title="Корзина" subtitle="Сохраняется в localStorage и обновляется в реальном времени." />
              {cart.length === 0 ? <p>Корзина пуста.</p> : (
                <>
                  <div className="stack">
                    {cart.map((item) => (
                      <CartItem key={item.id} item={item} onInc={inc} onDec={dec} onRemove={remove} />
                    ))}
                  </div>
                  <div className="total card">
                    Итого: {total} ₽
                  </div>
                </>
              )}
            </>
          } />

          <Route path="/theme" element={
            <section className="card pad">
              <SectionTitle title="Тёмная тема" subtitle="Тема и цвета хранятся в localStorage." />
              <div className="row">
                <p>
                  Текущая тема: <strong>{theme}</strong>
                </p>
                <button
                  className="secondary"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? 'Включить светлую' : 'Включить тёмную'}
                </button>
              </div>
              <div className="card theme-example" style={{ marginTop: 16 }}>
                <p>Этот блок меняет фон и акцент в зависимости от выбранной темы.</p>
              </div>
            </section>
          } />

          <Route path="/refactor" element={
            <section className="card pad">
              <SectionTitle
                title="Refactor: jQuery → React"
                subtitle="Пример, как старую jQuery‑логику можно переписать на React."
              />
              <div className="row">
                <div style={{ flex: 1 }}>
                  <h3>Старый jQuery</h3>
                  <pre className="code">
                    {`// jQuery
\$('#toggleBtn').click(() => {
  \$('#box').toggleClass('active');
})
`}
                  </pre>
                </div>
                <div style={{ flex: 1 }}>
                  <h3>Новый React</h3>
                  <pre className="code">
                    {`// React
const [active, setActive] = useState(false);

<button onClick={() => setActive(!active)}>Toggle</button>
<div className={active ? 'box active' : 'box'} />
`}
                  </pre>
                </div>
              </div>
              <p style={{ marginTop: 12 }}>
                <em>В React всё управляется через стейт, а не через прямое изменение DOM.</em>
              </p>
            </section>
          } />

          <Route path="/contact" element={
            <section className="card pad">
              <SectionTitle title="Контактная форма" subtitle="Имитация отправки форму на REST‑сервер." />
              <form className="form" onSubmit={handleForm}>
                <input name="name" placeholder="Имя" required />
                <input name="email" placeholder="Email" type="email" required />
                <textarea name="message" placeholder="Сообщение" required />
                <button className="primary" type="submit">Отправить</button>
              </form>
              {formStatus && (
                <p style={{ marginTop: 12 }}>
                  <strong>{formStatus}</strong>
                </p>
              )}
            </section>
          } />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}