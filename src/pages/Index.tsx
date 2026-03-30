import { useState, useCallback, useRef, useEffect } from "react";
import LoginScreen from "@/components/LoginScreen";
import OnboardingScreen, { type UserProfile } from "@/components/OnboardingScreen";
import UploadScreen from "@/components/UploadScreen";
import LoadingScreen from "@/components/LoadingScreen";
import Dashboard from "@/components/Dashboard";
import ErrorScreen from "@/components/ErrorScreen";
import { uploadStatement, analyzeDemoPortfolio } from "@/lib/api";
import type { PortfolioData } from "@/lib/demoData";

type Screen = "login" | "onboarding" | "upload" | "loading" | "dashboard" | "error";

interface AuthUser { name: string; email: string; }

const Index = () => {
  const [screen, setScreen]           = useState<Screen>("login");
  const [user, setUser]               = useState<AuthUser | null>(null);
  const [data, setData]               = useState<PortfolioData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [uploadWarning, setUploadWarning] = useState(false);
  const dataReadyRef = useRef(false);

  // Restore login from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mf_user");
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        setUser(parsed);
        setScreen("onboarding");
      }
    } catch { /* ignore */ }
  }, []);

  const handleLogin = useCallback((name: string, email: string) => {
    setUser({ name, email });
    setScreen("onboarding");
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("mf_user");
    setUser(null);
    setData(null);
    setUserProfile(null);
    dataReadyRef.current = false;
    setScreen("login");
  }, []);

  const startAnalysis = useCallback(async (file: File | null, profile: UserProfile) => {
    setScreen("loading");
    setUploadWarning(false);
    dataReadyRef.current = false;
    try {
      const result = file
        ? await uploadStatement(file, profile.riskProfile)
        : await analyzeDemoPortfolio(profile.riskProfile);
      if ((result as any)._uploadFailed) setUploadWarning(true);
      setData(result);
      dataReadyRef.current = true;
    } catch {
      setScreen("error");
    }
  }, []);

  const handleOnboardingComplete = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    setScreen("upload");
  }, []);

  const handleUpload = useCallback((file: File) => {
    if (userProfile) startAnalysis(file, userProfile);
  }, [userProfile, startAnalysis]);

  const handleDemo = useCallback(() => {
    if (userProfile) startAnalysis(null, userProfile);
  }, [userProfile, startAnalysis]);

  const handleLoadingComplete = useCallback(() => {
    if (dataReadyRef.current) {
      setScreen("dashboard");
    } else {
      const interval = setInterval(() => {
        if (dataReadyRef.current) { clearInterval(interval); setScreen("dashboard"); }
      }, 500);
      setTimeout(() => { clearInterval(interval); setScreen("error"); }, 40000);
    }
  }, []);

  // "Analyse another file" — keep profile + login, back to upload
  const handleAnalyseAnother = useCallback(() => {
    setScreen("upload");
    setData(null);
    setUploadWarning(false);
    dataReadyRef.current = false;
  }, []);

  // Exit — back to upload screen (keeps session)
  const handleExit = useCallback(() => {
    setScreen("upload");
    setData(null);
    setUploadWarning(false);
    dataReadyRef.current = false;
  }, []);

  const handleRetry = useCallback(() => {
    setScreen("upload");
    setData(null);
    setUploadWarning(false);
    dataReadyRef.current = false;
  }, []);

  return (
    <>
      {screen === "login"      && <LoginScreen onLogin={handleLogin} />}
      {screen === "onboarding" && <OnboardingScreen onComplete={handleOnboardingComplete} userName={user?.name} />}
      {screen === "upload"     && <UploadScreen onUpload={handleUpload} onDemo={handleDemo} userName={user?.name} onLogout={handleLogout} />}
      {screen === "loading"    && <LoadingScreen onComplete={handleLoadingComplete} />}
      {screen === "dashboard"  && data && (
        <Dashboard
          data={data}
          userName={user?.name || userProfile?.name}
          userProfile={userProfile ?? undefined}
          uploadWarning={uploadWarning}
          onAnalyseAnother={handleAnalyseAnother}
          onExit={handleExit}
          onLogout={handleLogout}
        />
      )}
      {screen === "error" && <ErrorScreen onRetry={handleRetry} />}
    </>
  );
};

export default Index;
