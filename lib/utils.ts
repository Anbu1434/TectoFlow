import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Palette,
  MonitorSmartphone,
  Code2,
  Rocket,
  LineChart,
  Sparkles,
  Search,
  PenTool,
  Send,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Twitter,
  Instagram,
  Linkedin,
  Dribbble,
  Quote,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  ExternalLink,
  Blocks,
  CheckCircle2,
  Headphones,
  SearchCheck,
  PanelsTopLeft,
  Moon,
  Sun,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Palette,
  MonitorSmartphone,
  Code2,
  Rocket,
  LineChart,
  Sparkles,
  Search,
  PenTool,
  Send,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Twitter,
  Instagram,
  Linkedin,
  Dribbble,
  Quote,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  ExternalLink,
  Blocks,
  CheckCircle2,
  Headphones,
  SearchCheck,
  PanelsTopLeft,
  Moon,
  Sun,
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLucideIcon(name: string): LucideIcon {
  const normalized = name ? name.trim() : '';
  const Icon = iconMap[normalized];
  return Icon || HelpCircle;
}

export function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
