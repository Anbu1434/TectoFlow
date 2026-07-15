import Image from 'next/image';
import { Twitter, Linkedin, Dribbble, Phone } from 'lucide-react';
import { team as defaultTeam, type TeamMember } from '@/lib/team';
import { StaggerGroup, StaggerItem } from '@/components/site/reveal';
import { cn } from '@/lib/utils';
import { TiltCard } from '@/components/site/motion-components';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className={className}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.436 0 9.851-4.38 9.854-9.76.002-2.606-1.01-5.057-2.85-6.898-1.84-1.841-4.29-2.853-6.9-2.855-5.437 0-9.856 4.382-9.859 9.761-.001 1.905.5 3.758 1.45 5.362l-.957 3.498 3.632-.949zM15.75 12.87c-.205-.102-1.215-.6-1.402-.669-.188-.069-.325-.102-.461.102-.137.205-.53.669-.649.803-.12.134-.239.15-.444.048-.205-.102-.865-.32-1.647-1.017-.609-.544-1.02-1.216-1.14-1.42-.12-.205-.013-.316.089-.418.093-.092.205-.239.308-.359.102-.12.137-.205.205-.342.069-.137.034-.256-.017-.359-.052-.102-.461-1.111-.632-1.521-.167-.402-.334-.347-.461-.347-.12 0-.256-.008-.393-.008-.137 0-.359.052-.547.256-.188.205-.718.701-.718 1.709 0 1.009.734 1.983.837 2.12.102.137 1.444 2.205 3.498 3.09.488.21 1.002.336 1.503.495.698.222 1.332.191 1.833.116.558-.084 1.215-.496 1.385-.974.171-.479.171-.889.12-.974-.051-.085-.188-.137-.393-.24z" />
  </svg>
);

function SocialLink({
  href,
  label,
  external,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-accent hover:bg-accent hover:text-accent-foreground shadow-md hover:shadow-accent/20"
    >
      {children}
    </a>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const { social } = member;
  return (
    <TiltCard className="w-full h-full rounded-3xl">
      <div className="group relative w-full h-[420px] sm:h-[480px] overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:border-accent/30 hover:shadow-[0_0_50px_-12px_rgba(249,115,22,0.15)] ring-1 ring-transparent hover:ring-accent/20">
        {/* Photo Container */}
        <div className="absolute inset-0 z-0">
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            priority
          />
          {/* Base gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/10 transition-opacity duration-500 group-hover:opacity-90" />
          
          {/* Ambient hover glow */}
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent/20 blur-[60px] opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none" />
        </div>

        {/* Info overlay (always at bottom) */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col p-6 text-white justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          {/* Role badge and Name */}
          <div className="transform translate-y-0 transition-transform duration-500 ease-out group-hover:-translate-y-1">
            <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-accent mb-2 bg-accent/15 border border-accent/30 px-2.5 py-0.5 rounded-full backdrop-blur-md">
              {member.role}
            </span>
            <h3 className="font-display text-2xl font-bold tracking-tight text-white drop-shadow-md">
              {member.name}
            </h3>
          </div>

          {/* Slide-up drawer for details */}
          <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 transition-all duration-500 ease-out">
            <div className="overflow-hidden">
              {/* Bio description */}
              <p className="text-sm text-neutral-300 leading-relaxed pt-3 border-t border-white/10 mt-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75 ease-out">
                {member.bio}
              </p>

              {/* Social icons row */}
              <div className="mt-4 flex items-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150 ease-out">
                {social.whatsapp && (
                  <SocialLink href={social.whatsapp} label={`${member.name} on WhatsApp`} external>
                    <WhatsAppIcon className="h-4 w-4" />
                  </SocialLink>
                )}
                {social.phone && (
                  <SocialLink href={social.phone} label={`${member.name} Phone`}>
                    <Phone className="h-4 w-4" />
                  </SocialLink>
                )}
                {social.twitter && (
                  <SocialLink href={social.twitter} label={`${member.name} on Twitter`} external>
                    <Twitter className="h-4 w-4" />
                  </SocialLink>
                )}
                {social.linkedin && (
                  <SocialLink href={social.linkedin} label={`${member.name} on LinkedIn`} external>
                    <Linkedin className="h-4 w-4" />
                  </SocialLink>
                )}
                {social.dribbble && (
                  <SocialLink href={social.dribbble} label={`${member.name} on Dribbble`} external>
                    <Dribbble className="h-4 w-4" />
                  </SocialLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

export function TeamGrid({ teamMembers = defaultTeam }: { teamMembers?: TeamMember[] }) {
  return (
    <StaggerGroup className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
      {teamMembers.map((member) => (
        <StaggerItem key={member.name} className="w-full">
          <TeamCard member={member} />
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
