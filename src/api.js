import { products } from './data.js'

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

export async function getProducts() {
  await wait(450)
  return products
}

export async function submitContactMessage(payload) {
  await wait(700)
  return {
    success: true,
    message: `Thanks, ${payload.name}! I will reply to ${payload.email} soon.`,
  }
}

export async function createOrder(cartItems) {
  await wait(800)
  return {
    success: true,
    orderId: `RS-${Date.now().toString().slice(-6)}`,
    itemsCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
  }
}
