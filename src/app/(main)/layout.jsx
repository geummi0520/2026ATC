import ComingSoon from "@/components/common/ComingSoon";
import MainLayout from "@/components/layout/MainLayout";

export default function MainGroupLayout({ children }) {
  const isSiteOpen = process.env.SITE_VISIBILITY === "open";

  if (!isSiteOpen) {
    return (
      <MainLayout isComingSoon>
        <ComingSoon />
      </MainLayout>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}
