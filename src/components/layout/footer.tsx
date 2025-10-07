import Link from 'next/link';
import { Bot, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">AI-Solutions</span>
            </Link>
            <p className="text-muted-foreground">
              Building the future of intelligent automation.
            </p>
            <div className="flex space-x-4">
              <Link href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Visit our Twitter/X page</span>
                <Twitter />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Visit our LinkedIn page</span>
                <Linkedin />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-headline font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Articles</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold">Services</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/services" className="text-muted-foreground hover:text-primary">Predictive Analytics</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary">Chatbot Solutions</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary">Custom Models</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AI-Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
