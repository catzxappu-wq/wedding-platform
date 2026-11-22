"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Music,
  Palette,
  Sliders,
  Eye,
  Send,
  Save,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Check,
  ExternalLink,
  Copy,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  Upload,
  Volume2,
} from "lucide-react";
import { TEMPLATES, getTemplateById } from "@/data/templates";
import { slugify } from "@/lib/utils";
import InvitationExperience from "@/components/public/InvitationExperience";
import ImageUploader from "@/components/admin/ImageUploader";
import MultiImageUploader from "@/components/admin/MultiImageUploader";

interface WizardProps {
  initialData?: any;
  isEditing?: boolean;
  invitationId?: string;
}

export default function InvitationBuilderWizard({
  initialData,
  isEditing = false,
  invitationId,
}: WizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [publishedModal, setPublishedModal] = useState<{ slug: string; title: string } | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  const musicPresets = [
    {
      title: "Royal Indian Shehnai & Sitar Harmony",
      url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=indian-flute-and-sitar-10492.mp3",
      tag: "Classical Indian",
    },
    {
      title: "Acoustic Wedding Love Serenade",
      url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=romantic-wedding-19124.mp3",
      tag: "Romantic Guitar",
    },
    {
      title: "Majestic Orchestral Golden Strings",
      url: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=orchestral-strings-warm-124446.mp3",
      tag: "Cinematic Grandeur",
    },
    {
      title: "Gentle Piano & Cello Melody",
      url: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3?filename=tender-piano-strings-10022.mp3",
      tag: "Minimal Elegance",
    },
  ];

  const handleAudioUploadFromStorage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      alert(
        `Selected audio file is ${((file.size / (1024 * 1024)).toFixed(1))} MB. To ensure fast mobile loading and stay within server limits, direct audio files must be under 1.5MB. For longer songs, please select one of the high quality presets below or enter an MP3 URL.`
      );
      if (audioInputRef.current) audioInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({
          ...prev,
          musicUrl: reader.result as string,
          musicTitle: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          musicEnabled: true,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Form State
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    status: initialData?.status || "DRAFT",
    templateId: initialData?.templateId || "royal-gold",
    primaryColor: initialData?.primaryColor || "#B8972E",
    secondaryColor: initialData?.secondaryColor || "#58111A",
    accentColor: initialData?.accentColor || "#D4AF37",
    backgroundColor: initialData?.backgroundColor || "#FAF7F2",
    textColor: initialData?.textColor || "#1F2937",
    fontFamily: initialData?.fontFamily || "Cinzel",
    headingFont: initialData?.headingFont || "Cinzel",
    musicEnabled: initialData?.musicEnabled ?? true,
    musicTitle: initialData?.musicTitle || "Royal Shehnai & Sitar Harmony",
    musicUrl: initialData?.musicUrl || "",
    weddingDate: initialData?.weddingDate
      ? new Date(initialData.weddingDate).toISOString().split("T")[0]
      : "2026-12-18",
    startTime: initialData?.startTime || "10:30 AM",
    endTime: initialData?.endTime || "10:00 PM",
    timeZone: initialData?.timeZone || "Asia/Kolkata",
    couple: {
      groomName: initialData?.couple?.groomName || "",
      brideName: initialData?.couple?.brideName || "",
      groomPhoto: initialData?.couple?.groomPhoto || "",
      bridePhoto: initialData?.couple?.bridePhoto || "",
      couplePhoto: initialData?.couple?.couplePhoto || "",
      introduction:
        initialData?.couple?.introduction || "Two hearts, one beautiful journey.",
      story: initialData?.couple?.story || "",
      familyMessage: initialData?.couple?.familyMessage || "",
      familyNames: initialData?.couple?.familyNames || "",
    },
    venue: {
      venueName: initialData?.venue?.venueName || "The Leela Palace",
      fullAddress: initialData?.venue?.fullAddress || "23, HAL Old Airport Rd, Kodihalli, Bengaluru",
      city: initialData?.venue?.city || "Bengaluru",
      state: initialData?.venue?.state || "Karnataka",
      country: initialData?.venue?.country || "India",
      latitude: initialData?.venue?.latitude || 12.9606,
      longitude: initialData?.venue?.longitude || 77.6484,
      googleMapsUrl: initialData?.venue?.googleMapsUrl || "https://maps.google.com",
    },
    events: initialData?.events?.length
      ? initialData.events
      : [
          {
            name: "Haldi Ceremony",
            date: "2026-12-16",
            startTime: "10:00 AM",
            endTime: "01:00 PM",
            venueName: "The Royal Gardens",
            address: "Bengaluru, Karnataka",
            description: "Auspicious turmeric ceremony with singing and marigold celebration.",
            icon: "Sun",
            imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
            sortOrder: 1,
          },
          {
            name: "The Royal Wedding & Muhurtham",
            date: "2026-12-18",
            startTime: "10:30 AM",
            endTime: "02:00 PM",
            venueName: "The Grand Mandapam",
            address: "Bengaluru, Karnataka",
            description: "Sacred vows and traditional rituals under the floral canopy.",
            icon: "Heart",
            imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
            sortOrder: 2,
          },
        ],
    gallery: initialData?.gallery?.length
      ? initialData.gallery
      : [
          {
            imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
            caption: "Golden hour promises",
            isCover: true,
            sortOrder: 1,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
            caption: "Cherished moments",
            isCover: false,
            sortOrder: 2,
          },
        ],
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Auto-generate slug when groom & bride names change if creating
  const handleCoupleNameChange = (field: "groomName" | "brideName", val: string) => {
    const updatedCouple = { ...formData.couple, [field]: val };
    let newSlug = formData.slug;
    if (!isEditing && (!formData.slug || formData.slug === slugify(`${formData.couple.groomName} ${formData.couple.brideName}`))) {
      newSlug = slugify(`${updatedCouple.groomName} ${updatedCouple.brideName}`);
    }
    setFormData({
      ...formData,
      slug: newSlug,
      title: `${updatedCouple.groomName || "Groom"} & ${updatedCouple.brideName || "Bride"} | Wedding Celebration`,
      couple: updatedCouple,
    });
  };

  // Change Template & auto-apply its palette
  const handleTemplateSelect = (templateId: string) => {
    const tmpl = getTemplateById(templateId);
    setFormData({
      ...formData,
      templateId,
      primaryColor: tmpl.theme.primaryColor,
      secondaryColor: tmpl.theme.secondaryColor,
      accentColor: tmpl.theme.accentColor,
      backgroundColor: tmpl.theme.backgroundColor,
      textColor: tmpl.theme.textColor,
      fontFamily: tmpl.theme.fontFamily,
      headingFont: tmpl.theme.headingFont,
    });
  };

  // Save / Submit logic
  const handleSave = async (overrideStatus?: string): Promise<boolean> => {
    setSaving(true);
    try {
      const newStatus = overrideStatus || formData.status;
      const payload = {
        ...formData,
        status: newStatus,
      };

      const payloadString = JSON.stringify(payload);
      const payloadSizeBytes = new Blob([payloadString]).size;
      const payloadSizeMb = (payloadSizeBytes / (1024 * 1024)).toFixed(2);

      // Check Vercel 4.5MB serverless limit
      if (payloadSizeBytes > 4 * 1024 * 1024) {
        throw new Error(
          `Total upload size (${payloadSizeMb} MB) exceeds the server limit of 4.5 MB. Please reduce the number of photos in the gallery or select an audio preset instead of a large uploaded audio file.`
        );
      }

      const url = isEditing ? `/api/invitations/${invitationId}` : "/api/invitations";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: payloadString,
      });

      let data: any = {};
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const textResponse = await res.text();
        if (res.status === 413 || textResponse.includes("Request Entity Too Large")) {
          throw new Error(
            "Upload payload is too large for the server (HTTP 413: Request Entity Too Large). Please remove or re-select gallery pictures so they are auto-compressed, or choose an audio preset."
          );
        }
        throw new Error(textResponse || `Server returned error (${res.status})`);
      }

      if (!res.ok) throw new Error(data.error || "Save failed");

      const savedSlug = data.invitation?.slug || formData.slug;
      setFormData((prev) => ({ ...prev, status: newStatus }));
      showToast(isEditing ? "Changes saved successfully!" : "Invitation published successfully!");

      // Cache locally in browser storage so the admin never loses created invitations
      if (typeof window !== "undefined") {
        try {
          const cacheKey = "wedding_invitations_cache";
          const raw = localStorage.getItem(cacheKey);
          const list = raw ? JSON.parse(raw) : [];
          const itemToCache = {
            ...formData,
            id: data.invitation?.id || invitationId || `inv-${Date.now()}`,
            slug: savedSlug,
            status: newStatus,
          };
          const filtered = list.filter((x: any) => x.slug !== savedSlug);
          localStorage.setItem(cacheKey, JSON.stringify([itemToCache, ...filtered]));
        } catch (cErr) {
          console.warn("Could not cache to localStorage:", cErr);
        }
      }

      if (newStatus === "PUBLISHED") {
        setPublishedModal({
          slug: savedSlug,
          title: formData.title || `${formData.couple.groomName || "Groom"} & ${formData.couple.brideName || "Bride"}'s Wedding`,
        });
      } else if (!isEditing && data.invitation?.id) {
        window.history.replaceState(null, "", `/admin/invitations/${data.invitation.id}/edit`);
      }

      return true;
    } catch (err: any) {
      alert(err.message || "Failed to save invitation.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleOpenLiveLink = async () => {
    const slug = formData.slug || "wedding";
    const success = await handleSave("PUBLISHED");
    if (success) {
      window.open(`/invite/${slug}`, "_blank");
    }
  };

  const stepsList = [
    { num: 1, title: "Couple", icon: Heart },
    { num: 2, title: "Date & Time", icon: Calendar },
    { num: 3, title: "Events", icon: Clock },
    { num: 4, title: "Venue & Maps", icon: MapPin },
    { num: 5, title: "Gallery", icon: Camera },
    { num: 6, title: "Music", icon: Music },
    { num: 7, title: "Template", icon: Palette },
    { num: 8, title: "Customization", icon: Sliders },
    { num: 9, title: "Live Preview", icon: Eye },
    { num: 10, title: "Publish", icon: Send },
  ];

  // Prepared data object for live preview
  const livePreviewInvitation: any = {
    id: invitationId || "preview-id",
    slug: formData.slug || "preview-slug",
    title: formData.title || "Wedding Invitation",
    status: formData.status,
    templateId: formData.templateId,
    primaryColor: formData.primaryColor,
    secondaryColor: formData.secondaryColor,
    accentColor: formData.accentColor,
    backgroundColor: formData.backgroundColor,
    textColor: formData.textColor,
    fontFamily: formData.fontFamily,
    headingFont: formData.headingFont,
    musicEnabled: formData.musicEnabled,
    musicTitle: formData.musicTitle,
    musicUrl: formData.musicUrl,
    weddingDate: formData.weddingDate,
    startTime: formData.startTime,
    endTime: formData.endTime,
    timeZone: formData.timeZone,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    couple: formData.couple,
    venue: formData.venue,
    events: formData.events,
    gallery: formData.gallery,
    rsvps: [],
    settings: [],
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-amber-500 text-amber-950 font-medium text-xs shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Wizard Bar */}
      <div className="rounded-3xl bg-[#111726] border border-gray-800 p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            {isEditing ? "Edit Invitation" : "Create New Invitation"} • Step {step} of 10
          </span>
          <h1 className="text-xl sm:text-2xl font-serif text-white font-bold mt-0.5">
            {stepsList[step - 1].title}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => handleSave("DRAFT")}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>Save Draft</span>
          </button>

          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 text-xs font-semibold hover:bg-gray-800 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {step < 10 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSave("PUBLISHED")}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Live</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Steps Nav */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-max">
          {stepsList.map((s) => {
            const Icon = s.icon;
            const isCurrent = step === s.num;
            const isCompleted = step > s.num;

            return (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isCurrent
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                    : isCompleted
                    ? "bg-gray-900 text-gray-300 hover:bg-gray-800"
                    : "bg-gray-900/50 text-gray-500 hover:text-gray-400"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? "bg-amber-500 text-amber-950"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {isCompleted ? "✓" : s.num}
                </div>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* STEP CONTENT PANELS */}
      {/* ======================================================== */}

      {/* STEP 1: COUPLE DETAILS */}
      {step === 1 && (
        <div className="rounded-3xl bg-[#111726] border border-gray-800 p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-amber-400" />
            <span>Couple Information & Profiles</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Groom Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={formData.couple.groomName}
                onChange={(e) => handleCoupleNameChange("groomName", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Bride Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Priya Patel"
                value={formData.couple.brideName}
                onChange={(e) => handleCoupleNameChange("brideName", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <ImageUploader
                label="Groom Portrait"
                value={formData.couple.groomPhoto}
                onChange={(dataUrl) =>
                  setFormData({
                    ...formData,
                    couple: { ...formData.couple, groomPhoto: dataUrl },
                  })
                }
                aspectRatio="square"
                placeholderText="Upload Groom photo from storage"
              />
            </div>

            <div className="space-y-1.5">
              <ImageUploader
                label="Bride Portrait"
                value={formData.couple.bridePhoto}
                onChange={(dataUrl) =>
                  setFormData({
                    ...formData,
                    couple: { ...formData.couple, bridePhoto: dataUrl },
                  })
                }
                aspectRatio="square"
                placeholderText="Upload Bride photo from storage"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <ImageUploader
                label="Couple Featured Cover Photo"
                value={formData.couple.couplePhoto}
                onChange={(dataUrl) =>
                  setFormData({
                    ...formData,
                    couple: { ...formData.couple, couplePhoto: dataUrl },
                  })
                }
                aspectRatio="video"
                placeholderText="Upload Couple Cover photo from storage"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Welcome Quote / Tagline
              </label>
              <input
                type="text"
                placeholder="Two hearts, one beautiful journey."
                value={formData.couple.introduction}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    couple: { ...formData.couple, introduction: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Our Story
              </label>
              <textarea
                rows={3}
                placeholder="Describe how the couple met and their path to marriage..."
                value={formData.couple.story}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    couple: { ...formData.couple, story: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Family Names
              </label>
              <input
                type="text"
                placeholder="The Sharma & Patel Families"
                value={formData.couple.familyNames}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    couple: { ...formData.couple, familyNames: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Family Blessings Message
              </label>
              <input
                type="text"
                placeholder="With blessings from our elders and loved ones..."
                value={formData.couple.familyMessage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    couple: { ...formData.couple, familyMessage: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: WEDDING DATE & TIME */}
      {step === 2 && (
        <div className="rounded-3xl bg-[#111726] border border-gray-800 p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Wedding Date & Schedule Powers</span>
          </h2>
          <p className="text-xs text-gray-400">
            This date automatically powers the Countdown timer, Save The Date reveal animation, and .ics calendar synchronization.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Wedding Date *
              </label>
              <input
                type="date"
                required
                value={formData.weddingDate}
                onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Time Zone
              </label>
              <select
                value={formData.timeZone}
                onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Start Time
              </label>
              <input
                type="text"
                placeholder="10:30 AM"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                End Time
              </label>
              <input
                type="text"
                placeholder="10:00 PM"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: EVENTS */}
      {step === 3 && (
        <div className="rounded-3xl bg-[#111726] border border-gray-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Wedding Events & Ceremonies</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Add unlimited events (e.g. Haldi, Mehendi, Sangeet, Muhurtham, Reception).
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newEv = {
                  name: "New Ceremony",
                  date: formData.weddingDate,
                  startTime: "06:00 PM",
                  endTime: "10:00 PM",
                  venueName: formData.venue.venueName,
                  address: formData.venue.fullAddress,
                  description: "Join us for joyous celebrations.",
                  icon: "Sparkles",
                  imageUrl: "",
                  sortOrder: formData.events.length + 1,
                };
                setFormData({ ...formData, events: [...formData.events, newEv] });
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500/30 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.events.map((ev: any, index: number) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    Event #{index + 1}
                  </span>
                  {formData.events.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.events.filter((_: any, i: number) => i !== index);
                        setFormData({ ...formData, events: updated });
                      }}
                      className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      title="Remove event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 font-medium">Event Name</label>
                    <input
                      type="text"
                      value={ev.name}
                      onChange={(e) => {
                        const updated = [...formData.events];
                        updated[index].name = e.target.value;
                        setFormData({ ...formData, events: updated });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 font-medium">Date</label>
                    <input
                      type="date"
                      value={ev.date ? new Date(ev.date).toISOString().split("T")[0] : ""}
                      onChange={(e) => {
                        const updated = [...formData.events];
                        updated[index].date = e.target.value;
                        setFormData({ ...formData, events: updated });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 font-medium">Timings</label>
                    <input
                      type="text"
                      placeholder="10:00 AM - 01:00 PM"
                      value={ev.startTime}
                      onChange={(e) => {
                        const updated = [...formData.events];
                        updated[index].startTime = e.target.value;
                        setFormData({ ...formData, events: updated });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 font-medium">Venue Name</label>
                    <input
                      type="text"
                      value={ev.venueName}
                      onChange={(e) => {
                        const updated = [...formData.events];
                        updated[index].venueName = e.target.value;
                        setFormData({ ...formData, events: updated });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] text-gray-400 font-medium">Description</label>
                    <input
                      type="text"
                      value={ev.description || ""}
                      onChange={(e) => {
                        const updated = [...formData.events];
                        updated[index].description = e.target.value;
                        setFormData({ ...formData, events: updated });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-3 pt-2">
                    <ImageUploader
                      label="Event Ceremony Photo (Optional)"
                      value={ev.imageUrl}
                      onChange={(dataUrl) => {
                        const updated = [...formData.events];
                        updated[index].imageUrl = dataUrl;
                        setFormData({ ...formData, events: updated });
                      }}
                      aspectRatio="landscape"
                      placeholderText="Upload ceremony photo from device storage"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: VENUE & GOOGLE MAPS */}
      {step === 4 && (
        <div className="rounded-3xl bg-[#111726] border border-gray-800 p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Venue & Google Maps Location</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Venue Name *
              </label>
              <input
                type="text"
                value={formData.venue.venueName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    venue: { ...formData.venue, venueName: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Full Address *
              </label>
              <input
                type="text"
                value={formData.venue.fullAddress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    venue: { ...formData.venue, fullAddress: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                City
              </label>
              <input
                type="text"
                value={formData.venue.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    venue: { ...formData.venue, city: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                State
              </label>
              <input
                type="text"
                value={formData.venue.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    venue: { ...formData.venue, state: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Google Maps Link
              </label>
              <input
                type="text"
                placeholder="https://maps.google.com/..."
                value={formData.venue.googleMapsUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    venue: { ...formData.venue, googleMapsUrl: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: GALLERY */}
      {step === 5 && (
        <div className="rounded-3xl bg-[#111726] border border-gray-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Photo Gallery & Memories (Upload Directly From Storage)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Select or drag and drop multiple wedding photos directly from your computer or phone storage. Images are automatically optimized for instant mobile loading.
            </p>
          </div>

          <MultiImageUploader
            photos={formData.gallery}
            onChange={(photos) => setFormData({ ...formData, gallery: photos })}
          />
        </div>
      )}

      {/* STEP 6: MUSIC */}
      {step === 6 && (
        <div className="rounded-3xl bg-[#111726] border border-gray-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-amber-400" />
                <span>Background Wedding Soundtrack</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Set mood music that plays gently when guests click the music player on the invitation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="musicToggle"
                checked={formData.musicEnabled}
                onChange={(e) => setFormData({ ...formData, musicEnabled: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded border-gray-700 cursor-pointer"
              />
              <label htmlFor="musicToggle" className="text-xs font-semibold text-gray-200 cursor-pointer">
                Enable Music
              </label>
            </div>
          </div>

          {formData.musicEnabled && (
            <div className="space-y-6 pt-2">
              {/* Option A: Upload from Device Storage */}
              <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      Upload Audio File From Storage
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                    MP3, WAV, OGG up to 1.5MB (or select preset below)
                  </span>
                </div>

                <input
                  type="file"
                  ref={audioInputRef}
                  accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/m4a"
                  onChange={handleAudioUploadFromStorage}
                  className="hidden"
                />

                <div
                  onClick={() => audioInputRef.current?.click()}
                  className="p-6 rounded-xl border-2 border-dashed border-gray-700 hover:border-amber-500/60 bg-gray-950/40 hover:bg-amber-500/5 transition-all cursor-pointer text-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-gray-200">
                    Click to select audio soundtrack from your computer or phone
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Direct storage upload - no external hosting required
                  </p>
                </div>
              </div>

              {/* Option B: Preset Wedding Melodies */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                  Or Choose A Royalty-Free Wedding Theme Preset
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {musicPresets.map((preset, idx) => {
                    const isSelected = formData.musicUrl === preset.url;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            musicUrl: preset.url,
                            musicTitle: preset.title,
                            musicEnabled: true,
                          });
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-amber-400 bg-amber-500/10 text-white"
                            : "border-gray-800 bg-gray-900/60 hover:border-gray-700 text-gray-300"
                        }`}
                      >
                        <div className="space-y-0.5 pr-2">
                          <p className="text-xs font-semibold text-white">{preset.title}</p>
                          <span className="text-[10px] text-amber-400/80">{preset.tag}</span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Currently Configured Audio & Player */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Track Display Title
                  </label>
                  <input
                    type="text"
                    value={formData.musicTitle}
                    onChange={(e) => setFormData({ ...formData, musicTitle: e.target.value })}
                    placeholder="e.g. Royal Wedding Symphony"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Audio Source Preview
                  </label>
                  {formData.musicUrl ? (
                    <audio
                      src={formData.musicUrl}
                      controls
                      className="w-full h-[38px] rounded-xl bg-gray-900"
                    />
                  ) : (
                    <div className="h-[38px] px-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-500 text-xs flex items-center">
                      No soundtrack loaded yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 7: TEMPLATE SELECTION */}
      {step === 7 && (
        <div className="rounded-3xl bg-[#111726] border border-gray-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Choose Wedding Template</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Select one of the 10 luxury templates. Switching template automatically configures the recommended color scheme and typography.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMPLATES.map((tmpl) => {
              const isSelected = formData.templateId === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => handleTemplateSelect(tmpl.id)}
                  className={`rounded-2xl border p-4 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400/50"
                      : "border-gray-800 bg-gray-900/80 hover:border-gray-700"
                  }`}
                >
                  <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 relative bg-gray-800">
                    <img
                      src={tmpl.previewImage}
                      alt={tmpl.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-amber-500 text-amber-950 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-md">
                        <Check className="w-3 h-3" />
                        <span>Active</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-white text-base">
                        {tmpl.name}
                      </h3>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                        {tmpl.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                      {tmpl.description}
                    </p>

                    {/* Color swatches preview */}
                    <div className="flex items-center gap-1.5 pt-2">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: tmpl.theme.primaryColor }}
                        title="Primary"
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: tmpl.theme.secondaryColor }}
                        title="Secondary"
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: tmpl.theme.accentColor }}
                        title="Accent"
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: tmpl.theme.backgroundColor }}
                        title="Background"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 8: CUSTOMIZATION */}
      {step === 8 && (
        <div className="rounded-3xl bg-[#111726] border border-gray-800 p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Visual Colors & Typography Customizer</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2 p-3 rounded-xl bg-gray-900 border border-gray-800">
              <label className="text-[11px] font-semibold text-gray-400 uppercase">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-20 px-2 py-1 rounded bg-gray-800 text-white text-xs border border-gray-700 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-gray-900 border border-gray-800">
              <label className="text-[11px] font-semibold text-gray-400 uppercase">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-20 px-2 py-1 rounded bg-gray-800 text-white text-xs border border-gray-700 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-gray-900 border border-gray-800">
              <label className="text-[11px] font-semibold text-gray-400 uppercase">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  className="w-20 px-2 py-1 rounded bg-gray-800 text-white text-xs border border-gray-700 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-gray-900 border border-gray-800">
              <label className="text-[11px] font-semibold text-gray-400 uppercase">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  className="w-20 px-2 py-1 rounded bg-gray-800 text-white text-xs border border-gray-700 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-gray-900 border border-gray-800">
              <label className="text-[11px] font-semibold text-gray-400 uppercase">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={formData.textColor}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  className="w-20 px-2 py-1 rounded bg-gray-800 text-white text-xs border border-gray-700 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Heading Typography Font
              </label>
              <select
                value={formData.headingFont}
                onChange={(e) => setFormData({ ...formData, headingFont: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              >
                <option value="Cinzel">Cinzel (Royal Classical Serif)</option>
                <option value="Playfair Display">Playfair Display (Romantic Elegance)</option>
                <option value="Cormorant Garamond">Cormorant Garamond (Graceful Vintage)</option>
                <option value="Marcellus">Marcellus (Temple Heritage)</option>
                <option value="Inter">Inter (Clean Modern Editorial)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Body Font
              </label>
              <select
                value={formData.fontFamily}
                onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-amber-400 outline-none"
              >
                <option value="Cinzel">Cinzel</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Inter">Inter</option>
                <option value="Cormorant Garamond">Cormorant Garamond</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 9: LIVE DEVICE PREVIEW */}
      {step === 9 && (
        <div className="rounded-3xl bg-[#111726] border border-gray-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Live Interactive Device Preview</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Test the actual guest experience rendered directly from your current form values.
              </p>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-900 border border-gray-700">
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  previewDevice === "mobile"
                    ? "bg-amber-500 text-amber-950 font-bold shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile (375px)</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewDevice("tablet")}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  previewDevice === "tablet"
                    ? "bg-amber-500 text-amber-950 font-bold shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet (768px)</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  previewDevice === "desktop"
                    ? "bg-amber-500 text-amber-950 font-bold shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
            </div>
          </div>

          {/* Interactive Frame Container */}
          <div className="flex justify-center bg-[#070A10] p-4 sm:p-8 rounded-2xl border border-gray-800/80 overflow-hidden">
            <div
              className={`transition-all duration-300 rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-700/60 bg-white ${
                previewDevice === "mobile"
                  ? "w-[375px] h-[700px] overflow-y-auto"
                  : previewDevice === "tablet"
                  ? "w-[768px] h-[750px] overflow-y-auto"
                  : "w-full max-w-5xl h-[750px] overflow-y-auto"
              }`}
            >
              <InvitationExperience invitation={livePreviewInvitation} />
            </div>
          </div>
        </div>
      )}

      {/* STEP 10: PUBLISH & SHARE */}
      {step === 10 && (
        <div className="rounded-3xl bg-[#111726] border border-gray-800 p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-amber-400" />
            <span>Publishing & Unique Link Generation</span>
          </h2>

          <div className="space-y-6 max-w-2xl">
            {/* Slug Configuration */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Invitation URL Slug *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-mono bg-gray-900 px-3 py-2.5 rounded-xl border border-gray-700">
                  /invite/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white font-mono text-sm focus:border-amber-400 outline-none"
                />
              </div>
              <p className="text-[11px] text-gray-500">
                This URL must be unique across all weddings on the platform.
              </p>
            </div>

            {/* Status Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Publish Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "DRAFT", label: "Draft", desc: "Private to admin" },
                  { id: "PUBLISHED", label: "Published", desc: "Live to the world" },
                  { id: "UNPUBLISHED", label: "Unpublished", desc: "Temporarily offline" },
                  { id: "ARCHIVED", label: "Archived", desc: "Completed wedding" },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: st.id })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      formData.status === st.id
                        ? "border-amber-400 bg-amber-500/15 text-white"
                        : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    <span className="block font-semibold text-xs">{st.label}</span>
                    <span className="text-[10px] text-gray-500">{st.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons: Publish Live & Open */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1A2338] to-[#121927] border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Ready To Publish & Share?</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Save all information to the platform and generate your live public invitation link.
                  </p>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  formData.status === "PUBLISHED"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}>
                  Status: {formData.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleSave("PUBLISHED")}
                  disabled={saving}
                  className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{saving ? "Publishing Wedding..." : "Save & Publish Invitation"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenLiveLink}
                  disabled={saving}
                  className="py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-serif font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{saving ? "Please wait..." : "Publish & Open Invitation"}</span>
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            {formData.slug && (
              <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Live Public URL Preview
                  </h4>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    /invite/{formData.slug}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/invite/${formData.slug}`}
                    className="flex-1 px-3 py-2 rounded-xl bg-gray-800 text-xs text-amber-300 font-mono truncate"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const origin = typeof window !== "undefined" ? window.location.origin : "";
                      navigator.clipboard.writeText(`${origin}/invite/${formData.slug}`);
                      showToast("Copied invitation URL to clipboard!");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenLiveLink}
                    disabled={saving}
                    className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs flex items-center justify-center transition-colors cursor-pointer"
                    title="Open live invitation"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PUBLISHED SUCCESS CELEBRATION MODAL */}
      {publishedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-md w-full rounded-3xl bg-[#161D2E] border border-amber-500/40 p-7 sm:p-9 text-center space-y-6 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner relative z-10">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1 relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block mb-1">
                Published & Live
              </span>
              <h2 className="text-2xl font-serif text-white font-bold">
                Wedding Is Live! 🎉
              </h2>
              <p className="text-xs text-gray-300">
                Your wedding invitation for <strong className="text-white">{publishedModal.title}</strong> is now live to the world.
              </p>
            </div>

            {/* Public Link Box */}
            <div className="p-3.5 rounded-2xl bg-gray-900 border border-gray-700 text-left space-y-1 relative z-10">
              <label className="text-[10px] text-gray-400 uppercase font-semibold">
                Invitation URL
              </label>
              <div className="text-amber-300 font-mono text-xs break-all">
                {typeof window !== "undefined" ? window.location.origin : ""}/invite/{publishedModal.slug}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 relative z-10">
              <button
                type="button"
                onClick={() => window.open(`/invite/${publishedModal.slug}`, "_blank")}
                className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 hover:scale-105 transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Invitation</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/invite/${publishedModal.slug}`;
                  navigator.clipboard.writeText(url);
                  showToast("Invitation URL copied to clipboard!");
                }}
                className="flex-1 py-3.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-center gap-4 text-xs text-gray-400 relative z-10">
              <button
                type="button"
                onClick={() => setPublishedModal(null)}
                className="hover:text-white underline cursor-pointer"
              >
                Close Window
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => router.push("/admin/dashboard")}
                className="hover:text-amber-300 underline cursor-pointer font-medium"
              >
                Admin Dashboard →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
