
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowDown, ArrowRight, ArrowUpRight, BarChart3, Check,
  ChefHat, CreditCard, Globe2, Menu, ReceiptText, ScanLine,
  ShieldCheck, Smartphone, Utensils, Wallet, X, Zap,
  Clock3, Sparkles
} from "lucide-react";

import StoryExperience from "./StoryExperience";
import "./LandingPage.css";

const PRODUCTION = "https://qrtoken-app.vercel.app";

const LINKS = {
  customer: `${PRODUCTION}/shop/shree-krishna-tea-stall`,
  owner: `${PRODUCTION}/owner`,
  admin: `${PRODUCTION}/admin/login`,
};

const EASE = [0.22, 1, 0.36, 1];

const features = [
  {
    icon: ScanLine,
    number: "01",
    title: "Scan. Order. Pay. Track.",
    description: "Customers scan a table QR code, explore the menu and place an order instantly. No app installation required.",
    tag: "CUSTOMER EXPERIENCE",
  },
  {
    icon: CreditCard,
    number: "02",
    title: "Flexible Digital Payments",
    description: "Accept Razorpay-powered UPI and card payments alongside cash orders with a streamlined checkout.",
    tag: "PAYMENT EXPERIENCE",
  },
  {
    icon: ChefHat,
    number: "03",
    title: "Kitchen Display System",
    description: "Keep kitchen teams connected with organized order queues, status updates and a clearer workflow.",
    tag: "KITCHEN OPERATIONS",
  },
  {
    icon: ReceiptText,
    number: "04",
    title: "Billing & GST Invoices",
    description: "Simplify billing with structured receipts, tax calculations and clear transaction records.",
    tag: "SMART BILLING",
  },
  {
    icon: Globe2,
    number: "05",
    title: "Regional Language Support",
    description: "Make ordering more accessible with a customer experience designed for India's diverse food businesses.",
    tag: "MADE FOR INDIA",
  },
  {
    icon: BarChart3,
    number: "06",
    title: "Business Intelligence",
    description: "Understand orders, sales and outlet activity through a centralized operational dashboard.",
    tag: "BUSINESS INSIGHTS",
  },
];

const workflow = [
  { icon: ScanLine, step: "01", title: "Scan the QR", description: "A table QR code opens the restaurant's digital menu." },
  { icon: Smartphone, step: "02", title: "Place an order", description: "Customers select items and submit their order." },
  { icon: Wallet, step: "03", title: "Complete payment", description: "Choose a supported digital payment method or cash." },
  { icon: ChefHat, step: "04", title: "Kitchen prepares", description: "The team receives the order and updates its status." },
  { icon: Check, step: "05", title: "Serve the order", description: "Customers can follow their order progress." },
];

