"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  getAnalyticsConsentState,
  isConsentFirstMode,
  onAnalyticsConsentChange,
} from "@/lib/analytics/consent";

export function Analytics() {
  const [consentState, setConsentState] = useState(getAnalyticsConsentState);
  const ymId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
  const webvisorEnabled = process.env.NEXT_PUBLIC_YANDEX_METRIKA_WEBVISOR !== "false";
  const requiresConsent = isConsentFirstMode();
  const analyticsAllowed = !requiresConsent || consentState === "granted";

  useEffect(() => onAnalyticsConsentChange(() => setConsentState(getAnalyticsConsentState())), []);

  if (!ymId && !posthogKey) return null;
  if (!analyticsAllowed) return null;

  return (
    <>
      {ymId ? (
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(${ymId}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:${webvisorEnabled ? "true" : "false"}
            });
          `}
        </Script>
      ) : null}

      {posthogKey ? (
        <Script id="posthog-init" strategy="afterInteractive">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){
            function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){
            t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",
            p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",
            (r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);
            var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){
            var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){
            return u.toString(1)+".people"},o="capture identify alias people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.group.set people.group.set_once people.group.unset people.group.remove people.register people.unregister people.opt_in_capturing people.opt_out_capturing has_opted_in_capturing has_opted_out_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags startSessionRecording stopSessionRecording".split(" "),
            n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            window.posthog.init("${posthogKey}", { api_host: "${posthogHost}" });
          `}
        </Script>
      ) : null}
    </>
  );
}
