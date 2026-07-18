"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { BookOpen, Envelope, Lock, User, ArrowRight } from "@phosphor-icons/react";
import { useLanguageStore } from "@/store/languageStore";
import { BookStoreLogo } from "@/components/BookStoreLogo";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguageStore();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== password2) {
      setError(t.registerPage.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      await authAPI.register({
        email,
        password,
        password2,
        first_name: firstName,
        last_name: lastName,
      });
      setSuccess(true);
      try {
        const res = await authAPI.login(email, password);
        if (res.user) login(res.user);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } catch {
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || t.registerPage.defaultError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-gold-400/[0.03] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gold-400/[0.03] blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 glass p-8 sm:p-10 rounded-3xl border border-white/5 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group justify-center">
            <BookStoreLogo className="w-9 h-9 shrink-0" />
            <span className="text-sm font-bold tracking-wide text-text-primary">
              BOOK<span className="text-gold-400">STORE</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            {t.registerPage.title}
          </h2>
          <p className="text-xs text-text-secondary">
            {t.registerPage.subtitle}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-400 text-center">
            {t.registerPage.successMessage}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="firstName" className="text-xs font-semibold text-text-secondary">
                {t.registerPage.firstNameLabel}
              </label>
              <div className="relative">
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy-900 border border-navy-600/40 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold-400 transition-colors"
                  placeholder={t.registerPage.firstNamePlaceholder}
                />
                <User className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="lastName" className="text-xs font-semibold text-text-secondary">
                {t.registerPage.lastNameLabel}
              </label>
              <div className="relative">
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy-900 border border-navy-600/40 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold-400 transition-colors"
                  placeholder={t.registerPage.lastNamePlaceholder}
                />
                <User className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-semibold text-text-secondary">
              {t.registerPage.emailLabel}
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-600/40 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold-400 transition-colors"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-semibold text-text-secondary">
              {t.registerPage.passwordLabel}
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-navy-600/40 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold-400 transition-colors"
                placeholder="••••••••"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password2" className="text-xs font-semibold text-text-secondary">
              {t.registerPage.password2Label}
            </label>
            <div className="relative">
              <input
                id="password2"
                type="password"
                required
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-navy-600/40 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold-400 transition-colors"
                placeholder="••••••••"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold text-sm flex items-center justify-center gap-2 mt-4"
          >
            <span>{loading ? t.registerPage.loading : t.registerPage.submit}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Toggle option */}
        <div className="text-center">
          <p className="text-xs text-text-secondary">
            {t.registerPage.hasAccount}{" "}
            <Link href="/login" className="text-gold-400 hover:text-gold-300 font-medium">
              {t.registerPage.loginLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
