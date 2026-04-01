import { products } from './data'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

export async function getProducts() {
  await wait(500)
  return products
}

export async function sendForm(data) {
  await wait(700)
  return { ok: true, message: 'Форма отправлена', data }
}