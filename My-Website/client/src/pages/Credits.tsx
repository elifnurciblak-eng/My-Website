import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  bonus: number;
  popular?: boolean;
}

const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter",
    credits: 100,
    price: 5,
    bonus: 0,
  },
  {
    id: "standard",
    credits: 500,
    price: 20,
    bonus: 50,
    popular: true,
  },
  {
    id: "professional",
    credits: 1000,
    price: 35,
    bonus: 150,
  },
  {
    id: "enterprise",
    credits: 5000,
    price: 150,
    bonus: 1000,
  },
];

const USAGE_GUIDE = [
  {
    title: "Transcription",
    description: "1 minute of audio = 1 credit",
    icon: "🎙️",
  },
  {
    title: "Academic Translation",
    description: "1,000 characters = 5 credits",
    icon: "📝",
  },
  {
    title: "Document Merging",
    description: "1 document = 2 credits",
    icon: "📄",
  },
];

export default function Credits() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border">
          <div className="container py-8">
            <h1 className="text-5xl font-black mb-2">Buy Credits</h1>
            <p className="text-lg text-muted-foreground">Start buying credits by signing in</p>
          </div>
        </div>

        {/* Not Authenticated */}
        <div className="container py-20 flex items-center justify-center">
          <Card className="p-12 text-center max-w-md">
            <h2 className="text-2xl font-black mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in or create an account to purchase credits.
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="w-full bg-primary text-white"
            >
              Back to Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const handlePurchase = async (packageId: string) => {
    setSelectedPackage(packageId);
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      toast.success("Kredi başarıyla satın alındı!");
      setIsProcessing(false);
      setSelectedPackage(null);
    }, 2000);
  };

  const currentPackage = CREDIT_PACKAGES.find((p) => p.id === selectedPackage);
  const totalCredits = currentPackage
    ? currentPackage.credits + currentPackage.bonus
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container py-8">
          <h1 className="text-5xl font-black mb-2">Buy Credits</h1>
          <p className="text-lg text-muted-foreground">
            İhtiyacınıza göre credits paketini seçin ve hemen başlayın
          </p>
        </div>
      </div>

      {/* Current Balance */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Credit Balance</p>
              <p className="text-3xl font-black">1,250 credits</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Last Purchase</p>
              <p className="text-lg font-semibold">15 Aralık 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-20">
        {/* Usage Guide */}
        <div className="mb-20">
          <h2 className="text-3xl font-black mb-8">Credit Usage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {USAGE_GUIDE.map((item, idx) => (
              <Card key={idx} className="p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-black mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Credit Packages */}
        <div>
          <h2 className="text-3xl font-black mb-12">Credit Packages</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {CREDIT_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="relative">
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-primary text-white px-4 py-1 font-bold text-sm">
                      POPULAR
                    </div>
                  </div>
                )}

                <Card
                  className={`p-6 h-full flex flex-col ${
                    pkg.popular ? "border-primary border-2" : ""
                  }`}
                >
                  <div className="mb-6">
                    <div className="text-4xl font-black text-primary mb-2">
                      {pkg.credits.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Kredi</p>

                    {pkg.bonus > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-sm font-semibold text-primary">
                          + {pkg.bonus.toLocaleString()} bonus credits
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mb-6 flex-grow">
                    <div className="text-3xl font-black mb-1">${pkg.price}</div>
                    <p className="text-xs text-muted-foreground">
                      ${(pkg.price / pkg.credits).toFixed(3)}/credits
                    </p>
                  </div>

                  <Button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={isProcessing && selectedPackage === pkg.id}
                    className={`w-full ${
                      pkg.popular
                        ? "bg-primary text-white"
                        : "border-2 border-primary text-primary bg-white hover:bg-primary/5"
                    }`}
                  >
                    {isProcessing && selectedPackage === pkg.id ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        İşleniyor...
                      </>
                    ) : (
                      "Buy Now"
                    )}
                  </Button>
                </Card>
              </div>
            ))}
          </div>

          {/* Purchase Summary */}
          {currentPackage && (
            <Card className="p-8 bg-muted/50 mb-12">
              <h3 className="text-xl font-black mb-6">Buy Nowma Özeti</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">Kredi Paket ({currentPackage.credits})</span>
                  <span className="font-semibold">${currentPackage.price}</span>
                </div>
                {currentPackage.bonus > 0 && (
                  <div className="flex justify-between items-center pb-4 border-b border-border text-primary">
                    <span>Bonus Kredi ({currentPackage.bonus})</span>
                    <span className="font-semibold">Ücretsiz</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4">
                  <span className="font-black">Toplam Kredi</span>
                  <span className="text-2xl font-black text-primary">{totalCredits.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 pt-20 border-t border-border">
          <h2 className="text-3xl font-black mb-12">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: "How long are credits valid?",
                a: "Satın aldığınız creditsler hiç sona ermiyor. İstediğiniz zaman kullanabilirsiniz.",
              },
              {
                q: "Are refunds available?",
                a: "Satın alınan creditsler geri iade edilmez. Ancak kullanılmayan creditsler hesabınızda kalır.",
              },
              {
                q: "Are there different prices for different language pairs?",
                a: "Hayır, tüm dil çiftleri için aynı fiyat geçerlidir. Her 1,000 characters = 5 credits.",
              },
              {
                q: "Are there discounts for bulk purchases?",
                a: "Evet! Daha büyük paketler satın aldıkça birim fiyat düşüyor ve bonus credits alıyorsunuz.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept credit cards (Visa, Mastercard), PayPal, and bank transfers.",
              },
              {
                q: "Can I get an invoice?",
                a: "Yes, an automatic invoice is generated for all purchases and sent via email.",
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-6">
                <h4 className="font-black mb-3">{item.q}</h4>
                <p className="text-muted-foreground text-sm">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-20 pt-20 border-t border-border">
          <Card className="p-12 bg-primary text-white">
            <h3 className="text-2xl font-black mb-4">Need More Information?</h3>
            <p className="mb-6 opacity-90">
              If you have questions about credit packages, payment options, or other topics, our support team will be happy to help.
            </p>
            <div className="flex gap-4">
              <Button className="bg-white text-primary font-bold">
                Contact Support
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Documentation
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container py-8 text-center text-muted-foreground">
          <p>© 2026 Academic Video Translator. All rights reserved.</p>
          <div className="flex gap-6 justify-center mt-4 text-sm">
            <button className="hover:text-foreground">Privacy Policy</button>
            <button className="hover:text-foreground">Terms of Service</button>
            <a href="https://manus.im" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              Manus
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
