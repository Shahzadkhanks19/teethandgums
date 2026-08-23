import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";
import ScrollToTop from "@/components/ScrollToTop";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ScrollToTop />
      <Header />
      {children}
      <Footer />
      <FloatingButtons />
    </>
  );
}