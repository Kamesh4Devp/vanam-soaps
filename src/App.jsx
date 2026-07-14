import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'

const INSTAGRAM_URL = 'https://www.instagram.com/____vanam___?igsh=eHdnemxyNXAzeG1x'
const WHATSAPP_NUMBER = '919176188117'
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxzxfh9qZV-eMTdf68R1g8ymjASAQq3SIeqzcfAHWRDmJ3wDBf3Qm6n0KJ2WSxmHPR9/exec'
const FREE_SHIPPING_THRESHOLD = 499
const SHIPPING_CHARGE = 50

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [page, setPage] = useState('home')
  const [soaps, setSoaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vanam_cart')) || [] } catch { return [] }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [lastOrderId, setLastOrderId] = useState('')

  useEffect(() => {
    localStorage.setItem('vanam_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    fetch('/soaps.xlsx')
      .then(res => res.arrayBuffer())
      .then(data => {
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(ws)
        const parsed = json.map(row => {
          const images = []
          for (let k = 1; k <= 10; k++) {
            if (row[`image${k}`]) images.push(row[`image${k}`])
          }
          return { name: row.name, description: row.description, price: row.price, weight: row.weight || '', inStock: row.inStock !== 'no', images }
        })
        setSoaps(parsed)
      })
      .catch(() => {
        setSoaps([
          { name: 'Kuppameni Soap', description: 'Traditional herbal soap made with Kuppameni leaves', price: 120, weight: '100g', inStock: true, images: ['/images/kuppameni1.jpg', '/images/kuppameni2.jpg', '/images/kuppameni3.jpg'] },
          { name: 'Papaya Soap', description: 'Skin brightening soap with natural papaya extract', price: 130, weight: '100g', inStock: true, images: ['/images/papaya1.jpg', '/images/papaya2.jpg', '/images/papaya3.jpg'] },
          { name: 'Aloe Vera Soap', description: 'Moisturizing soap with fresh aloe vera gel', price: 110, weight: '100g', inStock: true, images: ['/images/aloevera1.jpg', '/images/aloevera2.jpg', '/images/aloevera3.jpg'] },
          { name: 'Charcoal Soap', description: 'Deep cleansing activated charcoal soap', price: 140, weight: '100g', inStock: true, images: ['/images/charcoal1.jpg', '/images/charcoal2.jpg', '/images/charcoal3.jpg'] },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  const addToCart = (soap) => {
    setCart(prev => {
      const existing = prev.find(item => item.name === soap.name)
      if (existing) return prev.map(item => item.name === soap.name ? { ...item, qty: item.qty + 1 } : item)
      return [...prev, { ...soap, qty: 1 }]
    })
  }

  const updateQty = (name, delta) => {
    setCart(prev => prev.map(item => item.name === name ? { ...item, qty: Math.max(0, item.qty + delta) } : item).filter(item => item.qty > 0))
  }

  const removeFromCart = (name) => setCart(prev => prev.filter(item => item.name !== name))

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)

  const navigate = (p) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0) }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", margin: 0, minHeight: '100vh', background: '#faf7f2' }}>

      {/* Hamburger Menu Button */}
      <button onClick={() => setMenuOpen(!menuOpen)}
        style={{ position: 'fixed', top: 20, left: 20, zIndex: 1000, background: '#2d5016', border: 'none', borderRadius: 8, width: 44, height: 44, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <span style={{ width: 22, height: 2.5, background: '#fff', borderRadius: 2, transition: '0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
        <span style={{ width: 22, height: 2.5, background: '#fff', borderRadius: 2, transition: '0.3s', opacity: menuOpen ? 0 : 1 }} />
        <span style={{ width: 22, height: 2.5, background: '#fff', borderRadius: 2, transition: '0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
      </button>

      {/* Cart Button - Top Right */}
      <button onClick={() => setCartOpen(true)}
        style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000, background: '#2d5016', border: 'none', borderRadius: 8, width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <span style={{ fontSize: 20 }}>🛒</span>
        {totalItems > 0 && (
          <span style={{ position: 'absolute', top: -6, right: -6, background: '#e53e3e', color: '#fff', fontSize: 11, fontWeight: 700, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{totalItems}</span>
        )}
      </button>

      {/* Side Menu */}
      <div style={{ position: 'fixed', top: 0, left: menuOpen ? 0 : -280, width: 260, height: '100vh', background: '#2d5016', zIndex: 999, transition: 'left 0.3s ease', padding: '80px 30px', boxShadow: menuOpen ? '4px 0 20px rgba(0,0,0,0.3)' : 'none' }}>
        <img src="/logo.png" alt="Vanam" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 20, border: '2px solid rgba(255,255,255,0.3)' }} />
        <h2 style={{ color: '#fff', fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 40 }}>Vanam</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, fontWeight: 500, cursor: 'pointer', textAlign: 'left', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>🏠 Home</button>
          <button onClick={() => navigate('about')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, fontWeight: 500, cursor: 'pointer', textAlign: 'left', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>🌿 About</button>
          <button onClick={() => navigate('contact')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, fontWeight: 500, cursor: 'pointer', textAlign: 'left', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>📞 Contact</button>
          <button onClick={() => navigate('shipping')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, fontWeight: 500, cursor: 'pointer', textAlign: 'left', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>🚚 Shipping & Returns</button>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontSize: 18, fontWeight: 500, textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>📸 Instagram</a>
        </nav>
      </div>

      {/* Menu Overlay */}
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 998 }} />}

      {/* Main Content */}
      {page === 'home' ? <HomePage soaps={soaps} loading={loading} addToCart={addToCart} /> : page === 'about' ? <AboutPage /> : page === 'contact' ? <ContactPage /> : page === 'shipping' ? <ShippingPage /> : page === 'order-success' ? <OrderSuccessPage orderId={lastOrderId} /> : <NotFoundPage onHome={() => setPage('home')} />}

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button */}
      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'm interested in Vanam Soaps`} target="_blank" rel="noopener noreferrer"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 900, width: 56, height: 56, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37,211,102,0.4)', textDecoration: 'none', fontSize: 28 }}>
        💬
      </a>

      {/* Cart Drawer */}
      {cartOpen && <CartDrawer cart={cart} updateQty={updateQty} removeFromCart={removeFromCart} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }} />}

      {/* Checkout Modal */}
      {checkoutOpen && <CheckoutModal cart={cart} onClose={() => setCheckoutOpen(false)} onSuccess={(id) => { setCart([]); setCheckoutOpen(false); setLastOrderId(id); setPage('order-success') }} />}
    </div>
  )
}

function HomePage({ soaps, loading, addToCart }) {
  return (
    <div style={{ overflowY: 'auto' }}>
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url("/images/forest-bg.jpg") center/cover no-repeat', color: '#fff', padding: '40px 20px' }}>
        <img src="/logo.png" alt="Vanam" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 24, border: '3px solid rgba(255,255,255,0.4)' }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, margin: '0 0 20px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Welcome to Vanam Soaps</h1>
        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)', fontWeight: 300, maxWidth: 600, opacity: 0.9, margin: '0 0 30px' }}>Handmade with love, crafted from nature's finest ingredients</p>
        <div style={{ width: 60, height: 3, background: '#fff', borderRadius: 2, opacity: 0.6 }} />
        <p style={{ marginTop: 50, fontSize: 14, opacity: 0.7, animation: 'bounce 2s infinite' }}>↓ Scroll down to explore ↓</p>
      </section>

      {/* Shipping Info Banner */}
      <div style={{ background: '#2d5016', color: '#fff', padding: '12px 20px', display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap', fontSize: 13, fontWeight: 500 }}>
        <span>🚚 Free shipping on orders above ₹499</span>
        <span>📦 Delivery in 5-7 business days</span>
        <span>🌿 100% Natural & Handmade</span>
      </div>

      <section style={{ padding: '80px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', textAlign: 'center', color: '#2d5016', marginBottom: 10 }}>Bath Soaps</h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: 16, marginBottom: 50 }}>Our collection of handmade natural soaps</p>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 40, height: 40, border: '4px solid #e8f5e9', borderTop: '4px solid #2d5016', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#666' }}>Loading products...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 30 }}>
            {soaps.map((soap, i) => <SoapCard key={i} soap={soap} addToCart={addToCart} />)}
          </div>
        )}
      </section>

      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

const IMG_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

function resolveImageSrc(src) {
  const base = src.replace(/\.[^.]+$/, '')
  return { base, original: src }
}

function AutoImage({ src, alt, style }) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [extIdx, setExtIdx] = useState(0)
  const base = src.replace(/\.[^.]+$/, '')

  const handleError = () => {
    const nextIdx = extIdx + 1
    if (nextIdx < IMG_EXTENSIONS.length) {
      setExtIdx(nextIdx)
      setCurrentSrc(`${base}.${IMG_EXTENSIONS[nextIdx]}`)
    }
  }

  return <img src={currentSrc} alt={alt} style={style} onError={handleError} />
}

function SoapCard({ soap, addToCart }) {
  const [current, setCurrent] = useState(0)
  const [added, setAdded] = useState(false)
  const images = soap.images?.length ? soap.images : []
  const total = images.length

  const [zoom, setZoom] = useState(false)

  const handleAdd = () => {
    addToCart(soap)
    setAdded(true)
    setTimeout(() => setAdded(false), 1000)
  }

  return (
    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'transform 0.3s, box-shadow 0.3s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)' }}>
      {/* Image Carousel */}
      <div style={{ height: 220, background: '#e8f5e9', position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => images.length > 0 && setZoom(true)}>
        {total > 0 ? (
          <>
            <AutoImage src={images[current]} alt={soap.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {total > 1 && (
              <>
                <button onClick={() => setCurrent(c => (c - 1 + total) % total)} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>‹</button>
                <button onClick={() => setCurrent(c => (c + 1) % total)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>›</button>
                <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                  {images.map((_, idx) => <span key={idx} onClick={() => setCurrent(idx)} style={{ width: 8, height: 8, borderRadius: '50%', background: idx === current ? '#2d5016' : 'rgba(255,255,255,0.7)', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.2)' }} />)}
                </div>
              </>
            )}
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 60 }}>🧼</span></div>
        )}
      </div>

      {/* Fullscreen Image Viewer */}
      {zoom && (
        <div onClick={() => setZoom(false)} style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
          <AutoImage src={images[current]} alt={soap.name} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }} />
          {total > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setCurrent(c => (c - 1 + total) % total) }} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>‹</button>
              <button onClick={e => { e.stopPropagation(); setCurrent(c => (c + 1) % total) }} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>›</button>
            </>
          )}
          <button onClick={() => setZoom(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: 24, width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <div style={{ padding: '20px 24px' }}>
        <h3 style={{ color: '#2d5016', fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>{soap.name}</h3>
        <p style={{ color: '#666', fontSize: 14, margin: '0 0 4px', lineHeight: 1.5 }}>{soap.description}</p>
        {soap.weight && <p style={{ color: '#888', fontSize: 12, margin: '0 0 12px' }}>Net Wt: {soap.weight}</p>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {soap.price && <span style={{ color: '#2d5016', fontSize: 18, fontWeight: 700 }}>₹{getPrice(soap.price)}</span>}
          {soap.inStock === false ? (
            <span style={{ color: '#e53e3e', fontSize: 13, fontWeight: 600, padding: '10px 18px' }}>Out of Stock</span>
          ) : (
            <button onClick={handleAdd}
              style={{ background: added ? '#16a34a' : '#2d5016', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.3s' }}>
              {added ? '✓ Added' : '🛒 Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function getPrice(p) {
  if (!p) return 0
  if (typeof p === 'number') return p
  return parseInt(String(p).replace(/[^\d]/g, '') || '0')
}

function getShipping(subtotal) {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE
}

function CartDrawer({ cart, updateQty, removeFromCart, onClose, onCheckout }) {
  const subtotal = cart.reduce((sum, item) => sum + getPrice(item.price) * item.qty, 0)
  const shipping = getShipping(subtotal)
  const total = subtotal + shipping

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: 'min(400px, 90vw)', height: '100vh', background: '#fff', boxShadow: '-4px 0 20px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, color: '#2d5016', fontSize: 20, fontWeight: 700 }}>🛒 Your Cart</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#666' }}>✕</button>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
              <p style={{ fontSize: 48 }}>🛒</p>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ width: 55, height: 55, borderRadius: 10, background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {item.images?.[0] ? <AutoImage src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🧼'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#333' }}>{item.name}</p>
                  <p style={{ margin: '4px 0 0', color: '#2d5016', fontWeight: 700, fontSize: 14 }}>₹{getPrice(item.price)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => updateQty(item.name, -1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #ddd', background: '#f9f9f9', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ fontWeight: 700, fontSize: 14, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.name, 1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #ddd', background: '#f9f9f9', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.name)} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: 18 }}>🗑</button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 14, color: '#555' }}>Subtotal</span>
              <span style={{ fontSize: 14, color: '#555' }}>₹{subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 14, color: '#555' }}>Shipping</span>
              <span style={{ fontSize: 14, color: shipping === 0 ? '#16a34a' : '#555' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            {shipping > 0 && <p style={{ margin: '0 0 12px', fontSize: 11, color: '#888' }}>Add ₹{FREE_SHIPPING_THRESHOLD - subtotal} more for free shipping</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#2d5016' }}>₹{total}</span>
            </div>
            <button onClick={onCheckout} style={{ width: '100%', background: '#2d5016', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function generateOrderId() {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const time = now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0')
  const rand = Math.floor(Math.random() * 9000 + 1000)
  return `VNM-${date}-${time}-${rand}`
}

function CheckoutModal({ cart, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', city: '', state: '', pincode: '', landmark: '' })
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState('form')
  const [orderId, setOrderId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [upiClicked, setUpiClicked] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + getPrice(item.price) * item.qty, 0)
  const shipping = getShipping(subtotal)
  const total = subtotal + shipping
  const itemsText = cart.map(item => `${item.name} x${item.qty}`).join(', ')

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!/^[6-9][0-9]{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit phone number'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter valid email'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.state.trim()) e.state = 'State is required'
    if (!/^[1-9][0-9]{5}$/.test(form.pincode)) e.pincode = 'Enter valid 6-digit pincode'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const UPI_ID = 'kame9098-3@okhdfcbank'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const id = generateOrderId()
    setOrderId(id)
    setStep('payment')
  }

  const openUPI = () => {
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent('Vanam Soaps')}&am=${total}&cu=INR&tn=${encodeURIComponent(`Order ${orderId}`)}`
    window.location.href = upiUrl
  }

  const sendScreenshot = async () => {
    if (submitting) return
    setSubmitting(true)

    const orderData = {
      orderId: orderId,
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name: form.name.trim(),
      phone: form.phone,
      email: form.email.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode,
      landmark: form.landmark.trim(),
      items: itemsText,
      subtotal: subtotal,
      shipping: shipping,
      total: total
    }

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
    } catch (err) {
      // Still proceed to WhatsApp even if sheet fails
    }

    setSubmitting(false)

    const msg = `Hi! I've completed payment for my order.%0A%0A🧾 Order ID: ${orderId}%0A💰 Amount: ₹${total}%0A📦 Items: ${encodeURIComponent(itemsText)}%0A👤 Name: ${encodeURIComponent(form.name)}%0A📱 Phone: ${form.phone}%0A%0APlease confirm my order. I'll send the payment screenshot here.`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
    setStep('success')
    setTimeout(() => onSuccess(orderId), 3000)
  }

  if (step === 'success') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '50px 40px', textAlign: 'center', maxWidth: 420 }}>
          <p style={{ fontSize: 60, margin: '0 0 16px' }}>✅</p>
          <h3 style={{ color: '#2d5016', fontSize: 22, margin: '0 0 10px' }}>Order Placed!</h3>
          <p style={{ color: '#2d5016', fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>Order ID: {orderId}</p>
          <p style={{ color: '#666', fontSize: 14 }}>Send your payment screenshot on WhatsApp. We'll confirm and ship your order within 5-7 days!</p>
        </div>
      </div>
    )
  }

  if (step === 'payment') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '40px 30px', textAlign: 'center', maxWidth: 420, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ color: '#2d5016', fontSize: 20, margin: '0 0 6px' }}>💳 Complete Payment</h3>
          <p style={{ color: '#666', fontSize: 13, margin: '0 0 20px' }}>Order ID: <strong>{orderId}</strong> | Amount: <strong>₹{total}</strong></p>

          {!upiClicked ? (
            <>
              <p style={{ color: '#333', fontSize: 15, fontWeight: 600, margin: '0 0 16px' }}>How would you like to pay?</p>

              <button onClick={() => { setUpiClicked('qr') }} style={{ width: '100%', background: '#f0f7ec', border: '2px solid #2d5016', borderRadius: 12, padding: '16px', cursor: 'pointer', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>📷</span>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, color: '#2d5016', fontSize: 15, fontWeight: 700 }}>Scan QR Code</p>
                  <p style={{ margin: '2px 0 0', color: '#666', fontSize: 12 }}>Scan from your phone using any UPI app</p>
                </div>
              </button>

              <button onClick={() => { setUpiClicked('app'); openUPI() }} style={{ width: '100%', background: '#f0f7ec', border: '2px solid #2d5016', borderRadius: 12, padding: '16px', cursor: 'pointer', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>📱</span>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, color: '#2d5016', fontSize: 15, fontWeight: 700 }}>Open UPI App</p>
                  <p style={{ margin: '2px 0 0', color: '#666', fontSize: 12 }}>Opens GPay/PhonePe/Paytm on this device</p>
                </div>
              </button>

              <button onClick={() => { setUpiClicked('manual') }} style={{ width: '100%', background: '#f0f7ec', border: '2px solid #2d5016', borderRadius: 12, padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>✏️</span>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, color: '#2d5016', fontSize: 15, fontWeight: 700 }}>Pay Manually</p>
                  <p style={{ margin: '2px 0 0', color: '#666', fontSize: 12 }}>Get UPI ID / number to pay from your app</p>
                </div>
              </button>
            </>
          ) : upiClicked === 'qr' ? (
            <>
              <div style={{ background: '#fff', borderRadius: 10, padding: 16, marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #e0e0e0' }}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${UPI_ID}&pn=Vanam Soaps&am=${total}&cu=INR&tn=Order ${orderId}`)}`} alt="UPI QR Code" style={{ width: 200, height: 200, borderRadius: 8 }} />
                <p style={{ margin: '12px 0 4px', color: '#333', fontSize: 14, fontWeight: 600 }}>Scan & Pay ₹{total}</p>
                <p style={{ margin: 0, color: '#888', fontSize: 12 }}>Use GPay, PhonePe, Paytm or any UPI app</p>
              </div>

              <p style={{ color: '#333', fontSize: 13, margin: '0 0 12px', fontWeight: 500 }}>After payment is done:</p>
              <button onClick={sendScreenshot} disabled={submitting} style={{ background: '#25d366', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: submitting ? 'wait' : 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Saving order...' : '📱 I\'ve Paid — Send Screenshot on WhatsApp'}
              </button>
              <button onClick={() => setUpiClicked(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 12, cursor: 'pointer', marginTop: 12 }}>← Choose different method</button>
            </>
          ) : upiClicked === 'app' ? (
            <>
              <div style={{ background: '#f0f7ec', borderRadius: 12, padding: '20px', marginBottom: 16 }}>
                <p style={{ margin: '0 0 4px', fontSize: 14, color: '#333' }}>UPI app should have opened on your device.</p>
                <p style={{ margin: 0, fontSize: 13, color: '#666' }}>Complete the payment of <strong>₹{total}</strong> there.</p>
              </div>

              <p style={{ color: '#333', fontSize: 13, margin: '0 0 12px', fontWeight: 500 }}>After payment is done:</p>
              <button onClick={sendScreenshot} disabled={submitting} style={{ background: '#25d366', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: submitting ? 'wait' : 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Saving order...' : '📱 I\'ve Paid — Send Screenshot on WhatsApp'}
              </button>
              <button onClick={() => setUpiClicked(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 12, cursor: 'pointer', marginTop: 12 }}>← Choose different method</button>
            </>
          ) : (
            <>
              <div style={{ background: '#f0f7ec', borderRadius: 12, padding: '20px', marginBottom: 16, textAlign: 'left' }}>
                <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 600, color: '#333' }}>Pay ₹{total} using these details:</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #c8e6c9' }}>
                  <span style={{ color: '#555', fontSize: 13 }}>UPI ID</span>
                  <span style={{ color: '#2d5016', fontSize: 14, fontWeight: 700 }}>{UPI_ID}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <span style={{ color: '#555', fontSize: 13 }}>UPI Number</span>
                  <span style={{ color: '#2d5016', fontSize: 14, fontWeight: 700 }}>9176188117</span>
                </div>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(UPI_ID) }} style={{ background: 'none', border: '1px solid #2d5016', color: '#2d5016', borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%', marginBottom: 16 }}>
                📋 Copy UPI ID
              </button>

              <p style={{ color: '#333', fontSize: 13, margin: '0 0 12px', fontWeight: 500 }}>After payment is done:</p>
              <button onClick={sendScreenshot} disabled={submitting} style={{ background: '#25d366', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: submitting ? 'wait' : 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Saving order...' : '📱 I\'ve Paid — Send Screenshot on WhatsApp'}
              </button>
              <button onClick={() => setUpiClicked(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 12, cursor: 'pointer', marginTop: 12 }}>← Choose different method</button>
            </>
          )}

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#999', fontSize: 13, cursor: 'pointer', marginTop: 16 }}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto' }}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        {/* Header */}
        <div style={{ padding: '24px 30px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', borderRadius: '20px 20px 0 0' }}>
          <h3 style={{ margin: 0, color: '#2d5016', fontSize: 20, fontWeight: 700 }}>📦 Checkout</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#666' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px 30px' }}>
          {/* Order Summary */}
          <div style={{ background: '#f0f7ec', borderRadius: 12, padding: '16px', marginBottom: 24 }}>
            <p style={{ margin: '0 0 10px', fontWeight: 600, color: '#2d5016', fontSize: 14 }}>Order Summary</p>
            {cart.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555', padding: '4px 0' }}>
                <span>{item.name} × {item.qty}</span>
                <span>₹{getPrice(item.price) * item.qty}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555', padding: '4px 0', marginTop: 6, borderTop: '1px solid #c8e6c9', paddingTop: 8 }}>
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? '#16a34a' : '#555' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#2d5016', marginTop: 8 }}>
              <span>Total</span><span>₹{total}</span>
            </div>
          </div>

          {orderError && <p style={{ color: '#e53e3e', fontSize: 13, textAlign: 'center', margin: '0 0 16px', background: '#fff5f5', padding: '10px', borderRadius: 8 }}>{orderError}</p>}

          {/* Address Form */}
          <p style={{ margin: '0 0 16px', fontWeight: 600, color: '#333', fontSize: 15 }}>Delivery Address</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name *" style={{ ...inputStyle, borderColor: errors.name ? '#e53e3e' : '#ddd' }} />
              {errors.name && <p style={errorStyle}>{errors.name}</p>}
            </div>
            <div>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number *" type="tel" maxLength={10} style={{ ...inputStyle, borderColor: errors.phone ? '#e53e3e' : '#ddd' }} />
              {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
            </div>
            <div>
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address (for order confirmation)" type="email" style={{ ...inputStyle, borderColor: errors.email ? '#e53e3e' : '#ddd' }} />
              {errors.email && <p style={errorStyle}>{errors.email}</p>}
            </div>
            <div>
              <textarea name="address" value={form.address} onChange={handleChange} placeholder="Door No, Street, Area *" rows={3} style={{ ...inputStyle, resize: 'vertical', borderColor: errors.address ? '#e53e3e' : '#ddd' }} />
              {errors.address && <p style={errorStyle}>{errors.address}</p>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <input name="city" value={form.city} onChange={handleChange} placeholder="City *" style={{ ...inputStyle, borderColor: errors.city ? '#e53e3e' : '#ddd' }} />
                {errors.city && <p style={errorStyle}>{errors.city}</p>}
              </div>
              <div>
                <input name="state" value={form.state} onChange={handleChange} placeholder="State *" style={{ ...inputStyle, borderColor: errors.state ? '#e53e3e' : '#ddd' }} />
                {errors.state && <p style={errorStyle}>{errors.state}</p>}
              </div>
            </div>
            <div>
              <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode *" type="text" maxLength={6} style={{ ...inputStyle, borderColor: errors.pincode ? '#e53e3e' : '#ddd' }} />
              {errors.pincode && <p style={errorStyle}>{errors.pincode}</p>}
            </div>
            <input name="landmark" value={form.landmark} onChange={handleChange} placeholder="Nearby Landmark (e.g. Near Bus Stand, Opposite Temple)" style={inputStyle} />
          </div>

          <p style={{ color: '#888', fontSize: 11, textAlign: 'center', margin: '16px 0 0' }}>🚚 Free shipping on orders above ₹499. Delivery in 5-7 business days.</p>
          <p style={{ color: '#888', fontSize: 11, textAlign: 'center', margin: '4px 0 0' }}>⚠️ No returns or refunds on soaps due to hygiene reasons.</p>

          <button type="submit" style={{ width: '100%', marginTop: 16, background: '#2d5016', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            {`Proceed to Pay — ₹${total}${shipping > 0 ? ' (incl. ₹50 shipping)' : ''}`}
          </button>
        </form>
      </div>
    </div>
  )
}

const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }
const errorStyle = { margin: '4px 0 0', fontSize: 12, color: '#e53e3e' }

function ShippingPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '100px 20px 80px', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '50px 40px', boxShadow: '0 4px 30px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#2d5016', marginBottom: 30, textAlign: 'center' }}>🚚 Shipping & Returns</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#f0f7ec', borderRadius: 12, padding: '20px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#2d5016' }}>Shipping</h4>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#555', lineHeight: 1.8, fontSize: 14 }}>
              <li>Free shipping on orders above ₹499</li>
              <li>₹50 shipping charge for orders below ₹499</li>
              <li>Delivery within 5-7 business days across India</li>
              <li>You'll receive a tracking update via WhatsApp/SMS</li>
            </ul>
          </div>
          <div style={{ background: '#fff8f0', borderRadius: 12, padding: '20px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#c05621' }}>Returns & Refunds</h4>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#555', lineHeight: 1.8, fontSize: 14 }}>
              <li>No returns or refunds on soaps due to hygiene reasons</li>
              <li>If you receive a damaged product, contact us within 24 hours with photos</li>
              <li>Replacement will be sent for damaged items at no extra cost</li>
            </ul>
          </div>
          <div style={{ background: '#f0f4ff', borderRadius: 12, padding: '20px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#2b4acb' }}>Need Help?</h4>
            <p style={{ margin: 0, color: '#555', fontSize: 14, lineHeight: 1.8 }}>WhatsApp us at <strong>9176188117</strong> or email <strong>vanamsoaps@gmail.com</strong> for any order-related queries.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '100px 20px 80px', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '50px 40px', boxShadow: '0 4px 30px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <img src="/logo.png" alt="Vanam" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#2d5016', marginBottom: 10 }}>About Vanam</h2>
        <p style={{ color: '#666', lineHeight: 1.8, fontSize: 15, marginBottom: 20 }}>
          Vanam means "Forest" — and that's exactly where our inspiration comes from. We handcraft every soap using traditional methods and natural ingredients sourced from nature. No chemicals, no artificial fragrances — just pure, skin-loving goodness.
        </p>
        <p style={{ color: '#666', lineHeight: 1.8, fontSize: 15, marginBottom: 30 }}>
          Each bar is made with care to nourish your skin while being gentle on the environment. From Kuppameni to Aloe Vera, every ingredient is chosen for its healing properties.
        </p>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: '#fff', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          📸 Follow us on Instagram
        </a>
      </div>
    </div>
  )
}

function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '50px 40px', maxWidth: 500, width: '100%', boxShadow: '0 4px 30px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#2d5016', marginBottom: 10 }}>Contact Us</h2>
        <p style={{ color: '#666', marginBottom: 40 }}>We'd love to hear from you!</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15, padding: '16px 20px', background: '#f0f7ec', borderRadius: 12 }}>
            <span style={{ fontSize: 24 }}>📞</span>
            <div>
              <p style={{ margin: 0, color: '#888', fontSize: 12, fontWeight: 600 }}>Phone</p>
              <p style={{ margin: 0, color: '#2d5016', fontSize: 16, fontWeight: 500 }}>9176188117</p>
              <p style={{ margin: 0, color: '#2d5016', fontSize: 16, fontWeight: 500 }}>8608242337</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15, padding: '16px 20px', background: '#f0f7ec', borderRadius: 12 }}>
            <span style={{ fontSize: 24 }}>✉️</span>
            <div>
              <p style={{ margin: 0, color: '#888', fontSize: 12, fontWeight: 600 }}>Email</p>
              <p style={{ margin: 0, color: '#2d5016', fontSize: 16, fontWeight: 500 }}>vanamsoaps@gmail.com</p>
            </div>
          </div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 15, padding: '16px 20px', background: '#f0f7ec', borderRadius: 12, textDecoration: 'none' }}>
            <span style={{ fontSize: 24 }}>📸</span>
            <div>
              <p style={{ margin: 0, color: '#888', fontSize: 12, fontWeight: 600 }}>Instagram</p>
              <p style={{ margin: 0, color: '#2d5016', fontSize: 16, fontWeight: 500 }}>@____vanam___</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

function OrderSuccessPage({ orderId }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '50px 40px', maxWidth: 500, width: '100%', boxShadow: '0 4px 30px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <p style={{ fontSize: 60, margin: '0 0 16px' }}>🎉</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: '#2d5016', margin: '0 0 10px' }}>Thank You!</h2>
        <p style={{ color: '#2d5016', fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>Order ID: {orderId}</p>
        <div style={{ background: '#f0f7ec', borderRadius: 12, padding: '20px', marginBottom: 24, textAlign: 'left' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#333', fontSize: 14 }}>What happens next?</p>
          <ol style={{ margin: 0, paddingLeft: 20, color: '#555', fontSize: 14, lineHeight: 2 }}>
            <li>Send payment screenshot on WhatsApp</li>
            <li>We verify your payment (within 2-4 hours)</li>
            <li>Your order gets shipped in 1-2 days</li>
            <li>Delivery in 5-7 business days</li>
          </ol>
        </div>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! My order ID is ${orderId}. I want to check my order status.`} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-block', background: '#25d366', color: '#fff', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          💬 Track Order on WhatsApp
        </a>
      </div>
    </div>
  )
}

function NotFoundPage({ onHome }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 60, margin: '0 0 16px' }}>🔍</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#2d5016', margin: '0 0 10px' }}>Page Not Found</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>The page you're looking for doesn't exist.</p>
        <button onClick={onHome} style={{ background: '#2d5016', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>← Go Home</button>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#2d5016', color: '#fff', padding: '40px 20px', textAlign: 'center' }}>
      <img src="/logo.png" alt="Vanam" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginBottom: 12 }} />
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, margin: '0 0 8px' }}>Vanam Soaps</h3>
      <p style={{ opacity: 0.8, fontSize: 13, margin: '0 0 20px' }}>Handmade Natural Soaps from the Heart of Nature</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontSize: 14, opacity: 0.9 }}>📸 Instagram</a>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontSize: 14, opacity: 0.9 }}>💬 WhatsApp</a>
      </div>
      <p style={{ opacity: 0.5, fontSize: 12, margin: 0 }}>© {new Date().getFullYear()} Vanam Soaps. All rights reserved.</p>
    </footer>
  )
}
