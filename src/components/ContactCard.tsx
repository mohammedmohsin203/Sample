import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';
import { useTranslations } from 'next-intl';

// Declare EmailJS on global window
declare global {
  interface Window {
    emailjs: {
      send: (
          serviceID: string,
          templateID: string,
          templateParams: Record<string, string>,
          publicKey: string
      ) => Promise<void>;
    };
  }
}

// Form data interface
interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactDrawer: React.FC = () => {
  const t = useTranslations('Index'); // Use translations from Index namespace
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [emailjsLoaded, setEmailjsLoaded] = useState<boolean>(false);

  // Load EmailJS script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@3.2.0/dist/email.min.js';
    script.async = true;
    script.onload = () => setEmailjsLoaded(true);
    script.onerror = () => {
      console.error('Failed to load EmailJS script');
      toast.error(t('error'));
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [t]);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { name, email, message } = formData;

    // Validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error(t('invalid'));
      return;
    }

    if (!validateEmail(email)) {
      toast.error(t('invalid')); // Consider adding a specific key for invalid email
      return;
    }

    if (!emailjsLoaded || !window.emailjs) {
      toast.error(t('error'));
      return;
    }

    setIsLoading(true);

    try {
      // EmailJS configuration
      const serviceID = 'service_ch4zcns';
      const templateID = 'template_6718pr8';
      const publicKey = 'WQDfV3qdM6drWTe_a';

      // EmailJS template parameters
      const templateParams: Record<string, string> = {
        from_name: name,
        from_email: email,
        message,
        to_email: 'mohammedmohsin203@gmail.com',
      };

      // Send email via EmailJS
      await window.emailjs.send(serviceID, templateID, templateParams, publicKey);

      toast.success(t('success'));

      // Reset form and close drawer
      setFormData({ name: '', email: '', message: '' });
      setOpen(false);
    } catch (error) {
      console.error('EmailJS error:', error);
      toast.error(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="flex justify-center items-center">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <InteractiveHoverButton className="scale-150 m-2">
              {t('sendMessage')}
            </InteractiveHoverButton>
          </DrawerTrigger>
          <DrawerContent className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-lg">
            <DrawerHeader>
              <DrawerTitle className="text-lg sm:text-xl md:text-2xl">{t('sendMessage')}</DrawerTitle>
            </DrawerHeader>
            <form className="space-y-4 px-4 py-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">{t('name')}</Label>
                <Input
                    id="name"
                    placeholder={t('namePlaceholder')}
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">{t('email')}</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm sm:text-base">{t('message')}</Label>
                <Textarea
                    id="message"
                    placeholder={t('messagePlaceholder')}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isLoading}
                />
              </div>
              <DrawerFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? t('submit') + '...' : t('submit')}
                </Button>
              </DrawerFooter>
            </form>
          </DrawerContent>
        </Drawer>
      </div>
  );
};

export default ContactDrawer;