import { useEffect, useRef, useState } from "react";
import {
  motion,
//   AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  ChefHat,
  CreditCard,
  MessageCircle,
  ScanLine,
  ShoppingBag,
  Sparkles,
  Utensils,
  Wallet,
  Zap,
} from "lucide-react";
import "./StoryExperience.css";

const chapters = [
  {
    id: "rush",
    number: "01",
    label: "THE EVERYDAY RUSH",
    eyebrow: "SOUND FAMILIAR?",
    title: "You opened a restaurant. Not a traffic control room.",
    description:
      "One table needs the menu. Another wants to know where their order is. The kitchen needs clarification. And someone is waiting for the bill.",
    emphasis: "You are serving people. But spending your time chasing orders.",
    sceneTitle: "The lunch rush",
    sceneSubtitle: "Everything needs your attention. At once.",
  },
  {
    id: "pressure",
    number: "02",
    label: "THE HIDDEN PRESSURE",
    eyebrow: "IT ADDS UP",
    title: "It's not one big problem. It's a hundred little interruptions.",
    description:
      "Orders come from different places. Payments need checking. The kitchen waits for updates. Your team keeps asking the same questions.",
    emphasis: "The real cost isn't just time. It's the attention you never get back.",
    sceneTitle: "A hundred little interruptions",
    sceneSubtitle: "Disconnected tasks. One very busy team.",
  },
  {
    id: "shift",
    number: "03",
    label: "THE SIMPLE SHIFT",
    eyebrow: "A BETTER WAY STARTS HERE",
    title: "What if everything started with one scan?",
    description:
      "A customer scans the table QR, explores your menu, chooses what they want and places an order. No waiting for someone to take it down.",
    emphasis: "One familiar action. A much smoother beginning.",
    sceneTitle: "One scan changes the flow",
    sceneSubtitle: "A simpler experience for every table.",
  },
  {
    id: "kitchen",
    number: "04",
    label: "EVERYONE IN SYNC",
    eyebrow: "CONNECTED BY DESIGN",
    title: "The kitchen knows. The customer knows. Your team knows.",
    description:
      "Orders move into the kitchen queue. Your team can follow progress, while customers can see what is happening with their order.",
    emphasis: "Fewer follow-ups. Clearer communication. Better flow.",
    sceneTitle: "One connected flow",
    sceneSubtitle: "From table to kitchen to customer.",
  },
  {
    id: "relief",
    number: "05",
    label: "THE DIFFERENCE",
    eyebrow: "THIS IS WHAT IT'S ALL ABOUT",
    title: "You get to focus on the restaurant again.",
    description:
      "Less time coordinating every little thing. More time welcoming guests, caring about the food and growing the place you built.",
    emphasis: "You take care of the food. Let QRToken take care of the flow.",
    sceneTitle: "Room to do what you love",
    sceneSubtitle: "A calmer way to run your restaurant.",
  },
];

const spring = {
  type: "spring",
  stiffness: 110,
  damping: 20,
};

