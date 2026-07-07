import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { FileText, Zap, CreditCard, BookOpen, ArrowRight } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary" />
            <h1 className="text-2xl font-black">Academic Translator</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
                <Button
                  onClick={() => setLocation("/credits")}
                  variant="outline"
                >
                  Buy Credits
                </Button>
                <Button
                  onClick={() => logout()}
                  variant="outline"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-primary text-white">Sign In</Button>
              </a>
            )}
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container py-20">
          {/* Language Support Banner */}
          <div className="mb-16 pb-12 border-b-2 border-primary">
            <div className="mb-6">
              <p className="text-5xl font-black leading-tight text-primary mb-2">
                22 Languages
              </p>
              <p className="text-4xl font-black leading-tight">
                Academic Video Translation
              </p>
            </div>
            <p className="text-sm text-muted-foreground italic leading-relaxed max-w-4xl">
              Urdu • Bengali • Hindi • German • French • English • Italian • Spanish • Finnish • Estonian • Indonesian • Malay • Japanese • Korean • Chinese • Swedish • Norwegian • Danish • Dutch • Persian • Turkish • Arabic
            </p>
          </div>
          
          <div className="swiss-grid">
            <div>
              <h2 className="text-5xl font-black mb-6 leading-tight">
                No Language Barriers
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Perform video transcription, academic translation, and document merging all on one platform. Automatic transcription with Whisper API, high-quality academic translation powered by LLM.
              </p>
              
              <div className="flex gap-4">
                {isAuthenticated ? (
                  <>
                    <Button
                      onClick={() => setLocation("/workflow")}
                      className="bg-primary text-white gap-2 px-8 py-6 text-lg"
                    >
                      Start Workflow
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => setLocation("/documentation")}
                      variant="outline"
                      className="px-8 py-6 text-lg"
                    >
                      Documentation
                    </Button>
                  </>
                ) : (
                  <>
                    <a href={getLoginUrl()}>
                      <Button className="bg-primary text-white gap-2 px-8 py-6 text-lg">
                        Get Started
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </a>
                    <Button
                      onClick={() => setLocation("/documentation")}
                      variant="outline"
                      className="px-8 py-6 text-lg"
                    >
                      Documentation
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-full aspect-square bg-primary/10 flex items-center justify-center rounded-none">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Academic Translation Tool</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="border-b border-border">
        <div className="container py-20">
          <h3 className="text-4xl font-black mb-12">Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: FileText,
                title: "Transcription",
                description: "Automatic transcription from audio and video files using Whisper API. Output in JSON format.",
              },
              {
                icon: Zap,
                title: "Academic Translation",
                description: "High-quality academic translation powered by Claude Sonnet 4.6. Terminology preserved, context considered.",
              },
              {
                icon: FileText,
                title: "Document Merging",
                description: "Merge multiple sections into a single document. Download in Markdown and text formats.",
              },
              {
                icon: CreditCard,
                title: "Credit System",
                description: "Purchase credits based on your needs. Transparent pricing for every translation operation.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary flex-shrink-0" />
                    <div>
                      <h4 className="text-xl font-black mb-2">{feature.title}</h4>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Workflow Steps */}
      <section className="border-b border-border">
        <div className="container py-20">
          <h3 className="text-4xl font-black mb-12">Workflow</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Upload", desc: "Upload JSON transcription file" },
              { step: 2, title: "Extract", desc: "Extract text from JSON" },
              { step: 3, title: "Translate", desc: "Perform academic translation" },
              { step: 4, title: "Merge", desc: "Merge documents and download" },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary text-white flex items-center justify-center font-black text-2xl mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-black text-center mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground text-center">{item.desc}</p>
                </div>
                {item.step < 4 && (
                  <div className="hidden md:block absolute top-8 -right-3 w-6 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section>
        <div className="container py-20">
          <div className="bg-primary text-white p-12 rounded-none">
            <div className="max-w-2xl">
              <h3 className="text-4xl font-black mb-4">Get Started Today</h3>
              <p className="text-lg mb-8 opacity-90">
                Begin translating academic videos by signing in and uploading your first transcription file.
              </p>
              
              <div className="flex gap-4">
                {isAuthenticated ? (
                  <>
                    <Button
                      onClick={() => setLocation("/workflow")}
                      className="bg-white text-primary font-bold px-8 py-3"
                    >
                      Start Workflow
                    </Button>
                    <Button
                      onClick={() => setLocation("/credits")}
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 px-8 py-3"
                    >
                      Buy Credits
                    </Button>
                  </>
                ) : (
                  <>
                    <a href={getLoginUrl()}>
                      <Button className="bg-white text-primary font-bold px-8 py-3">
                        Sign In
                      </Button>
                    </a>
                    <Button
                      onClick={() => setLocation("/documentation")}
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 px-8 py-3"
                    >
                      Learn More
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container py-8 text-center text-muted-foreground">
          <p>© 2026 Academic Video Translator. All rights reserved.</p>
          <div className="flex gap-6 justify-center mt-4 text-sm">
            <button onClick={() => setLocation("/credits")} className="hover:text-foreground">
              Buy Credits
            </button>
            <button onClick={() => setLocation("/documentation")} className="hover:text-foreground">
              Documentation
            </button>
            <a href="https://manus.im" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              Manus
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
