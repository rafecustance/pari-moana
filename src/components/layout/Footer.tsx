import Image from "next/image";

/**
 * Footer component for compliance/legal information
 * Subtle, single-line layout with logo and disclaimer text
 */
export function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="content-wide py-4">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <Image
            src="https://assets.parimoana.co.nz/assets/logos/Team%20Group%20Horizontal%20Navy.webp"
            alt="Team Group Realty"
            width={100}
            height={28}
            className="h-5 w-auto object-contain"
          />
          <p className="font-basis text-muted text-sm tracking-normal normal-case">
            Property listed by Team Group Realty Ltd licensed under REAA 2008 © 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