const plans = [
  {
    name: "Starter",
    description: "A simple starting point for small outlets.",
    price: "₹0",
    period: "",
    features: [
      "QR menu and cash orders",
      "Up to 100 orders / month",
      "Kitchen queue access",
      "Basic order reporting",
    ],
    button: "Get Started",
    link: LINKS.customer,
  },
  {
    name: "Growth",
    description: "For busy restaurants ready to scale.",
    price: "₹999",
    period: "/ month",
    features: [
      "Unlimited monthly orders",
      "Razorpay UPI and cash payments",
      "Regional language support",
      "GST billing and reports",
      "Advanced order management",
    ],
    button: "Explore Customer Demo",
    link: LINKS.customer,
    featured: true,
  },
  {
    name: "Enterprise",
    description: "For multi-outlet operations and larger teams.",
    price: "₹2,499",
    period: "/ month",
    features: [
      "Multi-outlet management",
      "Custom domain support",
      "Dedicated account management",
      "Centralized operations",
      "Priority support",
    ],
    button: "Merchant Login",
    link: LINKS.owner,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

function Brand() {
  return (
    <a href="#home" className="qt-brand">
      <span className="qt-brand-mark">Q</span>
      <span>QRToken<span className="qt-brand-dot">.in</span></span>
    </a>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const navItems = [
    ["Our Story", "#our-story"],
    ["Features", "#features"],
    ["How it works", "#how-it-works"],
    ["ROI Calculator", "#roi"],
    ["Pricing", "#pricing"],
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.header
      className="qt-navbar"
      initial={reduceMotion ? false : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: EASE }}
    >
      <div className="qt-nav-inner">
        <Brand />

        <nav className={`qt-nav-links ${menuOpen ? "open" : ""}`}>
          {navItems.map(([label, href]) => (
            <a key={label} href={href} onClick={closeMenu}>
              {label}
            </a>
          ))}

          <a className="qt-mobile-link" href={LINKS.owner}>
            Merchant Login <ArrowUpRight size={15} />
          </a>
          <a className="qt-mobile-link" href={LINKS.admin}>
            Super Admin <ArrowUpRight size={15} />
          </a>
        </nav>

        <div className="qt-nav-actions">
          <a href={LINKS.owner} className="qt-nav-login">Merchant Login</a>
          <a href={LINKS.admin} className="qt-nav-admin">
            Super Admin <ArrowUpRight size={14} />
          </a>
        </div>

        <button
          className="qt-menu-toggle"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={menuOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </motion.header>
  );
}

function HeroPreview() {
  const reduceMotion = useReducedMotion();

  const menuItems = [
    { icon: Utensils, name: "Masala Sandwich", detail: "Freshly prepared", price: "₹85" },
    { icon: Zap, name: "Cold Coffee", detail: "Customer favourite", price: "₹90" },
    { icon: ChefHat, name: "Paneer Wrap", detail: "Made fresh to order", price: "₹120" },
  ];

  return (
    <motion.div
      className="qt-hero-visual"
      initial={reduceMotion ? false : { opacity: 0, y: 35, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
    >
      <div className="qt-hero-orbit qt-orbit-one" />
      <div className="qt-hero-orbit qt-orbit-two" />
      <div className="qt-hero-glow" />

      <motion.div
        className="qt-floating-note qt-note-top"
        animate={reduceMotion ? {} : { y: [0, -9, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <span className="qt-note-icon"><Zap size={17} /></span>
        <span><strong>Order received</strong><small>Table 08 · Just now</small></span>
        <i />
      </motion.div>

      <motion.div
        className="qt-device"
        whileHover={reduceMotion ? {} : { y: -7, rotate: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="qt-device-top">
          <span className="qt-device-dots"><i /><i /><i /></span>
          <span>QRTOKEN / DIGITAL MENU</span>
          <span className="qt-device-live"><i /> LIVE</span>
        </div>

        <div className="qt-device-body">
          <span className="qt-device-kicker">YOUR TABLE · 08</span>
          <h3>Good food.<br /><em>Good moments.</em></h3>
          <p>Explore the menu and order your favourites.</p>

          <div className="qt-menu-tabs">
            <span className="active">Popular</span>
            <span>Snacks</span>
            <span>Beverages</span>
          </div>

          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                className="qt-menu-item"
                key={item.name}
                initial={reduceMotion ? false : { opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.12 }}
              >
                <span className={`qt-food-icon food-${index + 1}`}>
                  <Icon size={22} />
                </span>
                <span className="qt-food-info">
                  <strong>{item.name}</strong>
                  <small>{item.detail}</small>
                </span>
                <b>{item.price}</b>
              </motion.div>
            );
          })}

          <div className="qt-device-cart">
            <span>3 items · Table 08</span>
            <strong>View Cart <ArrowRight size={15} /></strong>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="qt-floating-note qt-note-bottom"
        animate={reduceMotion ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity }}
      >
        <span className="qt-note-icon success"><Check size={17} /></span>
        <span><strong>Payment successful</strong><small>₹295 · Order #QT0824</small></span>
      </motion.div>
    </motion.div>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="qt-hero" id="home">
      <div className="qt-hero-grid">
        <motion.div
          className="qt-hero-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="qt-eyebrow">
            <i /> SMART RESTAURANT OPERATIONS
          </span>

          <h1>
            Every table.<br />
            A smarter way to <span>serve.</span>
          </h1>

          <p className="qt-hero-description">
            Transform the way your restaurant takes orders.
            QR-based menus, seamless payments and connected
            kitchen operations — all in one platform.
          </p>

          <div className="qt-hero-actions">
            <motion.a
              href={LINKS.customer}
              className="qt-button qt-button-primary"
              whileHover={reduceMotion ? {} : { y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Live Demo <ArrowUpRight size={17} />
            </motion.a>

            <motion.a
              href="#our-story"
              className="qt-button qt-button-outline"
              whileHover={reduceMotion ? {} : { y: -4 }}
            >
              Discover QRToken <ArrowDown size={16} />
            </motion.a>
          </div>

          <div className="qt-hero-proof">
            <span><ShieldCheck size={16} /> No app download required</span>
            <span><Zap size={16} /> Simple digital ordering</span>
          </div>
        </motion.div>

        <HeroPreview />
      </div>

      <div className="qt-hero-bottom">
        <span>BUILT FOR THE NEXT GENERATION OF FOOD BUSINESSES</span>
        <span>SCROLL TO EXPLORE <ArrowDown size={13} /></span>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    ["01", "QR-based ordering", "A simpler customer journey"],
    ["02", "Connected operations", "From table to kitchen"],
    ["03", "Flexible payments", "Digital and cash workflows"],
    ["04", "Business visibility", "One operational view"],
  ];

  return (
    <motion.section
      className="qt-trust-strip"
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {items.map(([number, title, detail]) => (
        <motion.div className="qt-trust-item" variants={fadeUp} key={number}>
          <span className="qt-trust-number">{number}</span>
          <div><strong>{title}</strong><small>{detail}</small></div>
        </motion.div>
      ))}
    </motion.section>
  );
}

function SectionHeading({ eyebrow, title, accent, description, light = false }) {
  return (
    <Reveal className={`qt-section-heading ${light ? "light" : ""}`}>
      <span className="qt-section-eyebrow">{eyebrow}</span>
      <h2>{title} <em>{accent}</em></h2>
      <p>{description}</p>
    </Reveal>
  );
}

function Features() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="qt-section qt-features-section" id="features">
      <SectionHeading
        eyebrow="THE QRToken ECOSYSTEM"
        title="Everything your outlet needs."
        accent="Nothing it doesn't."
        description="A connected digital experience designed around the real workflows of food and beverage businesses."
      />

      <div className="qt-feature-layout">
        <Reveal className="qt-feature-intro">
          <span className="qt-feature-intro-mark"><Sparkles size={19} /></span>
          <span className="qt-feature-intro-kicker">ONE PLATFORM. CONNECTED WORKFLOWS.</span>
          <h3>Less friction.<br /><em>More flow.</em></h3>
          <p>Bring your customer ordering journey and restaurant operations into one connected experience.</p>
          <a href={LINKS.customer}>Explore the experience <ArrowUpRight size={16} /></a>
        </Reveal>

        <motion.div
          className="qt-feature-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map(({ icon: Icon, number, title, description, tag }) => (
            <motion.article
              className="qt-feature-card"
              key={number}
              variants={fadeUp}
              whileHover={reduceMotion ? {} : { y: -7 }}
            >
              <div className="qt-feature-card-top">
                <span className="qt-feature-icon"><Icon size={21} /></span>
                <span>{number}</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="qt-feature-tag">{tag}</span>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Workflow() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="qt-workflow-section" id="how-it-works">
      <div className="qt-workflow-inner">
        <SectionHeading
          light
          eyebrow="A CONNECTED EXPERIENCE"
          title="From scan to serve."
          accent="Effortlessly."
          description="One streamlined journey connects your customers, payment flow and kitchen team."
        />

        <div className="qt-workflow-track">
          <div className="qt-workflow-line" />
          {workflow.map(({ icon: Icon, step, title, description }, index) => (
            <motion.article
              className="qt-workflow-card"
              key={step}
              initial={reduceMotion ? false : { opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.6 }}
              whileHover={reduceMotion ? {} : { y: -6 }}
            >
              <span className="qt-workflow-icon"><Icon size={22} /></span>
              <span className="qt-workflow-step">STEP {step}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.article>
          ))}
        </div>

        <Reveal className="qt-workflow-footer">
          <span>See the customer experience in action.</span>
          <a href={LINKS.customer}>Open live demo <ArrowUpRight size={16} /></a>
        </Reveal>
      </div>
    </section>
  );
}

function ROICalculator() {
  const [orders, setOrders] = useState(120);
  const [ticket, setTicket] = useState(85);

  const monthly = orders * ticket * 30;
  const annual = monthly * 12;

  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <section className="qt-section qt-roi-section" id="roi">
      <Reveal className="qt-roi-panel">
        <div className="qt-roi-heading">
          <span className="qt-section-eyebrow">THE BUSINESS CASE</span>
          <h2>See the numbers.<br /><em>Plan your next move.</em></h2>
          <p>Explore your estimated sales volume using your outlet's daily order numbers.</p>
        </div>

        <div className="qt-roi-content">
          <div className="qt-roi-controls">
            <div className="qt-range-field">
              <div className="qt-range-label">
                <label htmlFor="qt-orders">Daily orders</label>
                <strong>{orders} orders / day</strong>
              </div>
              <input
                id="qt-orders"
                type="range"
                min="10"
                max="500"
                step="10"
                value={orders}
                onChange={(e) => setOrders(Number(e.target.value))}
              />
              <div className="qt-range-limits"><span>10 orders</span><span>500 orders</span></div>
            </div>

            <div className="qt-range-field">
              <div className="qt-range-label">
                <label htmlFor="qt-ticket">Average order value</label>
                <strong>{formatINR(ticket)}</strong>
              </div>
              <input
                id="qt-ticket"
                type="range"
                min="30"
                max="1000"
                step="5"
                value={ticket}
                onChange={(e) => setTicket(Number(e.target.value))}
              />
              <div className="qt-range-limits"><span>₹30</span><span>₹1,000</span></div>
            </div>

            <div className="qt-calculator-note">
              <Clock3 size={16} />
              Calculated using 30 operating days per month.
            </div>
          </div>

          <motion.div className="qt-roi-result" layout>
            <span className="qt-result-kicker">YOUR ESTIMATED SALES VOLUME</span>
            <span className="qt-result-label">MONTHLY</span>
            <AnimatePresence mode="wait">
              <motion.strong
                key={monthly}
                className="qt-result-value"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {formatINR(monthly)}
              </motion.strong>
            </AnimatePresence>

            <div className="qt-result-divider" />

            <span className="qt-result-label">ANNUAL</span>
            <strong className="qt-result-annual">{formatINR(annual)}</strong>

            <p>This is an illustrative sales estimate, not a guaranteed saving or revenue uplift.</p>
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}

function Pricing() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="qt-section qt-pricing-section" id="pricing">
      <SectionHeading
        eyebrow="STRAIGHTFORWARD PLANS"
        title="Choose your pace."
        accent="Grow your way."
        description="Explore the plan structure and find a starting point for your outlet."
      />

      <motion.div
        className="qt-pricing-grid"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {plans.map((plan) => (
          <motion.article
            className={`qt-plan-card ${plan.featured ? "featured" : ""}`}
            key={plan.name}
            variants={fadeUp}
            whileHover={reduceMotion ? {} : { y: -8 }}
          >
            {plan.featured && <span className="qt-plan-badge">MOST POPULAR</span>}

            <div className="qt-plan-heading">
              <span>{plan.name}</span>
              <p>{plan.description}</p>
            </div>

            <div className="qt-plan-price">
              <strong>{plan.price}</strong>
              <span>{plan.period}</span>
            </div>

            <div className="qt-plan-divider" />

            <span className="qt-plan-includes">WHAT'S INCLUDED</span>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}><Check size={16} /> {feature}</li>
              ))}
            </ul>

            <a
              href={plan.link}
              className={`qt-button ${plan.featured ? "qt-button-primary" : "qt-button-outline"}`}
            >
              {plan.button} <ArrowUpRight size={16} />
            </a>
          </motion.article>
        ))}
      </motion.div>

      <Reveal className="qt-pricing-note">
        Pricing shown is illustrative. Confirm plan availability and commercial terms with the QRToken team.
      </Reveal>
    </section>
  );
}

function FinalCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="qt-final-cta">
      <div className="qt-final-pattern" />
      <motion.div
        className="qt-final-glow"
        animate={reduceMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <Reveal className="qt-final-content">
        <span className="qt-final-eyebrow">YOUR TABLE. YOUR BUSINESS. YOUR NEXT STEP.</span>
        <h2>Ready to rethink<br />the way you <em>serve?</em></h2>
        <p>Experience the QRToken ordering journey for yourself.</p>

        <div className="qt-final-actions">
          <a href={LINKS.customer} className="qt-button qt-button-primary">
            Explore Live Demo <ArrowUpRight size={17} />
          </a>
          <a href={LINKS.owner} className="qt-button qt-button-light">
            Merchant Login
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="qt-footer">
      <div className="qt-footer-main">
        <div className="qt-footer-brand">
          <Brand />
          <p>A smarter digital ordering experience for modern food businesses.</p>
        </div>

        <div className="qt-footer-column">
          <strong>EXPLORE</strong>
          <a href="#our-story">Our Story</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#roi">ROI Calculator</a>
          <a href="#pricing">Pricing</a>
        </div>

        <div className="qt-footer-column">
          <strong>PLATFORM</strong>
          <a href={LINKS.customer}>Customer Demo</a>
          <a href={LINKS.owner}>Merchant Login</a>
          <a href={LINKS.admin}>Super Admin</a>
        </div>

        <div className="qt-footer-column qt-footer-contact">
          <strong>THE QRToken EXPERIENCE</strong>
          <p>Smarter ordering.<br />Simpler operations.</p>
          <a href={LINKS.customer}>Experience the platform <ArrowUpRight size={14} /></a>
        </div>
      </div>

      <div className="qt-footer-bottom">
        <span>© {new Date().getFullYear()} QRToken.in. All rights reserved.</span>
        <span>Designed for smarter restaurant operations.</span>
        <a href="#home">BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  useEffect(() => {
    document.title = "QRToken.in | Smart Digital Ordering for Restaurants";

    const description =
      "QRToken helps restaurants simplify QR-based ordering, payments and kitchen operations.";

    let meta = document.querySelector('meta[name="description"]');

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.content = description;
  }, []);

  return (
    <div className="qt-landing">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <StoryExperience />
        <Features />
        <Workflow />
        <ROICalculator />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
