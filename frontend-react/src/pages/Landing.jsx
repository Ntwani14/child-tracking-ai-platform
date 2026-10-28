import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styles from "./Landing.module.css";

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  return (
    <div className={styles.page}>

      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <span className={styles.navIcon}>🔍</span>
          <span>Missing Children System</span>
        </div>
        <div className={styles.navLinks}>
          <Link to="/login" className={styles.navLogin}>Sign In</Link>
          <Link to="/register" className={styles.navRegister}>Join Community</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>🇿🇦 South Africa</div>
          <h1 className={styles.heroTitle}>
            Every Second Counts.<br />
            <span className={styles.heroAccent}>Help Find Missing Children.</span>
          </h1>
          <p className={styles.heroSub}>
            A centralized AI-powered platform for South African communities to report,
            track and share information about missing children — faster than ever before.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>1,697</span>
              <span className={styles.heroStatLabel}>Children reported missing annually</span>
            </div>
            <div className={styles.heroStatDiv} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>1 in 5hrs</span>
              <span className={styles.heroStatLabel}>A child goes missing every 5 hours</span>
            </div>
            <div className={styles.heroStatDiv} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>30%</span>
              <span className={styles.heroStatLabel}>Faster response with our platform</span>
            </div>
          </div>
          <div className={styles.heroCTA}>
            <Link to="/register" className={styles.ctaPrimary}>Get Started — It's Free</Link>
            <Link to="/login" className={styles.ctaSecondary}>Sign In</Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardHeader}>
              <span className={styles.liveIndicator}>🔴 LIVE</span>
              <span>Active Reports</span>
            </div>
            <div className={styles.mockReport}>
              <div className={styles.mockAvatar}>👦</div>
              <div>
                <div className={styles.mockName}>Thabo Nkosi</div>
                <div className={styles.mockDetail}>Male · 12 years · Mamelodi East</div>
                <div className={styles.mockBadge}>ACTIVE</div>
              </div>
            </div>
            <div className={styles.mockReport}>
              <div className={styles.mockAvatar}>👧</div>
              <div>
                <div className={styles.mockName}>Lebo Dlamini</div>
                <div className={styles.mockDetail}>Female · 8 years · Soshanguve</div>
                <div className={styles.mockBadge}>ACTIVE</div>
              </div>
            </div>
            <div className={styles.mockReport}>
              <div className={styles.mockAvatar}>👦</div>
              <div>
                <div className={styles.mockName}>Sipho Khumalo</div>
                <div className={styles.mockDetail}>Male · 14 years · Soweto</div>
                <div className={styles.mockBadgeFound}>FOUND ✓</div>
              </div>
            </div>
            <div className={styles.heroCardFooter}>
              <span>🤖 AI duplicate detection active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.featuresInner}>
          <h2 className={styles.featuresTitle}>Everything your community needs</h2>
          <p className={styles.featuresSub}>Built specifically for South African communities to respond faster when a child goes missing</p>
          <div className={styles.featureGrid}>
            {[
              { icon: "📋", title: "Submit Reports", desc: "Report a missing child in minutes with photos, description and last known location." },
              { icon: "🤖", title: "AI Duplicate Detection", desc: "Our AI automatically detects duplicate reports using NLP text similarity analysis." },
              { icon: "🔔", title: "Instant Alerts", desc: "Receive email and in-app notifications when a child is reported missing in your area." },
              { icon: "📍", title: "Location Filtering", desc: "Search and filter reports by location, age, gender and status in real time." },
              { icon: "📊", title: "Analytics Dashboard", desc: "View reporting trends by province, time period and age group from live data." },
              { icon: "🛡️", title: "Secure & Private", desc: "JWT authentication and BCrypt encryption protect all sensitive information." },
            ].map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howItWorks}>
        <div className={styles.featuresInner}>
          <h2 className={styles.featuresTitle}>How it works</h2>
          <div className={styles.steps}>
            {[
              { num: "1", title: "Register", desc: "Create a free account and set your location to receive local alerts." },
              { num: "2", title: "Report", desc: "Submit a missing children report with all details and an optional photo." },
              { num: "3", title: "Alert", desc: "The system instantly notifies community members in the affected area." },
              { num: "4", title: "Find", desc: "Community members respond, share information and help locate the child." },
            ].map(s => (
              <div key={s.num} className={styles.step}>
                <div className={styles.stepNum}>{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.featuresInner}>
          <h2>Ready to help your community?</h2>
          <p>Join thousands of South Africans working together to find missing children faster.</p>
          <Link to="/register" className={styles.ctaPrimary}>Create Free Account</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.featuresInner}>
          <div className={styles.footerContent}>
            <div>
              <div className={styles.footerBrand}>🔍 Missing Children System</div>
              <p className={styles.footerDesc}>AI-Enhanced Community-Based Missing Children Reporting and Tracking System</p>
              <p className={styles.footerDesc}>ISJ107V — Tshwane University of Technology · 2026</p>
            </div>
            <div className={styles.footerLinks}>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 Missing Children System · Built by Ntwanano Mathebula</span>
            <span>Data source: Missing Children South Africa (2024)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}