'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Briefcase,
  Users,
  MessageSquare,
  BarChart3,
  HelpCircle,
  LogOut,
  Upload,
  Plus,
  Trash2,
  Save,
  Globe,
  Loader2,
  FileText,
  Award,
  Layers,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Trash,
  Mail,
  Send,
  CornerUpLeft,
  History,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast, Toaster } from 'sonner';

// Reusable Image Uploader Component
function ImageUploader({
  label,
  value,
  onChange,
  disabled
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}) {
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await res.json();
      onChange(data.url);
      toast.success('Image uploaded successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-border/80 bg-background/55">
        {value ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-semibold"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-border bg-muted/40">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 space-y-1 text-center sm:text-left">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || disabled}
            className="rounded-lg h-9"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Uploading...
              </>
            ) : (
              'Choose Image'
            )}
          </Button>
          <p className="text-[10px] text-muted-foreground">Supported format: PNG, JPG, GIF. Max 5MB.</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}

function getAvatarGradient(name: string) {
  const colors = [
    'from-indigo-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-amber-500',
    'from-rose-500 to-red-500',
    'from-blue-500 to-indigo-500'
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return colors[sum % colors.length];
}

function getProjectTypeBadgeColor(type: string) {
  switch (type) {
    case 'Brand Strategy':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/25 dark:bg-purple-500/15';
    case 'Web Design & Build':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/25 dark:bg-blue-500/15';
    case 'Product Design':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 dark:bg-emerald-500/15';
    case 'Launch Sprint':
      return 'bg-orange-500/10 text-orange-400 border border-orange-500/25 dark:bg-orange-500/15';
    case 'Growth Design':
      return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 dark:bg-cyan-500/15';
    case 'Motion & Brand Film':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/25 dark:bg-rose-500/15';
    default:
      return 'bg-muted/70 text-muted-foreground border border-border/80';
  }
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [dbConnected, setDbConnected] = React.useState(false);

  // States for all sections
  const [siteConfig, setSiteConfig] = React.useState<any>({});
  const [services, setServices] = React.useState<any[]>([]);
  const [projects, setProjects] = React.useState<any[]>([]);
  const [team, setTeam] = React.useState<any[]>([]);
  const [testimonials, setTestimonials] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<any[]>([]);
  const [processSteps, setProcessSteps] = React.useState<any[]>([]);
  const [faqs, setFaqs] = React.useState<any[]>([]);
  const [values, setValues] = React.useState<any[]>([]);
  const [awards, setAwards] = React.useState<any[]>([]);
  const [contacts, setContacts] = React.useState<any[]>([]);
  const [subscribers, setSubscribers] = React.useState<any[]>([]);
  const [newsletterSubject, setNewsletterSubject] = React.useState('');
  const [newsletterBody, setNewsletterBody] = React.useState('');
  const [sendingNewsletter, setSendingNewsletter] = React.useState(false);

  // States for replying to inquiries
  const [replyingToId, setReplyingToId] = React.useState<string | null>(null);
  const [replySubject, setReplySubject] = React.useState('');
  const [replyMessage, setReplyMessage] = React.useState('');
  const [sendingReply, setSendingReply] = React.useState(false);

  // Project Editing dialog state
  const [editingProject, setEditingProject] = React.useState<any | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = React.useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const data = await res.json();
        setDbConnected(data.dbConnected);
        setSiteConfig(data.siteConfig || {});
        setServices(data.services || []);
        setProjects(data.projects || []);
        setTeam(data.team || []);
        setTestimonials(data.testimonials || []);
        setStats(data.stats || []);
        setProcessSteps(data.processSteps || []);
        setFaqs(data.faqs || []);
        setValues(data.values || []);
        setAwards(data.awards || []);
        setContacts(data.contacts || []);
        setSubscribers(data.subscribers || []);
      } else {
        toast.error('Failed to load website content');
      }
    } catch (err) {
      toast.error('Database connection error');
    } finally {
      setLoading(false);
    }
  }

  async function toggleContactRead(id: string, currentRead: boolean) {
    await saveSection('contact', { id, read: !currentRead }, 'mark_read');
  }

  async function handleDeleteContact(id: string) {
    if (confirm('Delete this inquiry?')) {
      await saveSection('contact', { id }, 'delete');
    }
  }

  async function handleSendReply(contact: any) {
    if (!replySubject.trim() || !replyMessage.trim()) {
      toast.error('Subject and message cannot be empty');
      return;
    }

    setSendingReply(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          action: 'reply',
          data: {
            id: contact._id || contact.id,
            to: contact.email,
            subject: replySubject,
            message: replyMessage,
            originalMessage: contact.message
          }
        })
      });

      if (res.ok) {
        toast.success(`Reply sent successfully to ${contact.name}!`);
        setReplyingToId(null);
        setReplySubject('');
        setReplyMessage('');
        await loadData();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to send reply');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  }

  async function handleDeleteSubscriber(id: string) {
    if (confirm('Delete this newsletter subscriber?')) {
      await saveSection('newsletter', { id }, 'delete');
    }
  }

  async function handleSendNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterSubject || !newsletterBody) {
      toast.error('Please enter both a subject and a body for the newsletter.');
      return;
    }

    if (!confirm(`Are you sure you want to broadcast this newsletter to all ${subscribers.length} subscribers?`)) {
      return;
    }

    setSendingNewsletter(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'newsletter',
          action: 'send',
          data: {
            subject: newsletterSubject,
            body: newsletterBody,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Newsletter broadcasted successfully to ${data.data?.count || subscribers.length} subscribers!`);
        setNewsletterSubject('');
        setNewsletterBody('');
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to broadcast newsletter');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error broadcasting newsletter');
    } finally {
      setSendingNewsletter(false);
    }
  }

  React.useEffect(() => {
    loadData();
  }, []);

  async function handleLogout() {
    try {
      const res = await fetch('/api/admin/auth', { method: 'DELETE' });
      if (res.ok) {
        toast.success('Logged out successfully');
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      toast.error('Logout failed');
    }
  }

  async function saveSection(type: string, data: any, action?: string) {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, action, data }),
      });

      if (res.ok) {
        toast.success(`${type.replace('_', ' ').toUpperCase()} saved successfully!`);
        await loadData();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  // --- Project Helpers ---
  function openEditProject(project: any) {
    setEditingProject({
      ...project,
      tags: project.tags || [],
      results: project.results || [],
      gallery: project.gallery || [],
      testimonial: project.testimonial || { quote: '', author: '', role: '', avatar: '' }
    });
    setProjectDialogOpen(true);
  }

  function openCreateProject() {
    setEditingProject({
      slug: '',
      title: '',
      client: '',
      category: 'Web',
      year: new Date().getFullYear().toString(),
      cover: '',
      excerpt: '',
      tags: [],
      liveUrl: '',
      problem: '',
      solution: '',
      results: [{ label: '', value: '' }],
      gallery: [],
      testimonial: { quote: '', author: '', role: '', avatar: '' },
      featured: false
    });
    setProjectDialogOpen(true);
  }

  async function handleSaveProject() {
    if (!editingProject.title || !editingProject.slug) {
      toast.error('Title and Slug are required');
      return;
    }
    
    const isNew = !projects.some(p => p.slug === editingProject.slug);
    await saveSection('project', editingProject, isNew ? 'create' : 'save');
    setProjectDialogOpen(false);
    setEditingProject(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
          <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Loading Admin workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header bar */}
      <header className="border-b border-border/60 bg-background/50 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-display font-extrabold text-base shadow-sm shrink-0">
            T
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-sm sm:text-base md:text-lg font-bold tracking-tight truncate">TectoFlow Studio</h1>
            <div className="flex items-center mt-0.5">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all duration-300 ${
                dbConnected 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                  : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.15)]'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${dbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500 animate-pulse'}`} />
                {dbConnected ? 'Live Connection' : 'Static Mode'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Button variant="outline" size="sm" asChild className="rounded-lg h-9 px-2.5 sm:px-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="gap-1 flex items-center">
              <span className="hidden xs:inline sm:inline">View Site</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-lg h-9 px-2.5 sm:px-3 text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden xs:inline sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Welcome Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-gradient-to-br from-background/30 via-background/10 to-accent/5 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
          {/* Glowing Background Orbs */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-accent/15 blur-[64px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-orange-500/15 blur-[64px] pointer-events-none" />
          
          <div className="absolute top-0 right-0 p-6 opacity-[0.05] sm:opacity-[0.1] pointer-events-none">
            <Sparkles className="h-20 w-20 sm:h-24 sm:w-24 text-accent" />
          </div>
          <div className="relative space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Studio Manager</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3.5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-accent">
              Welcome back, Admin
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use this dashboard to manage TectoFlow&apos;s case studies, agency capabilities, team profiles, numerical metrics, and core site configurations.
            </p>
          </div>
        </div>

        <Tabs defaultValue="site" className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8">
          
          {/* Sidebar Tab List */}
          <TabsList className="flex flex-row lg:flex-col items-stretch justify-start gap-1.5 p-1.5 bg-muted/30 backdrop-blur-md lg:bg-transparent rounded-2xl lg:rounded-none h-auto overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border-border/40 pb-3 lg:pb-0 lg:pr-4 no-scrollbar lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto scroll-smooth">
            <TabsTrigger value="site" className="justify-start gap-2.5 rounded-xl px-3.5 py-2.5 lg:px-4 lg:py-3 text-sm font-medium tracking-wide border-0 data-[state=active]:bg-accent/15 data-[state=active]:text-accent text-muted-foreground w-auto lg:w-full shrink-0 transition-all duration-200 whitespace-nowrap">
              <Settings className="h-4 w-4" />
              Site Settings
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="justify-start gap-2.5 rounded-xl px-3.5 py-2.5 lg:px-4 lg:py-3 text-sm font-medium tracking-wide border-0 data-[state=active]:bg-accent/15 data-[state=active]:text-accent text-muted-foreground w-auto lg:w-full shrink-0 transition-all duration-200 whitespace-nowrap">
              <Mail className="h-4 w-4" />
              Inquiries
              {contacts.filter((c: any) => !c.read).length > 0 && (
                <span className="ml-auto bg-accent text-accent-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  {contacts.filter((c: any) => !c.read).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="justify-start gap-2.5 rounded-xl px-3.5 py-2.5 lg:px-4 lg:py-3 text-sm font-medium tracking-wide border-0 data-[state=active]:bg-accent/15 data-[state=active]:text-accent text-muted-foreground w-auto lg:w-full shrink-0 transition-all duration-200 whitespace-nowrap">
              <Send className="h-4 w-4" />
              Newsletter
              {subscribers.length > 0 && (
                <span className="ml-auto bg-muted/65 text-muted-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  {subscribers.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="about_page" className="justify-start gap-2.5 rounded-xl px-3.5 py-2.5 lg:px-4 lg:py-3 text-sm font-medium tracking-wide border-0 data-[state=active]:bg-accent/15 data-[state=active]:text-accent text-muted-foreground w-auto lg:w-full shrink-0 transition-all duration-200 whitespace-nowrap">
              <FileText className="h-4 w-4" />
              About Page
            </TabsTrigger>
            <TabsTrigger value="projects" className="justify-start gap-2.5 rounded-xl px-3.5 py-2.5 lg:px-4 lg:py-3 text-sm font-medium tracking-wide border-0 data-[state=active]:bg-accent/15 data-[state=active]:text-accent text-muted-foreground w-auto lg:w-full shrink-0 transition-all duration-200 whitespace-nowrap">
              <Briefcase className="h-4 w-4" />
              Projects (Work)
            </TabsTrigger>
            <TabsTrigger value="services" className="justify-start gap-2.5 rounded-xl px-3.5 py-2.5 lg:px-4 lg:py-3 text-sm font-medium tracking-wide border-0 data-[state=active]:bg-accent/15 data-[state=active]:text-accent text-muted-foreground w-auto lg:w-full shrink-0 transition-all duration-200 whitespace-nowrap">
              <Layers className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="team" className="justify-start gap-2.5 rounded-xl px-3.5 py-2.5 lg:px-4 lg:py-3 text-sm font-medium tracking-wide border-0 data-[state=active]:bg-accent/15 data-[state=active]:text-accent text-muted-foreground w-auto lg:w-full shrink-0 transition-all duration-200 whitespace-nowrap">
              <Users className="h-4 w-4" />
              Team Members
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="justify-start gap-2.5 rounded-xl px-3.5 py-2.5 lg:px-4 lg:py-3 text-sm font-medium tracking-wide border-0 data-[state=active]:bg-accent/15 data-[state=active]:text-accent text-muted-foreground w-auto lg:w-full shrink-0 transition-all duration-200 whitespace-nowrap">
              <MessageSquare className="h-4 w-4" />
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="process" className="justify-start gap-2.5 rounded-xl px-3.5 py-2.5 lg:px-4 lg:py-3 text-sm font-medium tracking-wide border-0 data-[state=active]:bg-accent/15 data-[state=active]:text-accent text-muted-foreground w-auto lg:w-full shrink-0 transition-all duration-200 whitespace-nowrap">
              <Sparkles className="h-4 w-4" />
              Process Steps
            </TabsTrigger>
            <TabsTrigger value="stats" className="justify-start gap-2.5 rounded-xl px-3.5 py-2.5 lg:px-4 lg:py-3 text-sm font-medium tracking-wide border-0 data-[state=active]:bg-accent/15 data-[state=active]:text-accent text-muted-foreground w-auto lg:w-full shrink-0 transition-all duration-200 whitespace-nowrap">
              <BarChart3 className="h-4 w-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="faqs" className="justify-start gap-2.5 rounded-xl px-3.5 py-2.5 lg:px-4 lg:py-3 text-sm font-medium tracking-wide border-0 data-[state=active]:bg-accent/15 data-[state=active]:text-accent text-muted-foreground w-auto lg:w-full shrink-0 transition-all duration-200 whitespace-nowrap">
              <HelpCircle className="h-4 w-4" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="values" className="justify-start gap-2.5 rounded-xl px-3.5 py-2.5 lg:px-4 lg:py-3 text-sm font-medium tracking-wide border-0 data-[state=active]:bg-accent/15 data-[state=active]:text-accent text-muted-foreground w-auto lg:w-full shrink-0 transition-all duration-200 whitespace-nowrap">
              <CheckCircle2 className="h-4 w-4" />
              Values
            </TabsTrigger>
          </TabsList>

          {/* Sidebar Tab Content Panels */}
          <div className="flex-1 min-w-0">
            
            {/* TECTOFLOW SITE CONFIGURATION SETTINGS */}
            <TabsContent value="site" className="space-y-6 m-0 border-0 p-0 focus-visible:ring-0">
              <Card className="border-border/60 bg-card/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="font-display text-xl font-bold tracking-tight">General Site Configuration</CardTitle>
                  <CardDescription>Configure core SEO parameters, contact information, and Hero content.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Website Name</label>
                      <Input
                        value={siteConfig.name || ''}
                        onChange={(e) => setSiteConfig({ ...siteConfig, name: e.target.value })}
                        placeholder="TectoFlow"
                        className="rounded-lg border-border bg-background/40 focus:border-accent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Site URL</label>
                      <Input
                        value={siteConfig.url || ''}
                        onChange={(e) => setSiteConfig({ ...siteConfig, url: e.target.value })}
                        placeholder="https://tectoflow.studio"
                        className="rounded-lg border-border bg-background/40 focus:border-accent"
                      />
                    </div>
                  </div>

                  <ImageUploader
                    label="Header Custom Logo (optional)"
                    value={siteConfig.logoUrl || ''}
                    onChange={(url) => setSiteConfig({ ...siteConfig, logoUrl: url })}
                  />

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Website Tagline</label>
                    <Input
                      value={siteConfig.tagline || ''}
                      onChange={(e) => setSiteConfig({ ...siteConfig, tagline: e.target.value })}
                      placeholder="Branding & digital studio"
                      className="rounded-lg border-border bg-background/40 focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meta Description</label>
                    <Textarea
                      value={siteConfig.description || ''}
                      onChange={(e) => setSiteConfig({ ...siteConfig, description: e.target.value })}
                      placeholder="About studio..."
                      className="rounded-lg border-border bg-background/40 min-h-[90px]"
                    />
                  </div>

                  <div className="border-t border-border/40 my-6" />

                  <h3 className="text-sm font-semibold tracking-wider text-accent uppercase">Hero Section Customization</h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hero Title Prefix</label>
                    <Input
                      value={siteConfig.heroTitle || ''}
                      onChange={(e) => setSiteConfig({ ...siteConfig, heroTitle: e.target.value })}
                      placeholder="We build web products that"
                      className="rounded-lg border-border bg-background/40 focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hero Rotating Words (Comma separated)</label>
                    <Input
                      value={siteConfig.heroWords ? siteConfig.heroWords.join(', ') : ''}
                      onChange={(e) => setSiteConfig({ ...siteConfig, heroWords: e.target.value.split(',').map(s => s.trim()) })}
                      placeholder="grow businesses, scale products, delight users"
                      className="rounded-lg border-border bg-background/40 focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hero Description</label>
                    <Textarea
                      value={siteConfig.heroDescription || ''}
                      onChange={(e) => setSiteConfig({ ...siteConfig, heroDescription: e.target.value })}
                      placeholder="We design and build..."
                      className="rounded-lg border-border bg-background/40 min-h-[90px]"
                    />
                  </div>

                  <div className="border-t border-border/40 my-6" />

                  <h3 className="text-sm font-semibold tracking-wider text-accent uppercase">Contact Details & Social Media</h3>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                      <Input
                        value={siteConfig.email || ''}
                        onChange={(e) => setSiteConfig({ ...siteConfig, email: e.target.value })}
                        placeholder="hello@tectoflow.studio"
                        className="rounded-lg border-border bg-background/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</label>
                      <Input
                        value={siteConfig.phone || ''}
                        onChange={(e) => setSiteConfig({ ...siteConfig, phone: e.target.value })}
                        placeholder="+1 (415) 555-0142"
                        className="rounded-lg border-border bg-background/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Address</label>
                      <Input
                        value={siteConfig.address || ''}
                        onChange={(e) => setSiteConfig({ ...siteConfig, address: e.target.value })}
                        placeholder="Mission St, SF"
                        className="rounded-lg border-border bg-background/40"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Twitter Link</label>
                      <Input
                        value={siteConfig.social?.twitter || ''}
                        onChange={(e) => setSiteConfig({
                          ...siteConfig,
                          social: { ...(siteConfig.social || {}), twitter: e.target.value }
                        })}
                        placeholder="Twitter URL"
                        className="rounded-lg border-border bg-background/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Instagram Link</label>
                      <Input
                        value={siteConfig.social?.instagram || ''}
                        onChange={(e) => setSiteConfig({
                          ...siteConfig,
                          social: { ...(siteConfig.social || {}), instagram: e.target.value }
                        })}
                        placeholder="Instagram URL"
                        className="rounded-lg border-border bg-background/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">LinkedIn Link</label>
                      <Input
                        value={siteConfig.social?.linkedin || ''}
                        onChange={(e) => setSiteConfig({
                          ...siteConfig,
                          social: { ...(siteConfig.social || {}), linkedin: e.target.value }
                        })}
                        placeholder="LinkedIn URL"
                        className="rounded-lg border-border bg-background/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dribbble Link</label>
                      <Input
                        value={siteConfig.social?.dribbble || ''}
                        onChange={(e) => setSiteConfig({
                          ...siteConfig,
                          social: { ...(siteConfig.social || {}), dribbble: e.target.value }
                        })}
                        placeholder="Dribbble URL"
                        className="rounded-lg border-border bg-background/40"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/40 bg-muted/20 py-4 flex justify-end">
                  <Button
                    onClick={() => saveSection('site_config', siteConfig)}
                    disabled={saving}
                    className="rounded-lg bg-accent text-accent-foreground font-semibold gap-1.5 h-10 px-5 hover:bg-accent/90"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Configuration
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* PROJECTS MANAGEMENT */}
            <TabsContent value="projects" className="space-y-6 m-0 border-0 p-0 focus-visible:ring-0">
              <Card className="border-border/60 bg-card/40 backdrop-blur-md">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="font-display text-xl font-bold tracking-tight">Case Studies & Projects</CardTitle>
                    <CardDescription>Manage your grid of projects displayed on the Work and Home pages.</CardDescription>
                  </div>
                  <Button
                    onClick={openCreateProject}
                    className="rounded-lg bg-accent hover:bg-accent/90 font-semibold gap-1.5 h-10 shrink-0 self-start sm:self-center"
                  >
                    <Plus className="h-4 w-4" />
                    New Project
                  </Button>
                </CardHeader>
                <CardContent className="p-0 sm:p-6 sm:pt-0">
                  <div className="w-full overflow-x-auto no-scrollbar rounded-xl border border-border/60 bg-background/30 scroll-smooth">
                    <div className="min-w-[700px]">
                      <Table>
                        <TableHeader className="bg-muted/40">
                          <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead className="font-semibold uppercase tracking-wider text-xs">Project Title</TableHead>
                            <TableHead className="font-semibold uppercase tracking-wider text-xs">Client</TableHead>
                            <TableHead className="font-semibold uppercase tracking-wider text-xs">Category</TableHead>
                            <TableHead className="font-semibold uppercase tracking-wider text-xs">Year</TableHead>
                            <TableHead className="font-semibold uppercase tracking-wider text-xs text-center">Featured</TableHead>
                            <TableHead className="font-semibold uppercase tracking-wider text-xs text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {projects.map((project) => (
                            <TableRow key={project.slug} className="hover:bg-muted/10 transition-colors">
                              <TableCell>
                                {project.cover ? (
                                  <div className="h-10 w-10 rounded overflow-hidden border border-border">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={project.cover} alt={project.title} className="h-full w-full object-cover" />
                                  </div>
                                ) : (
                                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center border border-border/80">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="font-semibold text-foreground">{project.title}</TableCell>
                              <TableCell>{project.client}</TableCell>
                              <TableCell>{project.category}</TableCell>
                              <TableCell>{project.year}</TableCell>
                              <TableCell className="text-center">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${project.featured ? 'bg-accent/15 text-accent border border-accent/20' : 'bg-muted/65 text-muted-foreground'}`}>
                                  {project.featured ? 'Featured' : 'Regular'}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="outline" size="sm" onClick={() => openEditProject(project)} className="rounded-lg h-8">
                                    Edit
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      if (confirm(`Delete project "${project.title}"?`)) {
                                        saveSection('project', project, 'delete');
                                      }
                                    }}
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SERVICES CAPABILITIES */}
            <TabsContent value="services" className="space-y-6 m-0 border-0 p-0 focus-visible:ring-0">
              <Card className="border-border/60 bg-card/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="font-display text-xl font-bold tracking-tight">Our Capabilities</CardTitle>
                  <CardDescription>Edit capabilities list, descriptions, prices, and deliverables lists.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {services.map((service, sIndex) => (
                    <div key={service.slug} className="p-5 rounded-2xl border border-border bg-background/30 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h4 className="font-display text-base font-bold text-accent">{service.title} ({service.slug})</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground uppercase font-semibold">Starting Price:</span>
                          <Input
                            value={service.startingPrice || ''}
                            onChange={(e) => {
                              const updated = [...services];
                              updated[sIndex].startingPrice = e.target.value;
                              setServices(updated);
                            }}
                            placeholder="$20k"
                            className="rounded-lg w-28 h-8"
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground uppercase font-semibold">Short Subtitle</label>
                          <Input
                            value={service.short || ''}
                            onChange={(e) => {
                              const updated = [...services];
                              updated[sIndex].short = e.target.value;
                              setServices(updated);
                            }}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground uppercase font-semibold">Icon Identifier (Lucide)</label>
                          <Input
                            value={service.icon || ''}
                            onChange={(e) => {
                              const updated = [...services];
                              updated[sIndex].icon = e.target.value;
                              setServices(updated);
                            }}
                            placeholder="Palette"
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground uppercase font-semibold">Description</label>
                        <Textarea
                          value={service.description || ''}
                          onChange={(e) => {
                            const updated = [...services];
                            updated[sIndex].description = e.target.value;
                            setServices(updated);
                          }}
                          className="rounded-lg min-h-[70px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground uppercase font-semibold">Deliverables (One per line)</label>
                        <Textarea
                          value={service.deliverables ? service.deliverables.join('\n') : ''}
                          onChange={(e) => {
                            const updated = [...services];
                            updated[sIndex].deliverables = e.target.value.split('\n').filter(Boolean);
                            setServices(updated);
                          }}
                          placeholder="Figma layouts&#10;Brand guidelines"
                          className="rounded-lg min-h-[90px] font-mono text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t border-border/40 bg-muted/20 py-4 flex justify-end">
                  <Button
                    onClick={() => saveSection('services', services)}
                    disabled={saving}
                    className="rounded-lg bg-accent text-accent-foreground font-semibold gap-1.5 h-10 px-5"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Services capabilities
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* TEAM MEMBERS */}
            <TabsContent value="team" className="space-y-6 m-0 border-0 p-0 focus-visible:ring-0">
              <Card className="border-border/60 bg-card/40 backdrop-blur-md">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="font-display text-xl font-bold tracking-tight">Team Members</CardTitle>
                    <CardDescription>Manage TectoFlow studio founders and team biographies.</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setTeam([...team, { name: 'New Member', role: 'Designer', bio: '', image: '', social: {} }]);
                    }}
                    className="rounded-lg bg-accent font-semibold gap-1.5 h-10 shrink-0 self-start sm:self-center"
                  >
                    <Plus className="h-4 w-4" />
                    Add Member
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {team.map((member, mIndex) => (
                    <div key={mIndex} className="p-5 rounded-2xl border border-border bg-background/30 space-y-4">
                      <div className="flex justify-between items-center border-b border-border/40 pb-2">
                        <span className="text-sm font-bold text-accent uppercase">Member #{mIndex + 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = team.filter((_, idx) => idx !== mIndex);
                            setTeam(updated);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground uppercase font-semibold">Name</label>
                          <Input
                            value={member.name || ''}
                            onChange={(e) => {
                              const updated = [...team];
                              updated[mIndex].name = e.target.value;
                              setTeam(updated);
                            }}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground uppercase font-semibold">Role</label>
                          <Input
                            value={member.role || ''}
                            onChange={(e) => {
                              const updated = [...team];
                              updated[mIndex].role = e.target.value;
                              setTeam(updated);
                            }}
                            className="rounded-lg"
                          />
                        </div>
                      </div>

                      <ImageUploader
                        label="Profile Picture"
                        value={member.image}
                        onChange={(url) => {
                          const updated = [...team];
                          updated[mIndex].image = url;
                          setTeam(updated);
                        }}
                      />

                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground uppercase font-semibold">Biography</label>
                        <Textarea
                          value={member.bio || ''}
                          onChange={(e) => {
                            const updated = [...team];
                            updated[mIndex].bio = e.target.value;
                            setTeam(updated);
                          }}
                          className="rounded-lg min-h-[60px]"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground uppercase font-semibold">WhatsApp Link</label>
                          <Input
                            value={member.social?.whatsapp || ''}
                            onChange={(e) => {
                              const updated = [...team];
                              updated[mIndex].social = { ...(updated[mIndex].social || {}), whatsapp: e.target.value };
                              setTeam(updated);
                            }}
                            placeholder="https://wa.me/..."
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground uppercase font-semibold">Phone Link</label>
                          <Input
                            value={member.social?.phone || ''}
                            onChange={(e) => {
                              const updated = [...team];
                              updated[mIndex].social = { ...(updated[mIndex].social || {}), phone: e.target.value };
                              setTeam(updated);
                            }}
                            placeholder="tel:+1234..."
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t border-border/40 bg-muted/20 py-4 flex justify-end">
                  <Button
                    onClick={() => saveSection('team', team)}
                    disabled={saving}
                    className="rounded-lg bg-accent text-accent-foreground font-semibold gap-1.5 h-10 px-5"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Team
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* TESTIMONIALS */}
            <TabsContent value="testimonials" className="space-y-6 m-0 border-0 p-0 focus-visible:ring-0">
              <Card className="border-border/60 bg-card/40 backdrop-blur-md">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="font-display text-xl font-bold tracking-tight">Kind Words & Testimonials</CardTitle>
                    <CardDescription>Manage feedback quotes displayed on the client slider carousel.</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setTestimonials([...testimonials, { quote: '', author: '', role: '', company: '', avatar: '' }]);
                    }}
                    className="rounded-lg bg-accent font-semibold gap-1.5 h-10 shrink-0 self-start sm:self-center"
                  >
                    <Plus className="h-4 w-4" />
                    Add Testimonial
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {testimonials.map((test, tIndex) => (
                    <div key={tIndex} className="p-5 rounded-2xl border border-border bg-background/30 space-y-4">
                      <div className="flex justify-between items-center border-b border-border/40 pb-2">
                        <span className="text-sm font-bold text-accent uppercase">Testimonial #{tIndex + 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = testimonials.filter((_, idx) => idx !== tIndex);
                            setTestimonials(updated);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground uppercase font-semibold">Quote Text</label>
                        <Textarea
                          value={test.quote || ''}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[tIndex].quote = e.target.value;
                            setTestimonials(updated);
                          }}
                          placeholder="Write the quote text..."
                          className="rounded-lg min-h-[60px]"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground uppercase font-semibold">Author</label>
                          <Input
                            value={test.author || ''}
                            onChange={(e) => {
                              const updated = [...testimonials];
                              updated[tIndex].author = e.target.value;
                              setTestimonials(updated);
                            }}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground uppercase font-semibold">Role</label>
                          <Input
                            value={test.role || ''}
                            onChange={(e) => {
                              const updated = [...testimonials];
                              updated[tIndex].role = e.target.value;
                              setTestimonials(updated);
                            }}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground uppercase font-semibold">Company</label>
                          <Input
                            value={test.company || ''}
                            onChange={(e) => {
                              const updated = [...testimonials];
                              updated[tIndex].company = e.target.value;
                              setTestimonials(updated);
                            }}
                            className="rounded-lg"
                          />
                        </div>
                      </div>

                      <ImageUploader
                        label="Client Avatar"
                        value={test.avatar}
                        onChange={(url) => {
                          const updated = [...testimonials];
                          updated[tIndex].avatar = url;
                          setTestimonials(updated);
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t border-border/40 bg-muted/20 py-4 flex justify-end">
                  <Button
                    onClick={() => saveSection('testimonials', testimonials)}
                    disabled={saving}
                    className="rounded-lg bg-accent text-accent-foreground font-semibold gap-1.5 h-10 px-5"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Testimonials
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* PROCESS STEPS */}
            <TabsContent value="process" className="space-y-6 m-0 border-0 p-0 focus-visible:ring-0">
              <Card className="border-border/60 bg-card/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="font-display text-xl font-bold tracking-tight">Process Steps</CardTitle>
                  <CardDescription>Configure core timeline/process cards shown on the Homepage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {processSteps.map((step, idx) => (
                    <div key={step.number || idx} className="p-5 rounded-2xl border border-border bg-background/30 space-y-4">
                      <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <span className="font-bold text-accent text-sm">Step {step.number || `0${idx + 1}`}</span>
                        <div className="flex items-center gap-1">
                          <label className="text-xs text-muted-foreground uppercase font-semibold">Icon:</label>
                          <Input
                            value={step.icon || ''}
                            onChange={(e) => {
                              const updated = [...processSteps];
                              updated[idx].icon = e.target.value;
                              setProcessSteps(updated);
                            }}
                            className="rounded-lg w-28 h-8 text-center"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground uppercase font-semibold">Title</label>
                        <Input
                          value={step.title || ''}
                          onChange={(e) => {
                            const updated = [...processSteps];
                            updated[idx].title = e.target.value;
                            setProcessSteps(updated);
                          }}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground uppercase font-semibold">Description</label>
                        <Textarea
                          value={step.description || ''}
                          onChange={(e) => {
                            const updated = [...processSteps];
                            updated[idx].description = e.target.value;
                            setProcessSteps(updated);
                          }}
                          className="rounded-lg min-h-[60px]"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t border-border/40 bg-muted/20 py-4 flex justify-end">
                  <Button
                    onClick={() => saveSection('process_steps', processSteps)}
                    disabled={saving}
                    className="rounded-lg bg-accent text-accent-foreground font-semibold gap-1.5 h-10 px-5"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Process Steps
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* NUMERICAL STATS */}
            <TabsContent value="stats" className="space-y-6 m-0 border-0 p-0 focus-visible:ring-0">
              <Card className="border-border/60 bg-card/40 backdrop-blur-md">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="font-display text-xl font-bold tracking-tight">Numerical Metrics</CardTitle>
                    <CardDescription>Manage statistics shown on the Home and About pages.</CardDescription>
                  </div>
                  <Button
                    onClick={() => setStats([...stats, { value: '0', label: 'New Metric' }])}
                    className="rounded-lg bg-accent font-semibold gap-1.5 h-10 shrink-0 self-start sm:self-center"
                  >
                    <Plus className="h-4 w-4" />
                    Add Stat
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 rounded-xl border border-border bg-background/35">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground uppercase font-semibold">Value</label>
                          <Input
                            value={stat.value || ''}
                            onChange={(e) => {
                              const updated = [...stats];
                              updated[idx].value = e.target.value;
                              setStats(updated);
                            }}
                            placeholder="150+"
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground uppercase font-semibold">Label</label>
                          <Input
                            value={stat.label || ''}
                            onChange={(e) => {
                              const updated = [...stats];
                              updated[idx].label = e.target.value;
                              setStats(updated);
                            }}
                            placeholder="Projects shipped"
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = stats.filter((_, i) => i !== idx);
                          setStats(updated);
                        }}
                        className="text-muted-foreground hover:text-destructive h-10 w-10 shrink-0 self-end sm:self-center"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t border-border/40 bg-muted/20 py-4 flex justify-end">
                  <Button
                    onClick={() => saveSection('stats', stats)}
                    disabled={saving}
                    className="rounded-lg bg-accent text-accent-foreground font-semibold gap-1.5 h-10 px-5"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Stats
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* FAQS */}
            <TabsContent value="faqs" className="space-y-6 m-0 border-0 p-0 focus-visible:ring-0">
              <Card className="border-border/60 bg-card/40 backdrop-blur-md">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="font-display text-xl font-bold tracking-tight">Frequently Asked Questions</CardTitle>
                    <CardDescription>Manage the FAQ toggle accordion items on the contact section.</CardDescription>
                  </div>
                  <Button
                    onClick={() => setFaqs([...faqs, { question: 'New Question', answer: '' }])}
                    className="rounded-lg bg-accent font-semibold gap-1.5 h-10 shrink-0 self-start sm:self-center"
                  >
                    <Plus className="h-4 w-4" />
                    Add FAQ
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-border bg-background/30 space-y-4">
                      <div className="flex justify-between items-center border-b border-border/40 pb-2">
                        <span className="text-sm font-bold text-accent uppercase">FAQ Item #{idx + 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = faqs.filter((_, i) => i !== idx);
                            setFaqs(updated);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground uppercase font-semibold">Question</label>
                        <Input
                          value={faq.question || ''}
                          onChange={(e) => {
                            const updated = [...faqs];
                            updated[idx].question = e.target.value;
                            setFaqs(updated);
                          }}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground uppercase font-semibold">Answer</label>
                        <Textarea
                          value={faq.answer || ''}
                          onChange={(e) => {
                            const updated = [...faqs];
                            updated[idx].answer = e.target.value;
                            setFaqs(updated);
                          }}
                          className="rounded-lg min-h-[70px]"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t border-border/40 bg-muted/20 py-4 flex justify-end">
                  <Button
                    onClick={() => saveSection('faqs', faqs)}
                    disabled={saving}
                    className="rounded-lg bg-accent text-accent-foreground font-semibold gap-1.5 h-10 px-5"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save FAQs
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* BELIEFS & VALUES */}
            <TabsContent value="values" className="space-y-6 m-0 border-0 p-0 focus-visible:ring-0">
              <Card className="border-border/60 bg-card/40 backdrop-blur-md">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="font-display text-xl font-bold tracking-tight">Our Values</CardTitle>
                    <CardDescription>Manage values and core beliefs displayed on the About page.</CardDescription>
                  </div>
                  <Button
                    onClick={() => setValues([...values, { title: 'New Value', description: '' }])}
                    className="rounded-lg bg-accent font-semibold gap-1.5 h-10 shrink-0 self-start sm:self-center"
                  >
                    <Plus className="h-4 w-4" />
                    Add Value
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {values.map((val, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-border bg-background/30 space-y-4">
                      <div className="flex justify-between items-center border-b border-border/40 pb-2">
                        <span className="text-sm font-bold text-accent uppercase">Value #{idx + 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = values.filter((_, i) => i !== idx);
                            setValues(updated);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground uppercase font-semibold">Title</label>
                        <Input
                          value={val.title || ''}
                          onChange={(e) => {
                            const updated = [...values];
                            updated[idx].title = e.target.value;
                            setValues(updated);
                          }}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground uppercase font-semibold">Description</label>
                        <Textarea
                          value={val.description || ''}
                          onChange={(e) => {
                            const updated = [...values];
                            updated[idx].description = e.target.value;
                            setValues(updated);
                          }}
                          className="rounded-lg min-h-[60px]"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t border-border/40 bg-muted/20 py-4 flex justify-end">
                  <Button
                    onClick={() => saveSection('values', values)}
                    disabled={saving}
                    className="rounded-lg bg-accent text-accent-foreground font-semibold gap-1.5 h-10 px-5"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Values
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* INQUIRIES MANAGEMENT */}
            <TabsContent value="inquiries" className="space-y-6 m-0 border-0 p-0 focus-visible:ring-0">
              <Card className="border-border/60 bg-card/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="font-display text-xl font-bold tracking-tight">Client Inquiries</CardTitle>
                  <CardDescription>View and manage submissions from your contact form.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-border/80 rounded-2xl bg-background/20">
                      <Mail className="h-10 w-10 text-muted-foreground mb-3 opacity-60" />
                      <h4 className="font-display text-base font-bold text-foreground">No inquiries yet</h4>
                      <p className="text-xs text-muted-foreground max-w-xs mt-1">
                        When users submit the contact form, their project inquiries and messages will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {contacts.map((contact) => {
                        const contactId = contact._id || contact.id;
                        const isReplying = replyingToId === contactId;
                        const hasReplies = contact.replies && contact.replies.length > 0;
                        const avatarInitials = contact.name.trim().substring(0, 2).toUpperCase();
                        
                        return (
                          <div
                            key={contactId}
                            className={`p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 relative overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.15)] ${
                              !contact.read
                                ? 'border-accent/45 bg-accent/[0.04] dark:bg-accent/[0.02] shadow-[0_0_15px_rgba(249,115,22,0.06)]'
                                : contact.replied
                                ? 'border-emerald-500/25 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01]'
                                : 'border-border/70 bg-background/25 hover:border-border hover:bg-background/35'
                            }`}
                          >
                            {/* Accent indicator glow */}
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${
                              !contact.read
                                ? 'bg-gradient-to-b from-accent to-orange-600'
                                : contact.replied
                                ? 'bg-gradient-to-b from-emerald-500 to-teal-600'
                                : 'bg-transparent'
                            }`} />

                            <div className="flex flex-col md:flex-row gap-4 justify-between items-start pb-4 border-b border-border/40 pl-2">
                              {/* Left side: Avatar + User details */}
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${getAvatarGradient(contact.name)} flex items-center justify-center text-white text-sm font-bold shadow-md shrink-0`}>
                                  {avatarInitials}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-display text-base font-extrabold text-foreground tracking-tight truncate">{contact.name}</h4>
                                    {contact.company && (
                                      <span className="text-xs bg-muted/60 dark:bg-muted/30 px-2 py-0.5 rounded-md border border-border/30 text-muted-foreground truncate">
                                        at <span className="text-foreground font-semibold">{contact.company}</span>
                                      </span>
                                    )}
                                    
                                    {/* Status Badge */}
                                    {!contact.read ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-accent text-accent-foreground">
                                        New
                                      </span>
                                    ) : contact.replied ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                                        Replied
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border/40">
                                        Read
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                    <Mail className="h-3.5 w-3.5 shrink-0 text-accent/70" />
                                    <a href={`mailto:${contact.email}`} className="hover:text-accent font-medium transition-colors truncate">
                                      {contact.email}
                                    </a>
                                  </div>
                                </div>
                              </div>

                              {/* Right side: Project details & Date */}
                              <div className="flex flex-row md:flex-col items-start md:items-end gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0 justify-between md:justify-start">
                                <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getProjectTypeBadgeColor(contact.projectType)}`}>
                                  {contact.projectType}
                                </span>
                                
                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {new Date(contact.createdAt).toLocaleDateString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Message content */}
                            <div className="py-5 pl-2">
                              <p className="text-sm text-foreground/80 leading-relaxed font-sans border-l-2 border-border/40 pl-4 py-0.5 whitespace-pre-wrap break-words">
                                {contact.message}
                              </p>
                            </div>

                            {/* Collapsible Compose Reply Form */}
                            <AnimatePresence>
                              {isReplying && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-4 pt-4 border-t border-border/40 space-y-4 pl-2">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                                        <CornerUpLeft className="h-3.5 w-3.5" />
                                        Compose Email Reply
                                      </h5>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setReplyingToId(null)}
                                        className="h-6 px-2 text-[10px] text-muted-foreground"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                      <div className="space-y-1">
                                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Subject</label>
                                        <Input
                                          value={replySubject}
                                          onChange={(e) => setReplySubject(e.target.value)}
                                          placeholder="Email Subject"
                                          className="h-9 rounded-lg bg-background/50 border-border text-sm"
                                        />
                                      </div>
                                      
                                      <div className="space-y-1">
                                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Message Body</label>
                                        <Textarea
                                          value={replyMessage}
                                          onChange={(e) => setReplyMessage(e.target.value)}
                                          placeholder={`Hi ${contact.name.split(' ')[0]},\n\nThank you for reaching out to TectoFlow. `}
                                          className="min-h-[140px] rounded-lg bg-background/50 border-border text-sm leading-relaxed"
                                        />
                                      </div>

                                      <div className="flex justify-end gap-2 pt-1">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setReplyingToId(null)}
                                          disabled={sendingReply}
                                          className="h-9 rounded-lg text-xs"
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() => handleSendReply(contact)}
                                          disabled={sendingReply}
                                          className="h-9 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-semibold gap-1.5 px-4"
                                        >
                                          {sendingReply ? (
                                            <>
                                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                              Sending...
                                            </>
                                          ) : (
                                            <>
                                              <Send className="h-3.5 w-3.5" />
                                              Send Email
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Reply History Logs */}
                            {hasReplies && (
                              <div className="mt-4 pt-4 border-t border-border/40 space-y-3 pl-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                  <History className="h-3.5 w-3.5 text-accent/60" />
                                  <span>Reply Logs ({contact.replies.length})</span>
                                </div>
                                <div className="space-y-3">
                                  {contact.replies.map((reply: any, idx: number) => (
                                    <div key={idx} className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-2 text-xs relative overflow-hidden">
                                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/40" />
                                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                        <span className="font-semibold text-foreground uppercase tracking-wider">Sent by Admin</span>
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {new Date(reply.repliedAt).toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="font-semibold text-foreground/90">Subject: {reply.subject}</div>
                                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed border-l border-border/50 pl-3.5 py-0.5">
                                        {reply.message}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Bottom Card Actions Row */}
                            <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-4 pl-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleContactRead(contactId, contact.read)}
                                  className="h-8 rounded-lg text-xs font-semibold hover:bg-muted/50 transition-colors"
                                >
                                  {contact.read ? 'Mark Unread' : 'Mark as Read'}
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (isReplying) {
                                      setReplyingToId(null);
                                    } else {
                                      setReplyingToId(contactId);
                                      setReplySubject(`Re: Inquiry regarding ${contact.projectType} - TectoFlow`);
                                      setReplyMessage(`Hi ${contact.name.split(' ')[0]},\n\n`);
                                    }
                                  }}
                                  className={`h-8 rounded-lg text-xs font-semibold gap-1.5 px-3 hover:bg-muted/50 transition-all ${
                                    isReplying ? 'bg-accent/10 text-accent font-bold border border-accent/20' : ''
                                  }`}
                                >
                                  <CornerUpLeft className="h-3.5 w-3.5" />
                                  {isReplying ? 'Replying...' : 'Reply'}
                                </Button>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteContact(contactId)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* NEWSLETTER MANAGEMENT */}
            <TabsContent value="newsletter" className="space-y-6 m-0 border-0 p-0 focus-visible:ring-0">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
                
                {/* Send Newsletter Form */}
                <Card className="border-border/60 bg-card/40 backdrop-blur-md h-fit">
                  <CardHeader>
                    <CardTitle className="font-display text-xl font-bold tracking-tight">Broadcast Newsletter</CardTitle>
                    <CardDescription>Draft and send updates directly to all active newsletter subscribers.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleSendNewsletter} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject Line</label>
                        <Input
                          value={newsletterSubject}
                          onChange={(e) => setNewsletterSubject(e.target.value)}
                          placeholder="e.g., TectoFlow Studio Newsletter - June 2026"
                          required
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Content (HTML or plain text)</label>
                        <Textarea
                          value={newsletterBody}
                          onChange={(e) => setNewsletterBody(e.target.value)}
                          placeholder="Write your email body here. HTML formatting is supported..."
                          required
                          className="rounded-lg min-h-[300px]"
                        />
                      </div>
                      
                      <div className="bg-muted/30 border border-border/40 rounded-xl p-4 text-xs text-muted-foreground leading-relaxed">
                        <span className="font-bold text-accent block mb-1">Important Sandbox Info</span>
                        If you are using a Resend sandbox account, emails can only be sent to the registered sandbox owner email (verified email). Broadcast simulation will run and log to the console if no Resend API key is configured.
                      </div>

                      <Button
                        type="submit"
                        disabled={sendingNewsletter || subscribers.length === 0}
                        className="w-full rounded-lg bg-accent text-accent-foreground font-semibold h-10 px-5 gap-1.5"
                      >
                        {sendingNewsletter ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Broadcasting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Broadcast to {subscribers.length} Subscribers
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Subscribers List */}
                <Card className="border-border/60 bg-card/40 backdrop-blur-md h-fit">
                  <CardHeader>
                    <CardTitle className="font-display text-xl font-bold tracking-tight">Subscribers ({subscribers.length})</CardTitle>
                    <CardDescription>Active newsletter emails.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {subscribers.length === 0 ? (
                      <div className="p-6 text-center text-xs text-muted-foreground">
                        No subscribers registered yet.
                      </div>
                    ) : (
                      <div className="max-h-[500px] overflow-y-auto divide-y divide-border/40 scroll-smooth">
                        {subscribers.map((sub: any) => (
                          <div key={sub._id || sub.id} className="p-4 flex items-center justify-between gap-3 hover:bg-muted/5 transition-colors">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-foreground truncate select-all">{sub.email}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {new Date(sub.subscribedAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSubscriber(sub._id || sub.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

              </div>
            </TabsContent>


            {/* ABOUT PAGE CONTENT EDITOR */}
            <TabsContent value="about_page" className="space-y-6 m-0 border-0 p-0 focus-visible:ring-0">
              <Card className="border-border/60 bg-card/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="font-display text-xl font-bold tracking-tight">About Page Content</CardTitle>
                  <CardDescription>Manage the header and the detailed story timeline sections on the About page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <h3 className="text-sm font-semibold tracking-wider text-accent uppercase">Main Header</h3>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Header Eyebrow</label>
                    <Input
                      value={siteConfig.aboutHeaderEyebrow || ''}
                      onChange={(e) => setSiteConfig({ ...siteConfig, aboutHeaderEyebrow: e.target.value })}
                      placeholder="About us"
                      className="rounded-lg border-border bg-background/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Header Title</label>
                    <Input
                      value={siteConfig.aboutHeaderTitle || ''}
                      onChange={(e) => setSiteConfig({ ...siteConfig, aboutHeaderTitle: e.target.value })}
                      placeholder="Two people, one obsession"
                      className="rounded-lg border-border bg-background/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Header Description</label>
                    <Textarea
                      value={siteConfig.aboutHeaderDescription || ''}
                      onChange={(e) => setSiteConfig({ ...siteConfig, aboutHeaderDescription: e.target.value })}
                      placeholder="We started TectoFlow..."
                      className="rounded-lg border-border bg-background/40 min-h-[80px]"
                    />
                  </div>

                  <div className="border-t border-border/40 my-6" />

                  <h3 className="text-sm font-semibold tracking-wider text-accent uppercase">Story Section</h3>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Story Eyebrow</label>
                    <Input
                      value={siteConfig.aboutStoryEyebrow || ''}
                      onChange={(e) => setSiteConfig({ ...siteConfig, aboutStoryEyebrow: e.target.value })}
                      placeholder="Our story"
                      className="rounded-lg border-border bg-background/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Story Title</label>
                    <Input
                      value={siteConfig.aboutStoryTitle || ''}
                      onChange={(e) => setSiteConfig({ ...siteConfig, aboutStoryTitle: e.target.value })}
                      placeholder="Built by makers, for makers"
                      className="rounded-lg border-border bg-background/40"
                    />
                  </div>

                  {/* Story Paragraphs */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Story Paragraphs</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = [...(siteConfig.aboutStoryParagraphs || [])];
                          updated.push('New paragraph...');
                          setSiteConfig({ ...siteConfig, aboutStoryParagraphs: updated });
                        }}
                        className="h-8 rounded font-semibold"
                      >
                        + Add Paragraph
                      </Button>
                    </div>
                    {(siteConfig.aboutStoryParagraphs || []).map((para: string, pIdx: number) => (
                      <div key={pIdx} className="flex gap-4 items-start p-3 border border-border/40 rounded-xl bg-background/25">
                        <Textarea
                          value={para}
                          onChange={(e) => {
                            const updated = [...(siteConfig.aboutStoryParagraphs || [])];
                            updated[pIdx] = e.target.value;
                            setSiteConfig({ ...siteConfig, aboutStoryParagraphs: updated });
                          }}
                          className="rounded-lg min-h-[80px] flex-1 text-sm bg-background/40"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = (siteConfig.aboutStoryParagraphs || []).filter((_: any, idx: number) => idx !== pIdx);
                            setSiteConfig({ ...siteConfig, aboutStoryParagraphs: updated });
                          }}
                          className="text-muted-foreground hover:text-destructive shrink-0 h-10 w-10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                </CardContent>
                <CardFooter className="border-t border-border/40 bg-muted/20 py-4 flex justify-end">
                  <Button
                    onClick={() => saveSection('site_config', siteConfig)}
                    disabled={saving}
                    className="rounded-lg bg-accent text-accent-foreground font-semibold gap-1.5 h-10 px-5"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save About Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

          </div>
        </Tabs>
      </main>

      {/* PROJECT CREATE/EDIT FULL DETAILED MODAL DIALOG */}
      {editingProject && (
        <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto border-border bg-card/95 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="font-display text-xl font-bold tracking-tight">{editingProject.title ? `Edit Project: ${editingProject.title}` : 'Create New Project'}</DialogTitle>
              <DialogDescription>Fill out case study specs. Changes are stored directly in MongoDB.</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground uppercase font-semibold">Project Title</label>
                  <Input
                    value={editingProject.title}
                    onChange={(e) => {
                      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditingProject({ ...editingProject, title: e.target.value, slug });
                    }}
                    placeholder="E.g., Harbor Finance"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground uppercase font-semibold">Project Slug (URL part)</label>
                  <Input
                    value={editingProject.slug}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    placeholder="harbor-finance"
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground uppercase font-semibold">Client Name</label>
                  <Input
                    value={editingProject.client}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    placeholder="Harbor"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground uppercase font-semibold">Industry Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Web">Web</option>
                    <option value="Software">Software</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground uppercase font-semibold">Launch Year</label>
                  <Input
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    placeholder="2025"
                    className="rounded-lg"
                  />
                </div>
              </div>

              <ImageUploader
                label="Cover Showcase Image"
                value={editingProject.cover}
                onChange={(url) => setEditingProject({ ...editingProject, cover: url })}
              />

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase font-semibold">Short Excerpt (Grid Card Preview)</label>
                <Textarea
                  value={editingProject.excerpt}
                  onChange={(e) => setEditingProject({ ...editingProject, excerpt: e.target.value })}
                  placeholder="Summarize the project outcome..."
                  className="rounded-lg min-h-[60px]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground uppercase font-semibold">Services/Tags (Comma separated)</label>
                  <Input
                    value={editingProject.tags ? editingProject.tags.join(', ') : ''}
                    onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                    placeholder="Web Design, Next.js, Conversion"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground uppercase font-semibold">Live Site URL (Optional)</label>
                  <Input
                    value={editingProject.liveUrl}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase font-semibold">The Problem / Challenge</label>
                <Textarea
                  value={editingProject.problem}
                  onChange={(e) => setEditingProject({ ...editingProject, problem: e.target.value })}
                  placeholder="Describe the client's problem..."
                  className="rounded-lg min-h-[70px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase font-semibold">The Solution / Execution</label>
                <Textarea
                  value={editingProject.solution}
                  onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                  placeholder="Explain your approach and build..."
                  className="rounded-lg min-h-[70px]"
                />
              </div>

              {/* Bento results stats */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-muted-foreground uppercase font-semibold">Performance Results Stats</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingProject({
                        ...editingProject,
                        results: [...(editingProject.results || []), { label: '', value: '' }]
                      });
                    }}
                    className="h-8 rounded"
                  >
                    + Add Result Metric
                  </Button>
                </div>
                {editingProject.results?.map((res: any, idx: number) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-3 items-center p-3 rounded-lg border border-border/40 bg-background/25 sm:p-0 sm:border-0 sm:bg-transparent">
                    <Input
                      value={res.value}
                      onChange={(e) => {
                        const updated = [...editingProject.results];
                        updated[idx].value = e.target.value;
                        setEditingProject({ ...editingProject, results: updated });
                      }}
                      placeholder="E.g., +62%"
                      className="rounded w-full"
                    />
                    <Input
                      value={res.label}
                      onChange={(e) => {
                        const updated = [...editingProject.results];
                        updated[idx].label = e.target.value;
                        setEditingProject({ ...editingProject, results: updated });
                      }}
                      placeholder="Demo Conversion"
                      className="rounded w-full"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = editingProject.results.filter((_: any, i: number) => i !== idx);
                        setEditingProject({ ...editingProject, results: updated });
                      }}
                      className="h-10 w-10 text-muted-foreground hover:text-destructive justify-self-end sm:justify-self-center shrink-0"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Gallery Images */}
              <div className="space-y-2 border border-border p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-muted-foreground uppercase font-semibold">Gallery Showcase Images</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingProject({
                        ...editingProject,
                        gallery: [...(editingProject.gallery || []), '']
                      });
                    }}
                    className="h-8 rounded"
                  >
                    + Add Gallery Image URL
                  </Button>
                </div>
                {editingProject.gallery?.map((img: string, idx: number) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center p-3 rounded-lg border border-border/40 bg-background/25 sm:p-0 sm:border-0 sm:bg-transparent">
                    <Input
                      value={img}
                      onChange={(e) => {
                        const updated = [...editingProject.gallery];
                        updated[idx] = e.target.value;
                        setEditingProject({ ...editingProject, gallery: updated });
                      }}
                      placeholder="URL or Uploaded Image Link"
                      className="rounded text-xs w-full"
                    />
                    <div className="flex gap-2 justify-end sm:justify-start items-center shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Quick inline uploader for gallery
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = async () => {
                            const file = input.files?.[0];
                            if (!file) return;
                            toast.loading('Uploading gallery image...', { id: 'gallery-upload' });
                            try {
                              const formData = new FormData();
                              formData.append('file', file);
                              const uploadRes = await fetch('/api/admin/upload', {
                                method: 'POST',
                                body: formData
                              });
                              if (!uploadRes.ok) throw new Error();
                              const uploadData = await uploadRes.json();
                              const updated = [...editingProject.gallery];
                              updated[idx] = uploadData.url;
                              setEditingProject({ ...editingProject, gallery: updated });
                              toast.success('Gallery image uploaded', { id: 'gallery-upload' });
                            } catch {
                              toast.error('Upload failed', { id: 'gallery-upload' });
                            }
                          };
                          input.click();
                        }}
                        className="h-10 text-xs px-3"
                      >
                        Upload
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = editingProject.gallery.filter((_: any, i: number) => i !== idx);
                          setEditingProject({ ...editingProject, gallery: updated });
                        }}
                        className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Client Case Testimonial details */}
              <div className="border border-border p-4 rounded-xl space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">Client Quote & Testimonial</h4>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Testimonial Quote</label>
                  <Textarea
                    value={editingProject.testimonial?.quote || ''}
                    onChange={(e) => setEditingProject({
                      ...editingProject,
                      testimonial: { ...(editingProject.testimonial || {}), quote: e.target.value }
                    })}
                    className="rounded-lg min-h-[50px]"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Author</label>
                    <Input
                      value={editingProject.testimonial?.author || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        testimonial: { ...(editingProject.testimonial || {}), author: e.target.value }
                      })}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Role</label>
                    <Input
                      value={editingProject.testimonial?.role || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        testimonial: { ...(editingProject.testimonial || {}), role: e.target.value }
                      })}
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <ImageUploader
                  label="Author Avatar"
                  value={editingProject.testimonial?.avatar || ''}
                  onChange={(url) => setEditingProject({
                    ...editingProject,
                    testimonial: { ...(editingProject.testimonial || {}), avatar: url }
                  })}
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={editingProject.featured || false}
                  onCheckedChange={(checked) => setEditingProject({ ...editingProject, featured: checked })}
                />
                <label className="text-sm font-semibold text-foreground">Featured Project (Displays on Homepage)</label>
              </div>
            </div>

            <DialogFooter className="border-t border-border/40 pt-4">
              <Button variant="outline" onClick={() => setProjectDialogOpen(false)} className="rounded-lg">
                Cancel
              </Button>
              <Button onClick={handleSaveProject} className="rounded-lg bg-accent text-accent-foreground font-semibold gap-1.5">
                Save Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dynamic Sonner Toaster */}
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
