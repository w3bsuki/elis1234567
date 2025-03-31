"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

type BookExcerptProps = {
  book: {
    id: string;
    title: string;
    coverImage: string;
    excerpt: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BookExcerptDialog({ book, open, onOpenChange }: BookExcerptProps) {
  const { language } = useLanguage();
  const translate = (bg: string, en: string) => language === 'bg' ? bg : en;
  
  // Create pagination for the excerpt
  const paragraphs = book.excerpt.split('\n\n').filter(p => p.trim().length > 0);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(paragraphs.length / 2);
  
  // Set a maximum number of pages to show (first few paragraphs only)
  const maxPages = Math.min(3, totalPages);
  
  const nextPage = () => {
    if (currentPage < maxPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const getCurrentPageContent = () => {
    const startIdx = currentPage * 2;
    return paragraphs.slice(startIdx, startIdx + 2);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] overflow-hidden flex flex-col bg-[#FCFCFC] dark:bg-gray-900 border-green-200 dark:border-green-900 shadow-xl rounded-xl">
        <DialogHeader className="relative px-6 pt-8 pb-4 border-b border-green-100 dark:border-green-900/50">
          <div className="absolute right-4 top-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-full h-8 w-8 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <DialogTitle className="text-2xl font-bold font-playfair text-center text-gray-900 dark:text-gray-100">
            {translate("Откъс от", "Excerpt from")} "{book.title}"
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500 dark:text-gray-400">
            {translate("Насладете се на този кратък откъс от книгата", "Enjoy this short excerpt from the book")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 items-start">
            {/* Book cover with 3D effect */}
            <div className="hidden md:block relative mx-auto w-full max-w-[200px] perspective">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.25)] border border-gray-200 dark:border-gray-700 transform hover:rotate-y-5 hover:scale-105 transition-all duration-500 preserve-3d book-shadow">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="250px"
                />
                
                {/* Book spine effect */}
                <div className="absolute left-0 top-0 bottom-0 w-[12px] bg-gradient-to-r from-black/60 to-transparent"></div>
                
                {/* Book cover shadow */}
                <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] rounded-lg pointer-events-none"></div>
              </div>
            </div>
            
            {/* Excerpt content with page turning animation */}
            <div className="relative min-h-[300px] md:min-h-[400px] flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="prose prose-green dark:prose-invert max-w-none flex-1"
                >
                  {getCurrentPageContent().map((paragraph, idx) => (
                    <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5 first-letter:text-3xl first-letter:font-playfair first-letter:mr-1 first-letter:float-left first-letter:font-bold">
                      {paragraph}
                    </p>
                  ))}
                </motion.div>
              </AnimatePresence>
              
              {/* Page indicator */}
              <div className="flex items-center justify-center mt-4 space-x-2">
                {Array.from({ length: maxPages }).map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${currentPage === idx ? 'bg-green-600 dark:bg-green-400 scale-125' : 'bg-gray-300 dark:bg-gray-700'}`}
                    aria-label={`Go to page ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t border-green-100 dark:border-green-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="h-9 px-3 rounded-md border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              {translate("Предишна", "Previous")}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === maxPages - 1}
              className="h-9 px-3 rounded-md border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30"
            >
              {translate("Следваща", "Next")}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-4 h-9 rounded-md shadow-md"
              asChild
            >
              <a href={`/shop/${book.id}`} className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {translate("Купи цялата книга", "Buy Full Book")}
              </a>
            </Button>
          </div>
        </DialogFooter>
        
        {/* Add custom styles for the 3D book effect */}
        <style jsx global>{`
          .perspective {
            perspective: 1000px;
          }
          
          .preserve-3d {
            transform-style: preserve-3d;
          }
          
          .book-shadow {
            box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23), 
                       -10px 10px 15px rgba(0,0,0,0.12);
          }
          
          .rotate-y-5 {
            transform: rotateY(5deg);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
} 