// src/components/LiveChatWidget.jsx
import { useEffect } from "react";

const LiveChatWidget = () => {
  useEffect(() => {
    // Prevent duplicate load
    if (document.getElementById("livechat-script")) return;

    // Set LiveChat config before loading
    window.__lc = window.__lc || {};
    window.__lc.license = 19190239;
    window.__lc.integration_name = "manual_channels";
    window.__lc.product_name = "livechat";

    const script = document.createElement("script");
    script.src = "https://cdn.livechatinc.com/tracking.js";
    script.async = true;
    script.id = "livechat-script";

    script.onload = () => {
      console.log("✅ LiveChat script loaded");
    };

    script.onerror = (err) => {
      console.error("❌ LiveChat script failed to load", err);
    };

    document.head.appendChild(script);
  }, []);

  return null;
};

export default LiveChatWidget;