function RushScene() {
  const tickets = [
    { table: "TABLE 04", item: "2 × Masala Dosa", time: "08:42", color: "orange" },
    { table: "TABLE 09", item: "1 × Cold Coffee", time: "08:38", color: "red" },
    { table: "TABLE 02", item: "3 × Paneer Wrap", time: "08:31", color: "gold" },
  ];

  return (
    <div className="qt-scene qt-rush-scene">
      <div className="qt-scene-topline">
        <span><span className="qt-live-dot" /> LIVE SERVICE</span>
        <span>12:42 PM</span>
      </div>

      <div className="qt-rush-stats">
        <div>
          <span>WAITING ORDERS</span>
          <strong>08</strong>
        </div>
        <div>
          <span>TABLES ACTIVE</span>
          <strong>12</strong>
        </div>
        <div>
          <span>NEEDS ATTENTION</span>
          <strong className="qt-alert-number">03</strong>
        </div>
      </div>

      <div className="qt-ticket-stack">
        {tickets.map((ticket, index) => (
          <motion.div
            className={`qt-ticket qt-ticket-${ticket.color}`}
            key={ticket.table}
            initial={{ opacity: 0, x: 35, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ ...spring, delay: index * 0.13 }}
          >
            <div className="qt-ticket-head">
              <span>{ticket.table}</span>
              <span>{ticket.time}</span>
            </div>
            <strong>{ticket.item}</strong>
            <div className="qt-ticket-bottom">
              <span>Order received</span>
              <span className="qt-ticket-pulse" />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="qt-floating-alert qt-alert-one"
        animate={{ y: [0, -7, 0], rotate: [-2, 0, -2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <MessageCircle size={15} />
        <span>Where is my order?</span>
      </motion.div>

      <motion.div
        className="qt-floating-alert qt-alert-two"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Bell size={15} />
        <span>Table 06 needs a bill</span>
      </motion.div>

      <div className="qt-rush-footer">
        <AlertCircle size={15} />
        <span>Too many things. Not enough hands.</span>
      </div>
    </div>
  );
}

function PressureScene() {
  const fragments = [
    {
      icon: ShoppingBag,
      title: "Orders",
      text: "Written down manually",
      className: "qt-fragment-orders",
    },
    {
      icon: CreditCard,
      title: "Payments",
      text: "Checked separately",
      className: "qt-fragment-payments",
    },
    {
      icon: MessageCircle,
      title: "Communication",
      text: "Constant follow-ups",
      className: "qt-fragment-chat",
    },
    {
      icon: ChefHat,
      title: "Kitchen",
      text: "Waiting for updates",
      className: "qt-fragment-kitchen",
    },
  ];

  return (
    <div className="qt-scene qt-pressure-scene">
      <div className="qt-scene-topline">
        <span>THE OLD WAY</span>
        <span className="qt-disconnected-label">DISCONNECTED</span>
      </div>

      <div className="qt-fragment-canvas">
        <svg className="qt-fragment-lines" viewBox="0 0 500 390" aria-hidden="true">
          <path d="M250 190 L100 85" />
          <path d="M250 190 L400 85" />
          <path d="M250 190 L100 300" />
          <path d="M250 190 L400 300" />
          <path d="M100 85 L400 300" />
          <path d="M400 85 L100 300" />
        </svg>

        <motion.div
          className="qt-fragment-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <AlertCircle size={24} />
          <span>YOU</span>
        </motion.div>

        {fragments.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              className={`qt-fragment-card ${item.className}`}
              initial={{ opacity: 0, scale: 0.75, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ ...spring, delay: index * 0.12 }}
            >
              <span className="qt-fragment-icon"><Icon size={17} /></span>
              <strong>{item.title}</strong>
              <small>{item.text}</small>
              <span className="qt-fragment-warning">Needs attention</span>
            </motion.div>
          );
        })}
      </div>

      <div className="qt-pressure-bottom">
        <span>ORDERS</span>
        <ArrowRight size={13} />
        <span>PAYMENTS</span>
        <ArrowRight size={13} />
        <span>KITCHEN</span>
        <ArrowRight size={13} />
        <span>YOU</span>
      </div>
    </div>
  );
}

function PhoneScene() {
  return (
    <div className="qt-scene qt-phone-scene">
      <div className="qt-phone-orbit qt-orbit-one" />
      <div className="qt-phone-orbit qt-orbit-two" />

      <motion.div
        className="qt-phone"
        initial={{ opacity: 0, y: 40, rotate: 5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={spring}
      >
        <div className="qt-phone-notch" />
        <div className="qt-phone-screen">
          <div className="qt-phone-brand">
            <span className="qt-mini-brand">Q</span>
            <div>
              <strong>Shree Krishna</strong>
              <small>Fresh food, made with care</small>
            </div>
            <span className="qt-phone-menu">•••</span>
          </div>

          <div className="qt-phone-welcome">
            <span>GOOD AFTERNOON</span>
            <h4>Good food.<br /><em>Good moments.</em></h4>
            <p>Explore our menu and order at your pace.</p>
          </div>

          <div className="qt-phone-category">
            <span className="active">Popular</span>
            <span>Snacks</span>
            <span>Drinks</span>
          </div>

          <div className="qt-phone-food">
            <div className="qt-food-thumb qt-food-one"><Utensils size={19} /></div>
            <div className="qt-food-info">
              <strong>Masala Dosa</strong>
              <small>Crispy · South Indian</small>
              <b>₹120</b>
            </div>
            <button type="button" tabIndex={-1}>ADD +</button>
          </div>

          <div className="qt-phone-food">
            <div className="qt-food-thumb qt-food-two"><Sparkles size={19} /></div>
            <div className="qt-food-info">
              <strong>Paneer Sandwich</strong>
              <small>Fresh · Delicious</small>
              <b>₹150</b>
            </div>
            <button type="button" tabIndex={-1}>ADD +</button>
          </div>

          <div className="qt-phone-food">
            <div className="qt-food-thumb qt-food-three"><Wallet size={19} /></div>
            <div className="qt-food-info">
              <strong>Cold Coffee</strong>
              <small>Chilled · Creamy</small>
              <b>₹90</b>
            </div>
            <button type="button" tabIndex={-1}>ADD +</button>
          </div>

          <div className="qt-phone-cart">
            <span>2 ITEMS · ₹270</span>
            <strong>View cart <ArrowRight size={13} /></strong>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="qt-scan-float"
        animate={{ y: [0, -9, 0], rotate: [-3, 1, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span><ScanLine size={17} /></span>
        <div><strong>Scan. Browse. Order.</strong><small>That's all it takes.</small></div>
        <Check size={17} />
      </motion.div>

      <motion.div
        className="qt-order-float"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="qt-order-check"><Check size={13} /></span>
        <div><strong>Order placed</strong><small>Sent to the kitchen</small></div>
      </motion.div>
    </div>
  );
}

function KitchenScene() {
  const orders = [
    { id: "#1042", table: "TABLE 04", name: "Masala Dosa", qty: "× 2", status: "PREPARING", tone: "preparing" },
    { id: "#1043", table: "TABLE 08", name: "Paneer Sandwich", qty: "× 1", status: "NEW ORDER", tone: "new" },
    { id: "#1044", table: "TABLE 02", name: "Cold Coffee", qty: "× 3", status: "READY", tone: "ready" },
  ];

  return (
    <div className="qt-scene qt-kitchen-scene">
      <div className="qt-kitchen-top">
        <div>
          <span className="qt-scene-index">KITCHEN DISPLAY</span>
          <h4>Order queue</h4>
        </div>
        <span className="qt-kitchen-online"><span /> LIVE</span>
      </div>

      <div className="qt-kitchen-metrics">
        <div><strong>03</strong><span>Active orders</span></div>
        <div><strong>08<span>m</span></strong><span>Avg. prep time</span></div>
        <div><strong>12</strong><span>Completed</span></div>
      </div>

      <div className="qt-kitchen-orders">
        {orders.map((order, index) => (
          <motion.div
            className="qt-kitchen-order"
            key={order.id}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: index * 0.16 }}
          >
            <div className="qt-kitchen-order-top">
              <strong>{order.id}</strong>
              <span>{order.table}</span>
            </div>
            <div className="qt-kitchen-order-main">
              <span className={`qt-order-symbol ${order.tone}`}>
                {order.tone === "ready" ? <Check size={16} /> : <Utensils size={16} />}
              </span>
              <strong>{order.name}</strong>
              <b>{order.qty}</b>
            </div>
            <div className="qt-kitchen-order-bottom">
              <span className={`qt-order-status ${order.tone}`}>{order.status}</span>
              <span>{index === 0 ? "04:12" : index === 1 ? "01:35" : "06:48"}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="qt-kitchen-sync"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <div className="qt-sync-icon"><Zap size={16} /></div>
        <div><strong>Everyone is in sync</strong><small>Orders move. Updates follow.</small></div>
        <Check size={17} />
      </motion.div>
    </div>
  );
}

function ReliefScene() {
  const orbitItems = [
    { icon: ShoppingBag, title: "Orders", detail: "Organised" },
    { icon: CreditCard, title: "Payments", detail: "Clear" },
    { icon: ChefHat, title: "Kitchen", detail: "Connected" },
    { icon: BarChart3, title: "Insights", detail: "In view" },
  ];

  return (
    <div className="qt-scene qt-relief-scene">
      <div className="qt-relief-glow" />

      <motion.div
        className="qt-relief-core"
        animate={{ scale: [1, 1.035, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="qt-relief-logo">Q</div>
        <strong>QRToken</strong>
        <span>THE FLOW, TAKEN CARE OF.</span>
      </motion.div>

      <div className="qt-relief-orbit">
        {orbitItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              className={`qt-relief-node qt-relief-node-${index + 1}`}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: index * 0.12 }}
            >
              <span><Icon size={18} /></span>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="qt-relief-note"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      >
        <Sparkles size={15} />
        <span>More time for what matters.</span>
      </motion.div>
    </div>
  );
}

function SceneVisual({ active }) {
  const chapter = chapters[active] ?? chapters[0];

  const sceneMap = {
    rush: <RushScene />,
    pressure: <PressureScene />,
    shift: <PhoneScene />,
    kitchen: <KitchenScene />,
    relief: <ReliefScene />,
  };

  return (
    <div className={`qt-story-stage qt-stage-${chapter.id}`}>
      <div className="qt-stage-decoration qt-stage-decoration-one" />
      <div className="qt-stage-decoration qt-stage-decoration-two" />

      <div className="qt-scene-heading">
        <span className="qt-scene-index">
          QRTOKEN / {chapter.number}
        </span>
        <h3>{chapter.sceneTitle}</h3>
        <p>{chapter.sceneSubtitle}</p>
      </div>

      <div className="qt-scene-transition">
        {sceneMap[chapter.id]}
      </div>

      <div className="qt-stage-caption">
        <span className="qt-stage-caption-dot" />
        <span>THE QRToken EXPERIENCE</span>
        <span className="qt-stage-caption-line" />
        <span>{chapter.number} / 05</span>
      </div>
    </div>
  );
}

export default function StoryExperience() {
  const railRef = useRef(null);
  const panelRefs = useRef([]);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let frame = 0;

    const updateActive = () => {
      if (frame) cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const railRect = rail.getBoundingClientRect();
        const railCenter = railRect.left + railRect.width / 2;

        let closest = 0;
        let distance = Infinity;

        panelRefs.current.forEach((panel, index) => {
          if (!panel) return;

          const rect = panel.getBoundingClientRect();
          const center = rect.left + rect.width / 2;
          const nextDistance = Math.abs(center - railCenter);

          if (nextDistance < distance) {
            distance = nextDistance;
            closest = index;
          }
        });

        setActive((previous) => previous === closest ? previous : closest);
        frame = 0;
      });
    };

    rail.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    updateActive();

    return () => {
      rail.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);

      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

const goToChapter = (index) => {
  const rail = railRef.current;
  const panel = panelRefs.current[index];

  if (!rail || !panel) return;

  rail.scrollTo({
    left: panel.offsetLeft - rail.offsetLeft,
    behavior: reduceMotion ? "auto" : "smooth",
  });
};

  const moveChapter = (direction) => {
    const nextIndex = Math.min(
      chapters.length - 1,
      Math.max(0, active + direction)
    );

    goToChapter(nextIndex);
  };

  return (
    <section className="qt-story" id="our-story">
      <div className="qt-story-intro">
        <motion.span
          className="qt-story-kicker"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.6 }}
        >
          A BETTER WAY TO RUN YOUR RESTAURANT
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.08 }}
        >
          Behind every great meal
          <br />
          is a <span>better experience.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.16 }}
        >
          And behind that experience is a team that deserves a smoother way
          to work.
        </motion.p>
      </div>

      <div className="qt-horizontal-story">
        <div className="qt-story-rail-top">
          <div className="qt-story-rail-label">
            <span>THE QRToken JOURNEY</span>
            <strong>0{active + 1}<i>/</i>05</strong>
          </div>

          <div className="qt-story-controls">
            <button
              type="button"
              onClick={() => moveChapter(-1)}
              disabled={active === 0}
              aria-label="Previous chapter"
            >
              <ArrowLeft size={17} />
            </button>

            <button
              type="button"
              onClick={() => moveChapter(1)}
              disabled={active === chapters.length - 1}
              aria-label="Next chapter"
            >
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        <div className="qt-story-rail" ref={railRef}>
          {chapters.map((chapter, index) => (
            <article
              className={`qt-horizontal-panel ${active === index ? "is-active" : ""}`}
              key={chapter.id}
              ref={(node) => {
                panelRefs.current[index] = node;
              }}
              aria-label={`Chapter ${chapter.number}: ${chapter.label}`}
            >
              <div className="qt-horizontal-copy">
                <div className="qt-horizontal-number">{chapter.number}</div>

                <span className="qt-chapter-label">{chapter.label}</span>

                <h3>{chapter.title}</h3>

                <p>{chapter.description}</p>

                <div className="qt-chapter-emphasis">
                  <span />
                  {chapter.emphasis}
                </div>

                <div className="qt-horizontal-hint">
                  <span>KEEP EXPLORING</span>
                  <ArrowRight size={14} />
                </div>
              </div>

             <div className="qt-horizontal-visual">
  {active === index ? (
    <SceneVisual active={index} />
  ) : (
    <div className="qt-story-visual-placeholder" />
  )}
</div>
            </article>
          ))}
        </div>

        <div className="qt-story-rail-bottom">
          

          <div className="qt-rail-bottom-row">
           

            <div className="qt-progress-dots">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  type="button"
                  className={active === index ? "active" : ""}
                  onClick={() => goToChapter(index)}
                  aria-label={`Go to chapter ${index + 1}`}
                  aria-current={active === index ? "step" : undefined}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}