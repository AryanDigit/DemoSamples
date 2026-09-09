import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { navLinks, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-navy-deep text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3">
        <div>
          <p className="font-script text-4xl text-gold">Let&apos;s Connect!</p>
          <div className="mt-6 flex items-center gap-3">
            <Logo />
            <div>
              <p className="font-display text-sm font-extrabold uppercase tracking-[0.16em]">
                {site.name}
              </p>
              <p className="text-xs text-ivory/70">{site.tagline}</p>
            </div>
          </div>
        </div>

        <ul className="space-y-3 text-sm">
          <li>
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2 hover:text-gold"
            >
              <Phone className="h-4 w-4 text-gold" />
              {site.phone}
            </a>
          </li>
          <li>
            <a
              href={site.emailHref}
              className="inline-flex items-center gap-2 break-all hover:text-gold"
            >
              <Mail className="h-4 w-4 text-gold" />
              {site.email}
            </a>
          </li>
          <li className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gold" />
            {site.location}
          </li>
        </ul>

        <nav className="flex flex-col gap-2 text-sm" aria-label="Footer">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-gold">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="bg-navy py-4 text-center text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold sm:text-xs">
        {site.banner}
      </div>
    </footer>
  );
}
