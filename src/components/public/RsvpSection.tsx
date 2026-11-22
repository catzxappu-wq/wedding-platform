"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Send, Heart, CheckCircle2, User, Phone, Mail, Users, Utensils, MessageSquare } from "lucide-react";

interface RsvpSectionProps {
  invitationId: string;
  primaryColor?: string;
  fontFamily?: string;
}

export default function RsvpSection({
  invitationId,
  primaryColor = "#B8972E",
  fontFamily = "Cinzel",
}: RsvpSectionProps) {
  const [formData, setFormData] = useState({
    guestName: "",
    phone: "",
    email: "",
    guestsCount: 1,
    attending: true,
    foodPreference: "veg",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit RSVP");
      }

      setSubmitted(true);
      if (formData.attending) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#B8972E", "#58111A", "#F59E0B"],
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while submitting your RSVP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4" id="rsvp">
      <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-amber-400/40 p-6 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Top Decorative Border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-300 via-amber-600 to-amber-300" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs tracking-widest uppercase font-semibold font-sans mb-3">
            <Heart className="w-3.5 h-3.5 text-amber-600 fill-current" />
            <span>Celebrate With Us</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-serif text-gray-900 font-bold"
            style={{ fontFamily }}
          >
            Will You Grace Our Day?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto mt-2">
            Please kindly let us know if you will be able to join our wedding festivities.
          </p>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif text-gray-900 font-bold" style={{ fontFamily }}>
              {formData.attending ? "RSVP Confirmed!" : "Thank You For Letting Us Know"}
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              {formData.attending
                ? `Dearest ${formData.guestName}, we are thrilled to have you with us on our special day! Your presence will make our celebration complete.`
                : `Thank you, ${formData.guestName}. You will be warmly remembered in our thoughts and prayers.`}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  guestName: "",
                  phone: "",
                  email: "",
                  guestsCount: 1,
                  attending: true,
                  foodPreference: "veg",
                  message: "",
                });
              }}
              className="mt-4 px-6 py-2 rounded-full border border-gray-300 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Submit Another Response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Attendance Toggle */}
            <div className="flex flex-col sm:flex-row gap-3 p-1.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, attending: true })}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold tracking-wide transition-all flex items-center justify-center gap-2 ${
                  formData.attending
                    ? "bg-amber-600 text-white shadow-md"
                    : "text-amber-900/80 hover:text-amber-950"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Joyfully Accepts</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, attending: false })}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold tracking-wide transition-all flex items-center justify-center gap-2 ${
                  !formData.attending
                    ? "bg-gray-700 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>Regretfully Declines</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Guest Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh & Sunita Rao"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm transition-all"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  Mobile Number / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-600" />
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm transition-all"
                />
              </div>

              {/* Guests Count */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  Number Of Attending Guests
                </label>
                <select
                  disabled={!formData.attending}
                  value={formData.guestsCount}
                  onChange={(e) => setFormData({ ...formData, guestsCount: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm transition-all disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={5}>5+ Family</option>
                </select>
              </div>
            </div>

            {/* Food Preference */}
            {formData.attending && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-600" />
                  Meal Preference
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "veg", label: "Vegetarian" },
                    { id: "non-veg", label: "Non-Veg" },
                    { id: "jain", label: "Jain / Sattvic" },
                    { id: "vegan", label: "Vegan" },
                  ].map((meal) => (
                    <button
                      key={meal.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, foodPreference: meal.id })}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        formData.foodPreference === meal.id
                          ? "border-amber-500 bg-amber-50 text-amber-900"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {meal.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message / Blessings */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                Blessings & Warm Wishes For The Couple
              </label>
              <textarea
                rows={3}
                placeholder="Share your heartfelt wishes or note for the bride & groom..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full text-white font-serif tracking-widest text-sm uppercase font-semibold shadow-lg shadow-amber-800/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              {loading ? (
                <span>Recording RSVP...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send RSVP Response</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
