// src/app/layout.js
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/navbar";
import Cta from "@/components/cta"
import Footer from "@/components/footer";
import FloatingWidgets from "@/components/FloatingWidgets";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

// Google Tag Manager container ID
const GTM_ID = "GTM-TR7VLN9C";

export const metadata = {
  metadataBase: new URL("https://pkrestates.com"),
  title: {
    default: "PKR Estates | Luxury & Affordable Residential Apartments in Chennai",
    template: "%s | PKR Estates",
  },
  description:
    "PKR Estates builds thoughtfully designed RERA-approved residential apartments, villas, and gated communities in Chennai, including Gurudev and Privana at Guduvancheri.",
  keywords: [
    "PKR Estates",
    "apartments in Chennai",
    "Guduvancheri apartments",
    "PKR Gurudev",
    "PKR Privana",
    "real estate builders Chennai",
    "RERA approved flats Chennai",
  ],
  openGraph: {
    title: "PKR Estates | Luxury & Affordable Residential Apartments in Chennai",
    description:
      "Discover thoughtfully crafted 1, 2 & 3 BHK homes and studio apartments by PKR Estates in Chennai.",
    url: "https://pkrestates.com",
    siteName: "PKR Estates",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.variable}>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>

      <body className={geist.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <Navbar />
        {children}
        <Cta />
        <Footer />
        <FloatingWidgets />
      </body>
    </html>
  );
}