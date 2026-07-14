import React, { useState, useEffect } from "react";
import { User, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase.ts";
import { 
  Crown, LogIn, LogOut, CheckCircle2, Shield, 
  Sparkles, FileSpreadsheet, Loader2, ExternalLink 
} from "lucide-react";
import { syncNFTsToGoogleSheet } from "../utils/workspace.ts";

interface UserProfileProps {
  onUserUpdate: (user: User | null, isPremium: boolean, accessToken: string | null) => void;
  allNFTs: any[];
}

export default function UserProfile({ onUserUpdate, allNFTs }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncingSheets, setSyncingSheets] = useState(false);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showMockCheckout, setShowMockCheckout] = useState(false);

  useEffect(() => {
    // Listen to Firebase Authentication state shifts
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch/sync user record and premium state from Cloud SQL
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await fetch("/api/users/me", {
            headers: {
              Authorization: `Bearer ${idToken}`
            }
          });
          if (response.ok) {
            const dbUser = await response.json();
            setIsPremium(dbUser.isPremium);
            onUserUpdate(firebaseUser, dbUser.isPremium, accessToken);
          }
        } catch (err) {
          console.error("Failed to sync user with PostgreSQL:", err);
        }
      } else {
        setIsPremium(false);
        setAccessToken(null);
        onUserUpdate(null, false, null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [accessToken]);

  // Handle Google OAuth and Sign In
  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = (await import("firebase/auth")).GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken || null;
      setAccessToken(token);
      
      // Notify parent of authenticated session
      onUserUpdate(result.user, isPremium, token);
    } catch (err) {
      console.error("Google login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setAccessToken(null);
      setSheetUrl(null);
      onUserUpdate(null, false, null);
    } catch (err) {
      console.error("Sign out failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger Stripe checkout session ($0.50 cents charge) or fall back to simulation
  const handleUpgradePremium = async () => {
    if (!user) return;
    setPaymentLoading(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        }
      });

      const data = await response.json();
      if (response.ok && data.url) {
        // Redirect to real Stripe billing screen
        window.location.href = data.url;
      } else {
        // Stripe key is missing or not configured on server. Open interactive simulation modal
        setShowMockCheckout(true);
      }
    } catch (err) {
      console.error("Payment trigger failed:", err);
      setShowMockCheckout(true);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Confirm simulated 50 cents payment
  const handleSimulatePayment = async () => {
    if (!user) return;
    setPaymentLoading(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/stripe/mock-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        }
      });
      if (res.ok) {
        setIsPremium(true);
        onUserUpdate(user, true, accessToken);
        setShowMockCheckout(false);
      } else {
        alert("Simulated upgrade failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Sync published NFTs to Google Sheets
  const handleSyncToSheets = async () => {
    if (!accessToken) {
      alert("Google OAuth session not active. Please sign in again to authorize Sheets access.");
      return;
    }
    setSyncingSheets(true);
    setSheetUrl(null);
    try {
      const result = await syncNFTsToGoogleSheet(accessToken, allNFTs);
      setSheetUrl(result.spreadsheetUrl);
    } catch (err: any) {
      alert("Failed to export to Google Sheets. Ensure spreadsheet permissions are approved in OAuth popup.");
    } finally {
      setSyncingSheets(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 size={16} className="animate-spin text-[#7C3AED]" />
      </div>
    );
  }

  return (
    <div className="bg-[#121212] border border-white/10 p-5 rounded-none space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        {/* Connection status branding */}
        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 font-mono font-bold">
            USER IDENTITY & WALLET GATEWAY
          </h3>
          <p className="text-[11px] text-white/60 mt-1">
            Sign in with Google to sync Stacks SIP-009 assets, log into Google Workspace, and unlock premium themes.
          </p>
        </div>

        {/* Identity actions */}
        <div>
          {!user ? (
            <button
              onClick={handleSignIn}
              className="px-5 py-2.5 bg-white text-black font-black uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-white/90 transition-all cursor-pointer rounded-none border border-white"
            >
              <LogIn size={14} />
              Connect with Google
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 border border-white/10 bg-black/40 px-3 py-1.5 rounded-none">
                {user.photoURL && (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || "Avatar"} 
                    className="w-5 h-5 rounded-none border border-white/20"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="text-left leading-none">
                  <span className="text-[11px] font-black uppercase block tracking-wide truncate max-w-[120px]">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                  <span className="text-[9px] font-mono text-white/40 block">
                    {isPremium ? "ULTRA PREMIUM" : "STANDARD MEMBER"}
                  </span>
                </div>
                {isPremium ? (
                  <div className="w-5 h-5 bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center text-[10px] shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                    👑
                  </div>
                ) : (
                  <div className="w-5 h-5 bg-white/5 border border-white/10 flex items-center justify-center text-[9px] text-white/40 font-mono">
                    ST
                  </div>
                )}
              </div>

              <button
                onClick={handleSignOut}
                className="p-2.5 bg-white/5 hover:bg-rose-950/20 text-white/60 hover:text-rose-400 border border-white/10 hover:border-rose-900/30 transition-all cursor-pointer rounded-none"
                title="Disconnect Account"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {user && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/10">
          
          {/* Stripe Billing Gate (Charge 50¢) */}
          <div className="p-4 bg-black/40 border border-white/10 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1">
                <Crown size={12} />
                STRIPE MONETIZATION GATEWAY
              </span>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                {isPremium ? "Account Tier: Ultra Premium" : "Account Tier: Standard User"}
              </h4>
              <p className="text-[11px] text-white/60 leading-normal">
                {isPremium 
                  ? "Thank you! You have successfully paid 50¢ to unlock ChatMint Ultra. All exclusive themes, border options, and HD layout modes are permanently active." 
                  : "Upgrade your profile for just 50¢ to unlock custom design presets (Royal Gold & ChatMint Ultra), high-definition rendering modes, and certified blockchain status badges."}
              </p>
            </div>

            {!isPremium && (
              <button
                onClick={handleUpgradePremium}
                disabled={paymentLoading}
                className="w-full py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#F472B6] hover:from-[#6D28D9] hover:to-[#EC4899] text-white font-black uppercase text-xs tracking-wider flex items-center justify-center gap-1.5 cursor-pointer rounded-none"
              >
                {paymentLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <>
                    <Sparkles size={13} />
                    Upgrade Profile (50¢ via Stripe)
                  </>
                )}
              </button>
            )}
          </div>

          {/* Google Workspace Client Operations */}
          <div className="p-4 bg-black/40 border border-white/10 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#7C3AED] font-bold flex items-center gap-1">
                <Shield size={12} />
                GOOGLE WORKSPACE UTILITIES
              </span>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Centralized Workspace Cloud Backup
              </h4>
              <p className="text-[11px] text-white/60 leading-normal">
                Export and archive all tokenized Bitcoin NFTs directly into a live Google Sheets spreadsheet. Synchronize with calendar celebrate timelines or task lists.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleSyncToSheets}
                disabled={syncingSheets || allNFTs.length === 0}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer rounded-none transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                {syncingSheets ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <>
                    <FileSpreadsheet size={14} className="text-emerald-400" />
                    Archive Gallery to Google Sheets
                  </>
                )}
              </button>

              {sheetUrl && (
                <a
                  href={sheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 justify-center hover:underline"
                >
                  Spreadsheet Created! Click here to open
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stripe Payment Interactive Simulator Modal */}
      {showMockCheckout && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#111111] border-2 border-[#7C3AED] max-w-sm w-full p-6 text-center space-y-5 shadow-[0_0_30px_rgba(124,58,237,0.4)]">
            <div className="w-12 h-12 bg-[#7C3AED]/20 border border-[#7C3AED] flex items-center justify-center text-[#7C3AED] mx-auto rounded-none">
              💳
            </div>
            
            <div className="space-y-1.5">
              <h4 className="text-sm font-black uppercase tracking-wider text-white">
                Stripe Billing Simulator
              </h4>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Stripe keys are in developer configuration mode. Complete this secure simulation sandbox to authorize the <strong>$0.50 charge</strong> and register your Premium upgrade in PostgreSQL.
              </p>
            </div>

            <div className="p-3.5 bg-black border border-white/10 text-left rounded-none space-y-2 text-xs">
              <div className="flex justify-between font-mono text-[10px] text-white/40">
                <span>MERCHANT: CHATMINT.AI</span>
                <span>AMOUNT: $0.50 USD</span>
              </div>
              <div className="text-[11px] font-bold text-white uppercase mt-1">
                Premium License activation key
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowMockCheckout(false)}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-none text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulatePayment}
                disabled={paymentLoading}
                className="flex-1 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-none text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                {paymentLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  "Pay 50¢ & Upgrade"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
