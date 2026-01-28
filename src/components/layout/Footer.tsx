import Image from "next/image";

/**
 * Footer component for compliance/legal information
 * Subtle, single-line layout with logo and disclaimer text
 */
export function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="content-wide py-4">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Image
            src="https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/logos/Team%20Group%20Horizontal%20Navy.webp"
            alt="Team Group Realty"
            width={120}
            height={32}
            className="h-6 w-auto object-contain"
          />
          <p className="text-muted text-sm tracking-normal normal-case">
            Property listed by Team Group Realty Ltd licensed under REAA 2008 © 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
