import Image from 'next/image';
import { Twitter, Linkedin, Dribbble, Phone } from 'lucide-react';
import { team as defaultTeam, type TeamMember } from '@/lib/team';
import { StaggerGroup, StaggerItem } from '@/components/site/reveal';
import { cn } from '@/lib/utils';
import { TiltCard } from '@/components/site/motion-components';

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <TiltCard className="h-full rounded-2xl">
      <div
        className="group relative overflow-hidden rounded-2xl border border-border bg-card h-full"
      >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          width={400}
          height={500}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />

        {/* Social links on hover */}
        <div
          className="absolute right-4 top-4 flex flex-col gap-2 transition-all duration-300 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
        >
          {member.social.whatsapp && (
            <a
              href={member.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on WhatsApp`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="h-4.5 w-4.5">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.436 0 9.851-4.38 9.854-9.76.002-2.606-1.01-5.057-2.85-6.898-1.84-1.841-4.29-2.853-6.9-2.855-5.437 0-9.856 4.382-9.859 9.761-.001 1.905.5 3.758 1.45 5.362l-.957 3.498 3.632-.949zM15.75 12.87c-.205-.102-1.215-.6-1.402-.669-.188-.069-.325-.102-.461.102-.137.205-.53.669-.649.803-.12.134-.239.15-.444.048-.205-.102-.865-.32-1.647-1.017-.609-.544-1.02-1.216-1.14-1.42-.12-.205-.013-.316.089-.418.093-.092.205-.239.308-.359.102-.12.137-.205.205-.342.069-.137.034-.256-.017-.359-.052-.102-.461-1.111-.632-1.521-.167-.402-.334-.347-.461-.347-.12 0-.256-.008-.393-.008-.137 0-.359.052-.547.256-.188.205-.718.701-.718 1.709 0 1.009.734 1.983.837 2.12.102.137 1.444 2.205 3.498 3.09.488.21 1.002.336 1.503.495.698.222 1.332.191 1.833.116.558-.084 1.215-.496 1.385-.974.171-.479.171-.889.12-.974-.051-.085-.188-.137-.393-.24z"/>
              </svg>
            </a>
          )}
          {member.social.phone && (
            <a
              href={member.social.phone}
              aria-label={`${member.name} Phone`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Phone className="h-4 w-4" />
            </a>
          )}
          {member.social.twitter && (
            <a
              href={member.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on Twitter`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {member.social.linkedin && (
            <a
              href={member.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {member.social.dribbble && (
            <a
              href={member.social.dribbble}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on Dribbble`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Dribbble className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-display text-lg font-semibold tracking-tight">
          {member.name}
        </h3>
        <p className="text-sm text-accent">{member.role}</p>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {member.bio}
        </p>
      </div>
    </div>
  </TiltCard>
);
}

export function TeamGrid({ teamMembers = defaultTeam }: { teamMembers?: TeamMember[] }) {
  return (
    <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
      {teamMembers.map((member) => (
        <StaggerItem key={member.name}>
          <TeamCard member={member} />
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
