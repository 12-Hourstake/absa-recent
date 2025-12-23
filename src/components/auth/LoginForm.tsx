import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomAlert } from "@/components/ui/CustomAlert";
import { Loader2, Building2, Users, Wrench, ChevronDown, Shield } from "lucide-react";
import "./css/LoginForm.css";
import { Portal } from "@/types/auth";
import backgroundImage from "@/assets/images/background.jpg";

const LoginForm = () => {
  const { login, loginMainAdmin, alert, clearAlert } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [portal, setPortal] = useState<Portal>("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(true);
  const [showMainAdminModal, setShowMainAdminModal] = useState(false);
  const [mainAdminPin, setMainAdminPin] = useState("");



  useEffect(() => {
    const handleScroll = () => {
      const cardsElement = document.getElementById("demo-cards-section");
      if (cardsElement) {
        const rect = cardsElement.getBoundingClientRect();
        // Hide button when cards section is visible in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setShowScrollButton(false);
        } else {
          setShowScrollButton(true);
        }
      }
    };

    // Check on mount and add scroll listener
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const portalValidators = [
    {
      role: "Admin",
      portal: "admin" as Portal,
      icon: Building2,
      description: "Facility Manager / Head of Facilities",
    },
    {
      role: "Colleague Requester",
      portal: "colleague" as Portal,
      icon: Users,
      description: "Requester portal access",
    },
    {
      role: "Vendor Admin",
      portal: "vendor" as Portal,
      icon: Wrench,
      description: "Vendor portal access",
    },
  ];

  const scrollToCards = () => {
    const cardsElement = document.getElementById("demo-cards-section");
    if (cardsElement) {
      cardsElement.scrollIntoView({ behavior: "smooth", block: "start" });
      setShowScrollButton(false);
    }
  };

  const selectPortal = (selectedPortal: Portal) => {
    setPortal(selectedPortal);
  };

  const handleAutoLogin = async (portalType: Portal) => {
    setIsSubmitting(true);
    try {
      if (portalType === "vendor") {
        // Use the AuthContext login function with auto-login credentials
        await login({
          email: "auto@login.com",
          password: "auto",
          portal: "vendor"
        });
        window.location.href = "/vendor/dashboard";
      } else if (portalType === "admin") {
        // Use the AuthContext login function with auto-login credentials
        await login({
          email: "auto@login.com",
          password: "auto",
          portal: "admin"
        });
        window.location.href = "/admin/dashboard";
      }
    } catch (err) {
      console.error("Auto-login error:", err);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login({ email, password, portal });
      
      // Route based on portal
      console.log('Navigating to portal:', portal);
      if (portal === "admin") {
        navigate("/admin/dashboard");
      } else if (portal === "colleague") {
        navigate("/colleague/dashboard");
      } else if (portal === "vendor") {
        navigate("/vendor/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMainAdminLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginMainAdmin({ pin: mainAdminPin });
      setShowMainAdminModal(false);
      setMainAdminPin("");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Main admin login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{
        minWidth: "100vw",
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }}></div>

      {/* Login content - narrower responsive width */}
      <div
        className="relative flex flex-col w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl"
        style={{ zIndex: 2 }}
      >
        {/* Main Login Container */}
        <div className="flex flex-col md:flex-row">
          {/* Top/Left side - ABSA Facility Management */}
          <div className="w-full md:w-48 md:flex-shrink-0 bg-[#870A3C] rounded-t-lg md:rounded-l-lg md:rounded-tr-none shadow-lg flex flex-row md:flex-col items-center justify-center p-4 md:p-6 space-x-4 md:space-x-0 md:space-y-4">
            <div className="h-12 w-12 md:h-16 md:w-16 rounded-lg bg-white flex items-center justify-center shadow-md p-2 md:p-3 flex-shrink-0">
              <img
                src="/ABSA_Group_Limited_Logo.svg copy 2.png"
                alt="ABSA Facility Management"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-left md:text-center space-y-1 md:space-y-2">
              <h1 className="text-sm md:text-lg font-bold text-white leading-tight">
              ABSA Facility Management
              </h1>
              <p className="text-white/80 text-xs">CAFM System</p>
            </div>
          </div>

          {/* Bottom/Right side - Login Form */}
          <Card className="flex-1 bg-white/95 backdrop-blur-md shadow-lg border-l-0 md:border-t rounded-b-lg md:rounded-l-none md:rounded-r-lg border-t-0 md:border-t">
            <CardHeader className="text-center pb-2 px-4 pt-4">
              <CardTitle className="text-base md:text-lg font-semibold">
                Sign In
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Enter your credentials to access the system
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {alert && (
                  <CustomAlert
                    message={alert.message}
                    variant={alert.variant}
                    title={alert.title}
                    onDismiss={clearAlert}
                  />
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-10 md:h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-10 md:h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portal" className="text-sm">
                    Portal
                  </Label>
                  <Select value={portal} onValueChange={(value: Portal) => setPortal(value)} disabled={isSubmitting}>
                    <SelectTrigger className="h-10 md:h-11">
                      <SelectValue placeholder="Select portal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin Portal</SelectItem>
                      <SelectItem value="colleague">Colleague Portal</SelectItem>
                      <SelectItem value="vendor">Vendor Portal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-10 md:h-11 bg-[#870A3C] hover:bg-[#AF144B] text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative my-4 md:my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 py-1 text-gray-500 font-semibold">
                      Or sign in with
                    </span>
                  </div>
                </div>

                {/* Microsoft SSO Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 text-sm md:text-base font-medium group"
                  disabled={isSubmitting}
                  onClick={() => {
                    // TODO: Implement Microsoft SSO integration
                    // Redirect to Microsoft login endpoint
                    console.log("Microsoft SSO clicked");
                    window.alert("Microsoft SSO integration will be available soon!");
                  }}
                >
                  <svg
                    className="mr-3 h-5 w-5 transition-transform group-hover:scale-110"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0H10.9091V10.9091H0V0Z" fill="#F25022" />
                    <path
                      d="M12.0908 0H22.9999V10.9091H12.0908V0Z"
                      fill="#7FBA00"
                    />
                    <path
                      d="M0 12.0908H10.9091V22.9999H0V12.0908Z"
                      fill="#00A4EF"
                    />
                    <path
                      d="M12.0908 12.0908H22.9999V22.9999H12.0908V12.0908Z"
                      fill="#FFB900"
                    />
                  </svg>
                  <span className="text-gray-700 group-hover:text-gray-900">
                    Sign in with Microsoft
                  </span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Scroll Indicator Button - Only visible on small screens when cards are below fold */}
        {showScrollButton && (
          <button
            onClick={scrollToCards}
            className="md:hidden fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-[#870A3C] text-white rounded-full p-3 shadow-lg transition-all duration-300 animate-bounce"
            style={{ zIndex: 50 }}
            aria-label="Scroll to portal verification"
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        )}

        {/* Portal Access Verification - Responsive Layout Below Login Form */}
        <div
          id="demo-cards-section"
          className="mt-3 md:mt-4 bg-white/95 backdrop-blur-md shadow-lg border border-white/20 rounded-lg p-3 md:p-4"
        >
          <div className="text-center mb-2 md:mb-3">
            <h3 className="text-xs md:text-sm font-semibold text-gray-900">
              Portal Access Verification
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Select the portal you are verifying credentials for
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
            {/* Main Admin Card */}
            <div
              className={`flex flex-col items-center p-2.5 md:p-3 rounded-lg border-2 border-red-200 bg-red-50 transition-all duration-200 ${
                isSubmitting
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:shadow-md hover:bg-red-100 hover:border-red-300"
              }`}
              onClick={() => !isSubmitting && setShowMainAdminModal(true)}
            >
              <div className="flex flex-col items-center space-y-1.5 md:space-y-2 w-full">
                <div className="h-5 w-5 md:h-6 md:w-6 flex items-center justify-center">
                  <Shield className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                </div>
                <div className="text-center w-full">
                  <p className="text-xs font-medium text-red-900">
                    Main Admin
                  </p>
                  <p className="text-[10px] md:text-xs text-red-700 mt-0.5 md:mt-1">
                    PIN-based access, full system control
                  </p>
                </div>
              </div>
            </div>

            {/* Portal Validators */}
            {portalValidators.map((validator) => {
              const Icon = validator.icon;
              const isSelected = portal === validator.portal;
              const getRoleColor = (role: string) => {
                if (role === "Admin") {
                  return "hover:bg-blue-50 hover:border-blue-300 hover:shadow-blue-100";
                } else if (role === "Colleague Requester") {
                  return "hover:bg-green-50 hover:border-green-300 hover:shadow-green-100";
                } else if (role === "Vendor Admin") {
                  return "hover:bg-purple-50 hover:border-purple-300 hover:shadow-purple-100";
                }
                return "hover:bg-gray-50 hover:border-gray-300";
              };

              return (
                <div
                  key={validator.role}
                  className={`flex flex-col items-center p-2.5 md:p-3 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? "border-blue-300 bg-blue-50 shadow-md"
                      : "border-gray-200/50"
                  } ${
                    isSubmitting
                      ? "cursor-not-allowed opacity-50"
                      : `cursor-pointer hover:shadow-md ${getRoleColor(
                          validator.role
                        )}`
                  }`}
                  onClick={() => {
                    if (isSubmitting) return;
                    selectPortal(validator.portal);
                    if (validator.portal === "admin" || validator.portal === "vendor") {
                      handleAutoLogin(validator.portal);
                    }
                  }}
                >
                  <div className="flex flex-col items-center space-y-1.5 md:space-y-2 w-full">
                    <div className="h-5 w-5 md:h-6 md:w-6 flex items-center justify-center">
                      <Icon className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                    </div>
                    <div className="text-center w-full">
                      <p className="text-xs font-medium text-gray-900">
                        {validator.role}
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1 line-clamp-2">
                        {validator.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Admin PIN Modal */}
        <Dialog open={showMainAdminModal} onOpenChange={setShowMainAdminModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Main Admin Access
              </DialogTitle>
              <DialogDescription>
                Enter your 4-6 digit PIN to access the system as Main Administrator.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {alert && (
                <CustomAlert
                  message={alert.message}
                  variant={alert.variant}
                  title={alert.title}
                  onDismiss={clearAlert}
                />
              )}
              <div className="space-y-2">
                <Label htmlFor="pin">PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter PIN"
                  value={mainAdminPin}
                  onChange={(e) => setMainAdminPin(e.target.value)}
                  maxLength={6}
                  disabled={isSubmitting}
                  className="text-center text-lg tracking-widest"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowMainAdminModal(false);
                  setMainAdminPin("");
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleMainAdminLogin}
                disabled={isSubmitting || mainAdminPin.length < 4}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Access System"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LoginForm;
