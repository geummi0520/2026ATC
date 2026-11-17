"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "@/utils/analytics";

// 페이지 로딩 속도 지표(LCP, INP, CLS, FCP, TTFB)를 GA로 보냄
export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    trackEvent("web_vitals", {
      metric_name: metric.name,
      // CLS는 소수점 값이라 1000배해서 정수로 보냄
      metric_value: Math.round(
        metric.name === "CLS" ? metric.value * 1000 : metric.value
      ),
      metric_rating: metric.rating,
      metric_id: metric.id,
      page_path: window.location.pathname,
      non_interaction: true,
    });
  });

  return null;
}
