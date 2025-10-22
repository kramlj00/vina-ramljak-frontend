"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-in">
      <div className="container mx-auto">
        <div className="glass-strong rounded-lg p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-playfair font-semibold text-lg mb-2">
                Cookie Notice
              </h3>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience and analyze
                our traffic. By clicking &quot;Accept&quot;, you consent to our
                use of cookies.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={declineCookies}
                className="border-border/50"
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={acceptCookies}
                className="bg-primary hover:bg-primary/90"
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
