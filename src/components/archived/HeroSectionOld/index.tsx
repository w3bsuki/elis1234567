"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowRight, BookOpen, Download, SendIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";
import { HeroSectionProps } from "./types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTranslation } from "@/lib/hooks";
import { CONTAINER_WIDTH_CLASSES } from "@/lib/constants";
import Header from "@/components/layout/Header";
// Import other sections
import BooksSection from "../BooksSection";
import ServicesSection from "../ServicesSection";
import Testimonials from "../Testimonials";
import { Contact } from "../Contact";
import { Footer } from "@/components/layout/Footer";
// Import Book component
import { Book } from "@/components/ui/book";

// Animations - memoized to avoid rerenders
const ANIMATIONS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }
};

export function HeroSection({ className, includeFooter = false }: HeroSectionProps & { includeFooter?: boolean }) {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { t, locale } = useTranslation();
  
  // Memoized data objects to prevent rerenders
  const profile = useMemo(() => ({
    imageSrc: "/images/avatar/avatar.jpg",
    name: language === 'en' ? "Elisa Ivanova" : "Елиса Иванова",
    title: language === 'en' ? "Psychologist & Author" : "Писател & Психолог",
    altText: language === 'en' ? "Profile photo of Elisa Ivanova" : "Профилна снимка на Елиса Иванова"
  }), [language]);
  
  const featuredBook = useMemo(() => ({
    id: "1",
    title: language === 'en' ? "Mindful Eating" : "Осъзнато хранене",
    description: language === 'en' 
      ? "Learn how to develop a healthier relationship with food and transform the way you eat."
      : "Научете как да развиете по-здравословна връзка с храната и да трансформирате начина, по който се храните.",
    price: "20.00",
    pages: 240,
    publishDate: "2023",
    buttonText: language === 'en' ? "Read excerpt" : "Прочети откъс",
    buyText: language === 'en' ? "Buy Now" : "Купи"
  }), [language]);
  
  // Additional highlighted books
  const otherBooks = useMemo(() => [
    {
      id: "2",
      title: language === 'en' ? "The Art of Loving" : "Изкуството да обичаш",
      price: "18.00",
    },
    {
      id: "3",
      title: language === 'en' ? "Rediscover Yourself" : "Преоткрий себе си", 
      price: "22.00",
    }
  ], [language]);
  
  // Quick service previews
  const quickServices = useMemo(() => [
    {
      id: "individual",
      title: language === 'en' ? "Individual Therapy" : "Индивидуална терапия",
      icon: "UserRound"
    },
    {
      id: "art",
      title: language === 'en' ? "Art Therapy" : "Арт терапия",
      icon: "Palette" 
    },
    {
      id: "couples",
      title: language === 'en' ? "Couples Therapy" : "Терапия за двойки",
      icon: "Heart"
    }
  ], [language]);
  
  // Replace the old CTA button data with expertise areas
  const expertiseAreas = useMemo(() => [
    {
      icon: "📚",
      title: language === 'en' ? "Books" : "Книги",
      description: language === 'en' ? "Self-help & growth resources" : "Ресурси за себепомощ и развитие",
      url: "/shop"
    },
    {
      icon: "🎓",
      title: language === 'en' ? "Services" : "Услуги",
      description: language === 'en' ? "Professional therapy sessions" : "Професионални терапевтични сесии",
      url: "/services"
    },
    {
      icon: "📝",
      title: language === 'en' ? "Articles" : "Статии",
      description: language === 'en' ? "Insights & practical tips" : "Прозрения и практични съвети",
      url: "/blog"
    }
  ], [language]);
  
  const freeEbook = useMemo(() => ({
    title: language === 'en' ? "Get Your Free eBook" : "Получете безплатна електронна книга",
    description: language === 'en' 
      ? "\"5 Techniques for Stress Management\" - delivered to your inbox"
      : "\"5 Техники за Справяне със Стреса\" - директно във вашата пощенска кутия",
    buttonText: language === 'en' ? "Subscribe Now" : "Абонирайте се сега"
  }), [language]);
  
  // UI text translations
  const ui = useMemo(() => ({
    newBadge: language === 'en' ? "New" : "Ново",
    pages: language === 'en' ? "pages" : "стр.",
    published: language === 'en' ? "Published" : "Издадена",
    aboutAuthor: language === 'en' ? "About Author" : "За автора",
    featuredContent: language === 'en' ? "Featured Content" : "Препоръчано съдържание",
    welcomeMessage: language === 'en' ? "Welcome Message" : "Приветствено съобщение",
    booksHeader: language === 'en' ? "More Books by Author" : "Още книги от автора",
    servicesHeader: language === 'en' ? "Services Offered" : "Предлагани услуги", 
    consultationLabel: language === 'en' ? "Schedule Consultation" : "Запазете Консултация",
    transformHeading: language === 'en' ? "Transform Your Life" : "Трансформирай Живота Си",
    aboutText: language === 'en'
      ? "Certified psychologist and author helping you create a conscious, dream life filled with love and harmony."
      : "Дипломиран психолог и автор, помагащ ви да създадете осъзнат, мечтан живот, изпълнен с любов и хармония."
  }), [language]);
  
  // Handle dialog accessibility and keyboard navigation
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Handler for keyboard events on Card elements
  const handleCardKeyDown = (e: React.KeyboardEvent, url: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = url;
    }
  };
  
  // Improve scroll to top functionality for keyboard users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Home') {
        window.scrollTo({
          top: 0,
          behavior: shouldReduceMotion ? 'auto' : 'smooth'
        });
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shouldReduceMotion]);
  
  return (
    <div className={cn("pt-0 pb-4 px-4 md:pb-6 md:px-6", className)}>
      {/* Main Hero content */}
      <div className="mb-4 sm:mb-6 max-w-[1440px] mx-auto">
        {/* Outer Neumorphic Container - Green accent */}
        <div className="w-full rounded-2xl p-[2px]
            bg-gradient-to-br from-green-100/80 via-white/90 to-green-50/80 
            dark:from-green-900/30 dark:via-gray-900/90 dark:to-gray-800/80
            shadow-[5px_5px_10px_rgba(0,0,0,0.08),-5px_-5px_10px_rgba(255,255,255,0.8)]
            dark:shadow-[5px_5px_10px_rgba(0,0,0,0.25),-5px_-5px_10px_rgba(40,40,40,0.15)]">
          
          {/* Inner Neumorphic Container with green accent */}
          <div className="bg-gradient-to-br from-white/90 via-white/80 to-green-50/50 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-green-900/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-5 relative min-h-[calc(60vh-40px)] sm:min-h-[calc(60vh-60px)] flex flex-col justify-start shadow-inner border border-green-100/50 dark:border-green-900/30 pt-6">
            {/* Subtle pattern background */}
            <div 
              className="absolute inset-0 bg-[url('/images/pattern-light.svg')] dark:bg-[url('/images/pattern-dark.svg')] opacity-[0.02] bg-repeat bg-[length:24px_24px] pointer-events-none rounded-lg"
              aria-hidden="true"
            ></div>
            
            {/* Green accent orbs */}
            <div className="absolute top-1/3 right-10 h-40 w-40 bg-green-200/20 dark:bg-green-900/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/3 left-10 h-40 w-40 bg-green-100/20 dark:bg-green-900/10 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Two-column layout for hero content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
              {/* Left column: Author info */}
              <motion.div
                variants={ANIMATIONS.container}
                initial="hidden"
                animate="visible"
                className="space-y-6 md:space-y-8 text-center md:text-left flex flex-col justify-center h-full relative"
                aria-live="polite"
              >
                {/* Decorative background element */}
                <div className="absolute -inset-6 md:inset-auto md:-left-4 md:-right-4 md:-top-4 md:-bottom-4 bg-gradient-to-br from-white/40 via-white/60 to-green-50/30 dark:from-gray-800/40 dark:via-gray-800/60 dark:to-green-900/20 rounded-2xl -z-10 backdrop-blur-sm pointer-events-none"></div>
                <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-green-100/30 dark:bg-green-900/10 rounded-full blur-2xl pointer-events-none -z-10"></div>
                
                {/* Avatar with green glow effect */}
                <motion.div variants={shouldReduceMotion ? {} : ANIMATIONS.item} className="mb-4 sm:mb-6 mx-auto md:mx-0 w-max">
                  <div className="relative">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full blur opacity-70 animate-pulse-slow"></div>
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-white dark:border-gray-800 relative shadow-xl">
                      <AvatarImage src="/images/author-avatar.jpg" alt={profile.altText} />
                      <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </motion.div>
                
                {/* Professional badge with visual upgrade */}
                <motion.div variants={shouldReduceMotion ? {} : ANIMATIONS.item} className="inline-flex md:justify-start justify-center w-full mb-4">
                  <Badge variant="outline" className="px-4 py-1.5 rounded-full border-green-200 dark:border-green-900/40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
                    shadow-[0_2px_5px_rgba(22,163,74,0.15)] text-sm font-medium">
                    <Heart className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" aria-hidden="true" />
                    <span className="font-medium text-green-700 dark:text-green-300">{profile.title}</span>
                  </Badge>
                </motion.div>
                
                {/* Author name with improved typography */}
                <motion.h1 
                  variants={shouldReduceMotion ? {} : ANIMATIONS.item}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif !leading-[1.15] text-gray-900 dark:text-white tracking-tight"
                >
                  {profile.name}
                </motion.h1>
                
                {/* Heading with stylish gradient */}
                <motion.h2 
                  variants={shouldReduceMotion ? {} : ANIMATIONS.item}
                  className="text-xl md:text-2xl lg:text-3xl font-bold font-serif !leading-tight 
                    bg-gradient-to-r from-green-700 to-green-500 dark:from-green-400 dark:to-green-300 
                    bg-clip-text text-transparent mb-1 mt-2"
                >
                  {ui.transformHeading}
                </motion.h2>
              
                {/* About text with enhanced visual treatment */}
                <motion.p 
                  variants={shouldReduceMotion ? {} : ANIMATIONS.item}
                  className="text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-300 
                    max-w-md mx-auto md:mx-0
                    px-5 py-4 rounded-xl 
                    bg-gradient-to-br from-white via-white to-green-50/50 dark:from-gray-800/80 dark:via-gray-800/80 dark:to-green-900/20
                    backdrop-blur-sm 
                    shadow-inner border border-green-100/50 dark:border-green-900/30 
                    leading-relaxed"
                >
                  {ui.aboutText}
                </motion.p>
              
                {/* Social proof element */}
                <motion.div 
                  variants={shouldReduceMotion ? {} : ANIMATIONS.item} 
                  className="flex items-center justify-center md:justify-start gap-3 my-1"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center text-xs font-medium overflow-hidden"
                      >
                        <span className="sr-only">Happy client {i}</span>
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(/images/client-${i}.jpg)` }}></div>
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-xs font-medium text-green-600 dark:text-green-400">+5</div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">50+</span> happy clients
                  </span>
                </motion.div>
              
                {/* Call to action button with improved design */}
                <motion.div variants={shouldReduceMotion ? {} : ANIMATIONS.item} className="flex justify-center md:justify-start pt-2">
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className={cn(
                      "rounded-full",
                      "px-7 py-6", 
                      "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700", 
                      "text-white font-bold text-base", 
                      "flex items-center gap-3", 
                      "transition-all duration-300",
                      "shadow-[0_4px_14px_rgba(22,163,74,0.3),0_1px_3px_rgba(22,163,74,0.2)]",
                      "hover:shadow-[0_6px_20px_rgba(22,163,74,0.4),0_1px_3px_rgba(22,163,74,0.2)]",
                      "hover:translate-y-[-2px]", 
                      "active:translate-y-[1px] active:shadow-[0_2px_10px_rgba(22,163,74,0.25)]"
                    )}
                    asChild
                    aria-label={ui.consultationLabel}
                  >
                    <Link 
                      href="/contact?booking=true"
                      className="flex items-center justify-center gap-2" 
                    >
                      <SendIcon className="size-5" aria-hidden="true" />
                      <span>{ui.consultationLabel}</span>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* Right column: Featured Book */}
              <motion.div
                variants={ANIMATIONS.container}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center h-full space-y-6"
              >
                {/* New book badge */}
                <motion.div variants={shouldReduceMotion ? {} : ANIMATIONS.item} className="self-end mb-2">
                  <Badge className="bg-green-500 hover:bg-green-600 px-3 py-1.5 text-white shadow-sm text-sm font-medium">
                    {ui.newBadge}
                  </Badge>
                </motion.div>
                
                {/* Book component */}
                <motion.div 
                  variants={shouldReduceMotion ? {} : ANIMATIONS.item}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <Book color="#4ade80" texture={true} depth={8} width={260}>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-black">{featuredBook.title}</h3>
                      <p className="mt-2 text-sm text-gray-700">{language === 'en' ? "New Release" : "Ново издание"}</p>
                    </div>
                  </Book>
                </motion.div>
                
                {/* Book metadata */}
                <motion.div variants={shouldReduceMotion ? {} : ANIMATIONS.item} className="text-center space-y-3 max-w-md">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white 
                    bg-gradient-to-r from-green-700 to-green-500 dark:from-green-400 dark:to-green-300 
                    bg-clip-text text-transparent">
                    {featuredBook.title}
                  </h3>
                  
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <BookOpen className="h-4 w-4 mr-1.5 text-green-500 dark:text-green-400" />
                      <span>{featuredBook.pages} {ui.pages}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="text-xs">📅</span>
                      <span className="ml-1">{ui.published}: {featuredBook.publishDate}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                    {featuredBook.description}
                  </p>
                  
                  {/* Book actions */}
                  <div className="flex items-center justify-center gap-4 pt-3">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">{featuredBook.price} лв.</span>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full border-green-200 dark:border-green-800 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 shadow-sm transition-all duration-200"
                      asChild
                    >
                      <Link 
                        href={`/shop/book/${featuredBook.id}/preview`}
                        className="flex items-center" 
                      >
                        {featuredBook.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="rounded-full bg-green-600 hover:bg-green-700 text-white shadow transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] active:brightness-95"
                      asChild
                    >
                      <Link href={`/shop/book/${featuredBook.id}`}>
                        {featuredBook.buyText}
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create a separate FeaturedContent component outside of the HeroSection
export function FeaturedContent() {
  const { language } = useLanguage();
  
  // Reuse the same hooks and data from HeroSection
  const featuredBook = useMemo(() => ({
    id: "1",
    title: language === 'en' ? "Mindful Eating" : "Осъзнато хранене",
    description: language === 'en' 
      ? "Learn how to develop a healthier relationship with food and transform the way you eat."
      : "Научете как да развиете по-здравословна връзка с храната и да трансформирате начина, по който се храните.",
    price: "20.00",
    pages: 240,
    publishDate: "2023",
    buttonText: language === 'en' ? "Read excerpt" : "Прочети откъс",
    buyText: language === 'en' ? "Buy Now" : "Купи"
  }), [language]);
  
  // Quick service previews
  const quickServices = useMemo(() => [
    {
      id: "individual",
      title: language === 'en' ? "Individual Therapy" : "Индивидуална терапия",
      icon: "UserRound"
    },
    {
      id: "art",
      title: language === 'en' ? "Art Therapy" : "Арт терапия",
      icon: "Palette" 
    },
    {
      id: "couples",
      title: language === 'en' ? "Couples Therapy" : "Терапия за двойки",
      icon: "Heart"
    }
  ], [language]);
  
  const freeEbook = useMemo(() => ({
    title: language === 'en' ? "Get Your Free eBook" : "Получете безплатна електронна книга",
    description: language === 'en' 
      ? "\"5 Techniques for Stress Management\" - delivered to your inbox"
      : "\"5 Техники за Справяне със Стреса\" - директно във вашата пощенска кутия",
    buttonText: language === 'en' ? "Subscribe Now" : "Абонирайте се сега"
  }), [language]);
  
  // UI text translations
  const ui = useMemo(() => ({
    newBadge: language === 'en' ? "New" : "Ново",
    pages: language === 'en' ? "pages" : "стр.",
    published: language === 'en' ? "Published" : "Издадена",
    featuredContent: language === 'en' ? "Featured Content" : "Препоръчано съдържание",
    servicesHeader: language === 'en' ? "Services Offered" : "Предлагани услуги",
  }), [language]);
  
  return (
    <section className="mt-16 mb-12 pt-8 pb-8">
      <div className={cn(CONTAINER_WIDTH_CLASSES, "px-4 mx-auto")}>
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium rounded-full mb-3">
            {language === 'en' ? "Explore" : "Разгледайте"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 relative inline-block">
            <span className="relative z-10">{ui.featuredContent}</span>
            <span className="absolute -bottom-1 left-0 right-0 h-3 bg-green-100/50 dark:bg-green-900/20 -rotate-1 z-0"></span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-green-400 to-green-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Featured Book - Now using Book component */}
          <div className="rounded-2xl p-[3px] h-full
              bg-gradient-to-br from-green-100/80 via-white/90 to-green-50/80 
              dark:from-green-900/20 dark:via-gray-900/90 dark:to-gray-800/80 
              shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]
              dark:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(30,30,30,0.2)]
              overflow-hidden">
            
            {/* Book content with improved layout */}
            <div className="bg-gradient-to-br from-white via-white to-green-50/70 dark:from-gray-900/50 dark:via-gray-900/30 dark:to-green-900/10 p-6 sm:p-7 rounded-lg relative h-full flex flex-col">
              <div className="absolute inset-1 bg-white/30 dark:bg-gray-900/30 rounded-lg backdrop-blur-sm shadow-inner pointer-events-none"></div>
              
              {/* New book badge - Green color */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-green-500 hover:bg-green-600 px-3 py-1.5 text-white shadow-sm text-sm font-medium">
                  {ui.newBadge}
                </Badge>
              </div>
              
              <div className="relative z-10 flex flex-col flex-1">
                {/* Display the Book component */}
                <div className="flex justify-center mb-6">
                  <Book color="#4ade80" texture={true} depth={6} width={220}>
                    <div className="p-4 text-center text-black dark:text-white">
                      <h4 className="font-bold">{featuredBook.title}</h4>
                    </div>
                  </Book>
                </div>
                
                {/* Book title - Larger and better spacing */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 
                    bg-gradient-to-r from-green-700 to-green-500 dark:from-green-400 dark:to-green-300 
                    bg-clip-text text-transparent">
                  {featuredBook.title}
                </h3>
                
                {/* Book metadata - Added visual structure */}
                <div className="flex items-center mb-4 text-sm space-x-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <BookOpen className="h-4 w-4 mr-1.5 text-green-500 dark:text-green-400" />
                    <span>{featuredBook.pages} {ui.pages}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-xs">📅</span>
                    <span className="ml-1">{ui.published}: {featuredBook.publishDate}</span>
                  </div>
                </div>
                
                {/* Book description - Better typography */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow leading-relaxed text-base">
                  {featuredBook.description}
                </p>
                
                {/* Action area - Better structured with clearer hierarchy */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">{featuredBook.price} лв.</span>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full border-green-200 dark:border-green-800 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 shadow-sm transition-all duration-200"
                      asChild
                    >
                      <Link 
                        href={`/shop/book/${featuredBook.id}/preview`}
                        className="flex items-center" 
                      >
                        {featuredBook.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="rounded-full bg-green-600 hover:bg-green-700 text-white shadow transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] active:brightness-95"
                      asChild
                    >
                      <Link href={`/shop/book/${featuredBook.id}`}>
                        {featuredBook.buyText}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Free eBook */}
          <div className="rounded-2xl p-[3px] h-full
              bg-gradient-to-br from-green-100/80 via-white/90 to-green-50/80 
              dark:from-green-900/20 dark:via-gray-900/90 dark:to-gray-800/80 
              shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]
              dark:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(30,30,30,0.2)]
              overflow-hidden">
            <div className="bg-gradient-to-br from-white via-white to-green-50/70 dark:from-gray-900/50 dark:via-gray-900/30 dark:to-green-900/10 p-6 rounded-lg relative h-full flex flex-col">
              <div className="absolute inset-1 bg-white/30 dark:bg-gray-900/30 rounded-lg backdrop-blur-sm shadow-inner pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-3">{freeEbook.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{freeEbook.description}</p>
                
                <div className="mt-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full border-green-200 dark:border-green-800 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 shadow-sm transition-all duration-200"
                    asChild
                  >
                    <Link 
                      href="/subscribe"
                      className="flex items-center" 
                    >
                      {freeEbook.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Service offers */}
          <div className="rounded-2xl p-[3px] h-full
              bg-gradient-to-br from-green-100/80 via-white/90 to-green-50/80 
              dark:from-green-900/20 dark:via-gray-900/90 dark:to-gray-800/80 
              shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]
              dark:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(30,30,30,0.2)]
              overflow-hidden">
            <div className="bg-gradient-to-br from-white via-white to-green-50/70 dark:from-gray-900/50 dark:via-gray-900/30 dark:to-green-900/10 p-6 rounded-lg relative h-full flex flex-col">
              <div className="absolute inset-1 bg-white/30 dark:bg-gray-900/30 rounded-lg backdrop-blur-sm shadow-inner pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4">{ui.servicesHeader}</h3>
                <div className="space-y-3 flex-grow">
                  {quickServices.map(service => (
                    <Link 
                      key={service.id}
                      href={`/services#${service.id}`}
                      className="flex items-center p-3 bg-white dark:bg-gray-700/80 rounded-lg border border-green-100/50 dark:border-green-800/30
                        hover:bg-green-50/80 dark:hover:bg-green-900/10 transition-colors duration-200
                        group no-underline"
                    >
                      <div className="mr-3 p-2 bg-green-50 dark:bg-green-800/30 rounded-full
                        group-hover:bg-green-100 dark:group-hover:bg-green-800/50 transition-colors duration-200">
                        {/* Use green color for icons */}
                        {service.icon === 'Heart' && <Heart className="h-5 w-5 text-green-500 dark:text-green-400" />}
                        {service.icon === 'UserRound' && <span className="text-green-500 dark:text-green-400">👤</span>}
                        {service.icon === 'Palette' && <span className="text-green-500 dark:text-green-400">🎨</span>}
                      </div>
                      <span className="text-gray-800 dark:text-gray-200 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-200">{service.title}</span>
                    </Link>
                  ))}
                </div>
                
                <div className="mt-4 pt-3 border-t border-green-100/50 dark:border-green-900/30">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full rounded-full border-green-200 dark:border-green-800 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 shadow-sm transition-all duration-200"
                    asChild
                  >
                    <Link href="/services">
                      {language === 'en' ? "View All Services" : "Всички услуги"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 