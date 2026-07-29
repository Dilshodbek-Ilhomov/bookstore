"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, UserCircle } from "@phosphor-icons/react";
import { usersAPI } from "@/lib/api";
import { useLanguageStore } from "@/store/languageStore";
import { getImageUrl } from "@/lib/utils";
import type { User } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PublicProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const userId = parseInt(resolvedParams.id);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language, t } = useLanguageStore();

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await usersAPI.getProfile(userId);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching public profile:", err);
        setError(language === "uz" ? "Foydalanuvchi topilmadi" : "User not found");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [userId, language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-12">
        <div className="font-mono text-sm text-gold-400 animate-pulse">
          {t.common.loading}
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold text-text-primary">{error || "User not found"}</h1>
        <Link href="/books" className="inline-flex btn-ghost text-sm">
          {language === "uz" ? "Kitoblarga qaytish" : "Back to Books"}
        </Link>
      </div>
    );
  }

  const displayName = profile.first_name || profile.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gold-400/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-400/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-10 relative z-10">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === "uz" ? "Orqaga" : "Back"}
        </button>

        <div className="glass p-8 sm:p-12 rounded-3xl border border-white/5 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="shrink-0">
            {profile.avatar ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gold-400/30 shadow-[0_0_30px_rgba(201,168,76,0.15)]">
                <Image
                  src={getImageUrl(profile.avatar)}
                  alt={displayName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-navy-900 border border-gold-400/20 flex items-center justify-center shadow-[0_0_30px_rgba(201,168,76,0.1)]">
                <UserCircle className="w-20 h-20 text-gold-400/50" weight="thin" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-1">
                {profile.first_name} {profile.last_name}
              </h1>
              {profile.email && (
                <p className="text-text-muted text-sm">{profile.email}</p>
              )}
            </div>

            {profile.bio && (
              <div className="pt-4 border-t border-white/5">
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  {language === "uz" ? "O'zi haqida" : "About"}
                </h3>
                <p className="text-sm text-text-primary/90 leading-relaxed max-w-xl">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
