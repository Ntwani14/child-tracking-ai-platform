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
          <span>Missing Children Reporting System</span>
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
            A centralized, AI-enhanced platform for South African communities to report,
            track and share information about missing children — turning scattered
            messages into one clear, coordinated response.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>1,697</span>
              <span className={styles.heroStatLabel}>Children reported missing each year in South Africa</span>
            </div>
            <div className={styles.heroStatDiv} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>1 in 5hrs</span>
              <span className={styles.heroStatLabel}>Roughly one child goes missing every five hours</span>
            </div>
            <div className={styles.heroStatDiv} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>30%</span>
              <span className={styles.heroStatLabel}>Target improvement in community response time</span>
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
                <div className={styles.mockName}>Katlego Mokoena</div>
                <div className={styles.mockDetail}>Male · 6 years · Katlehong</div>
                <div className={styles.mockBadge}>ACTIVE</div>
              </div>
            </div>
            <div className={styles.mockReport}>
              <div className={styles.mockAvatar}>👧</div>
              <div>
                <div className={styles.mockName}>Amogelang Dlamini</div>
                <div className={styles.mockDetail}>Female · 5 years · Soshanguve</div>
                <div className={styles.mockBadge}>ACTIVE</div>
              </div>
            </div>
            <div className={styles.mockReport}>
              <div className={styles.mockAvatar}>👦</div>
              <div>
                <div className={styles.mockName}>Timmy Shai</div>
                <div className={styles.mockDetail}>Male · 4 years · Midrand</div>
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
              { icon: "📋", title: "Submit Reports", desc: "Report a missing child in minutes with a photo, physical description and last known location." },
              { icon: "🤖", title: "AI Duplicate Detection", desc: "Our AI automatically flags likely duplicate reports using NLP text-similarity analysis, so cases stay clear and accurate." },
              { icon: "🔔", title: "Instant Alerts", desc: "Every registered member receives an email and in-app alert the moment a new report is submitted." },
              { icon: "📤", title: "One-Tap Sharing", desc: "Share any report straight to WhatsApp, Facebook, X, Telegram and more to spread the word fast." },
              { icon: "📊", title: "Analytics Dashboard", desc: "View reporting trends by location, time period and age group from live system data." },
              { icon: "🛡️", title: "Secure & Private", desc: "JWT authentication and BCrypt password hashing protect all sensitive information." },
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
              { num: "1", title: "Register", desc: "Create a free account in seconds to join your community platform." },
              { num: "2", title: "Report", desc: "Submit a missing children report with full details and an optional photo." },
              { num: "3", title: "Alert", desc: "The system instantly notifies every registered community member." },
              { num: "4", title: "Find", desc: "Members respond, share the report and help locate the child safely." },
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
          <p>Join a growing community of South Africans working together to find missing children faster.</p>
          <Link to="/register" className={styles.ctaPrimary}>Create Free Account</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.featuresInner}>
          <div className={styles.footerContent}>
            <div>
              <div className={styles.footerBrand}>🔍 Missing Children Reporting System</div>
              <p className={styles.footerDesc}>AI-Enhanced Community-Based Missing Children Reporting and Tracking System</p>
              <p className={styles.footerDesc}>ISJ107V — Tshwane University of Technology · 2026</p>
            </div>
            <div className={styles.footerLinks}>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 Missing Children Reporting System · Built by Ntwanano Mathebula</span>
            <span>Statistics: Missing Children South Africa (2024)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}