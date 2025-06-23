import Hero from "@/components/hero";
import Featured from "@/components/featured";
import Services from "@/components/services";
import Footer from "@/components/footer";
import HostDashboard from "./hostDashboard/page";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Featured />
      <Services />
      <Footer />
    </>
  );
}