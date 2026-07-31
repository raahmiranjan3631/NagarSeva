"use client";

import { AppShell } from "@/components/AppShell";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const CATEGORIES = [
  { id: "street_light", icon: "lightbulb", label: "Lighting" },
  { id: "pothole", icon: "construction", label: "Infrastructure" },
  { id: "garbage", icon: "delete", label: "Waste" },
  { id: "water_leak", icon: "water_drop", label: "Water" },
  { id: "illegal_parking", icon: "local_parking", label: "Parking" },
  { id: "drainage", icon: "water", label: "Drainage" },
  { id: "safety_hazard", icon: "health_and_safety", label: "Safety" },
  { id: "other", icon: "more_horiz", label: "Other" },
];

const SEVERITY_OPTIONS = [
  { id: "low", label: "Low", color: "bg-surface-container-high text-on-surface-variant" },
  { id: "medium", label: "Medium", color: "bg-primary-fixed text-primary" },
  { id: "high", label: "High", color: "bg-secondary-fixed text-secondary" },
  { id: "critical", label: "Critical", color: "bg-error-container text-on-error-container" },
];

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [location, setLocation] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef(null);
  const fileRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize camera stream
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsCameraActive(true); // Mount video tag first
      
      // Delay slightly to allow React to mount the video element
      setTimeout(async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (innerErr) {
          console.warn("Camera init failed:", innerErr);
          setIsCameraActive(false);
        }
      }, 50);
    } catch (err) {
      console.warn("Camera access denied:", err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setImage(dataUrl);
      setImagePreview(dataUrl);
      stopCamera();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target.result);
      setImagePreview(ev.target.result);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 12.9716, lng: 77.5946 }) // Default Bangalore
      );
    } else {
      setLocation({ lat: 12.9716, lng: 77.5946 });
    }
  };

  const analyzeWithAI = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/ai/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, description }),
      });

      if (res.ok) {
        const result = await res.json();
        setAiResult(result);
        setCategory(result.category || "");
        setSeverity(result.severity || "medium");
        setStep(2);
      } else {
        setStep(2);
      }
    } catch (err) {
      console.error("AI analysis failed:", err);
      setStep(2);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: aiResult?.title || `${CATEGORIES.find((c) => c.id === category)?.label || "Issue"} report`,
          description,
          category,
          severity,
          department: aiResult?.department || "Public Works Department",
          lat: location?.lat,
          lng: location?.lng,
          ai_summary: aiResult?.summary,
          ai_confidence: aiResult?.confidence,
          ai_category: aiResult?.category,
          reporter_name: "Rajesh M.",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReportId(data.id);
        setSubmitted(true);
        setStep(3);
      }
    } catch (err) {
      console.error("Submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (step === 1 && !imagePreview) {
      startCamera();
    }
    return () => stopCamera();
  }, [step, imagePreview]);

  if (submitted) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-tertiary-fixed flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-tertiary text-[40px] material-symbols-filled">check_circle</span>
          </div>
          <h2 className="text-headline-lg text-on-surface mb-2">Report Submitted!</h2>
          <p className="text-body-lg text-on-surface-variant mb-2">Report ID: #{reportId}</p>
          <p className="text-body-md text-on-surface-variant mb-8 max-w-md">
            Your grievance has been registered and routed to{" "}
            <span className="font-bold text-primary">{aiResult?.department || "the appropriate department"}</span>.
          </p>
          <div className="flex gap-3">
            <Link href="/" className="px-6 py-3 bg-primary text-on-primary rounded-full text-label-md font-bold">
              Go Home
            </Link>
            <button
              onClick={() => { setSubmitted(false); setStep(1); setImage(null); setImagePreview(null); setDescription(""); setAiResult(null); }}
              className="px-6 py-3 border-2 border-primary text-primary rounded-full text-label-md font-bold"
            >
              Report Another
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-md mx-auto w-full pb-32 md:pb-8">
        {/* Progress Stepper */}
        <div className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md px-4 py-4 border-b border-outline-variant">
          <div className="flex items-center justify-center gap-4 mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full transition-colors ${step >= s ? "bg-primary" : "bg-surface-container-highest"}`} />
                {s < 3 && <div className={`w-12 h-1 rounded-full transition-colors ${step > s ? "bg-primary" : "bg-surface-container-highest"}`} />}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-headline-md text-on-surface">AI Quick Report</h1>
            <p className="text-label-sm text-on-surface-variant">
              {step === 1 ? "Step 1: Capture Evidence" : step === 2 ? "Step 2: Review & Submit" : "Step 3: Confirmed"}
            </p>
          </div>
        </div>

        <div className="px-4 pt-6 space-y-6">
          {step === 1 && (
            <>
              {/* Camera / Upload */}
              <section className="relative overflow-hidden rounded-xl bg-inverse-surface aspect-[3/4] shadow-md flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover absolute inset-0 ${isCameraActive && !imagePreview ? "block" : "hidden"}`}
                />

                {imagePreview ? (
                  <div className="w-full h-full bg-cover bg-center absolute inset-0" style={{ backgroundImage: `url(${imagePreview})` }} />
                ) : !isCameraActive ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-inverse-on-surface gap-4 absolute inset-0">
                    <span className="material-symbols-outlined text-[64px] opacity-30">photo_camera</span>
                    <p className="text-body-md opacity-50">Upload or capture a photo</p>
                  </div>
                ) : null}

                {/* GPS Badge */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-white border border-white/20 z-25">
                  <span className="material-symbols-outlined material-symbols-filled text-[18px]">location_on</span>
                  <span className="text-label-sm">
                    {location ? `${location.lat.toFixed(4)}° N, ${location.lng.toFixed(4)}° E` : "Tap to get GPS"}
                  </span>
                </div>

                {/* AI Analysis Banner */}
                {analyzing && (
                  <div className="absolute bottom-20 inset-x-4 z-25">
                    <div className="bg-primary/90 text-on-primary p-3 rounded-lg flex items-center gap-3 backdrop-blur-sm">
                      <span className="material-symbols-outlined animate-spin" style={{ animationDuration: "3s" }}>auto_awesome</span>
                      <div>
                        <p className="text-label-sm leading-tight opacity-80">AI Analyzing...</p>
                        <p className="text-label-md font-bold">Detecting Issue Type</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shutter Controls */}
                <div className="absolute bottom-4 inset-x-0 flex justify-around items-center px-8 z-25">
                  <button onClick={() => fileRef.current?.click()} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                    <span className="material-symbols-outlined">image</span>
                  </button>
                  <button onClick={isCameraActive ? capturePhoto : startCamera} className="w-16 h-16 rounded-full bg-white border-4 border-white/30 flex items-center justify-center active:scale-90 transition-transform">
                    <div className="w-12 h-12 rounded-full border-2 border-black/5" />
                  </button>
                  <button onClick={getLocation} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                    <span className="material-symbols-outlined">my_location</span>
                  </button>
                </div>

                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </section>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-label-md text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                  Describe Issue
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none resize-none"
                  placeholder="Provide more details for faster resolution..."
                  rows={3}
                />
              </div>

              {/* Analyze Button */}
              <button
                onClick={() => { if (!location) getLocation(); analyzeWithAI(); }}
                disabled={analyzing || (!image && !description)}
                className="w-full bg-primary text-on-primary py-4 rounded-full shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-label-md font-bold"
              >
                <span className="material-symbols-outlined">auto_awesome</span>
                {analyzing ? "Analyzing..." : "Analyze with AI"}
              </button>

              {/* Skip AI */}
              <button
                onClick={() => { if (!location) getLocation(); setStep(2); }}
                className="w-full text-primary text-label-md py-2 hover:underline"
              >
                Skip AI analysis →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {/* AI Result Banner */}
              {aiResult && (
                <div className="bg-primary-fixed border border-primary/20 p-4 rounded-xl animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                    <span className="text-label-md text-primary font-bold">AI Analysis Complete</span>
                    <span className="ml-auto text-label-sm text-on-surface-variant">
                      {Math.round((aiResult.confidence || 0) * 100)}% confidence
                    </span>
                  </div>
                  {aiResult.summary && <p className="text-body-md text-on-surface-variant mt-1">{aiResult.summary}</p>}
                  {aiResult.department && (
                    <p className="text-label-sm text-primary mt-2">
                      <span className="material-symbols-outlined text-[14px] align-text-bottom">arrow_forward</span> Routing to: <span className="font-bold">{aiResult.department}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="w-full h-40 rounded-xl overflow-hidden border border-outline-variant">
                  <img src={imagePreview} alt="Report" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Category Selection */}
              <div className="space-y-3">
                <label className="text-label-md text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">category</span>
                  {aiResult ? "AI Suggested Category" : "Select Category"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        category === cat.id
                          ? "border-primary bg-primary-fixed/30 text-primary"
                          : "border-outline-variant bg-surface text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      <span className={`material-symbols-outlined ${category === cat.id ? "material-symbols-filled" : ""}`}>{cat.icon}</span>
                      <span className="text-label-md">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div className="space-y-3">
                <label className="text-label-md text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">priority_high</span>
                  Severity Level
                </label>
                <div className="flex gap-2">
                  {SEVERITY_OPTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSeverity(s.id)}
                      className={`flex-1 py-2 px-3 rounded-lg text-label-md font-bold text-center transition-all border-2 ${
                        severity === s.id ? `${s.color} border-current` : "border-outline-variant text-on-surface-variant"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-label-md text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  placeholder="Provide more details..."
                  rows={3}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!category || submitting}
                className="w-full bg-secondary-container text-on-secondary-container text-label-md font-bold py-4 rounded-full shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
              >
                <span>{submitting ? "Submitting..." : "Submit Grievance"}</span>
                <span className="material-symbols-outlined">send</span>
              </button>

              <button onClick={() => setStep(1)} className="w-full text-primary text-label-md py-2 hover:underline">
                ← Back to capture
              </button>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
