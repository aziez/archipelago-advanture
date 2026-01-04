'use client';

import { useState, useRef } from 'react';
import { Mail, Send, Loader2, CheckCircle2, MapPin, Globe } from 'lucide-react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';

// Shadcn & Form Imports
import { Button } from '@/components/ui/button';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Custom 3D Imports
import { CharacterViewer } from '@/components/portfolio-overlay/shared/CharacterViewer';

// i18n Import
import { useTranslations } from 'next-intl';

// --- 1. 3D OBJECT: SIGNAL NODE (Biarkan Sama) ---
const SignalNode = () => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.1);
      coreRef.current.rotation.y += delta * 0.5;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.sin(t) * 0.5;
      ring1Ref.current.rotation.y += delta;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 2 + Math.cos(t) * 0.5;
      ring2Ref.current.rotation.y -= delta * 0.8;
    }
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#be185d"
          emissiveIntensity={2}
          wireframe
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial
          color="#ec4899"
          transparent
          opacity={0.1}
          wireframe={false}
        />
      </mesh>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.4, 0.02, 16, 100]} />
        <meshStandardMaterial color="#fbcfe8" emissive="#ec4899" />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.8, 0.02, 16, 100]} />
        <meshStandardMaterial color="#fbcfe8" emissive="#ec4899" />
      </mesh>
    </group>
  );
};

export const ContactTerminal = () => {
  const t = useTranslations('Contact'); // Panggil Namespace
  const [isSuccess, setIsSuccess] = useState(false);

  // --- 2. VALIDATION SCHEMA (Pindah ke dalam agar bisa pakai t) ---
  const formSchema = z.object({
    name: z.string().min(2, { message: t('validation.name_required') }),
    email: z.string().email({ message: t('validation.email_invalid') }),
    message: z.string().min(5, { message: t('validation.message_short') }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('https://formspree.io/f/mnnaeway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        setIsSuccess(true);
        form.reset();
      }
    } catch (error) {
      console.error('Error', error);
    }
  }

  return (
    <div className="p-4 md:p-10 h-full flex flex-col md:flex-row gap-8">
      {/* --- LEFT COLUMN: 3D VISUALIZER & INFO --- */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        {/* 3D Container */}
        <div className="relative h-64 md:h-80 bg-slate-900/50 rounded-2xl border border-pink-500/20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-pink-900/20 via-slate-900/0 to-slate-900/0" />

          {/* Status Overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <div className="flex gap-1 items-end h-3">
              <div className="w-1 h-1 bg-pink-500 animate-pulse" />
              <div className="w-1 h-2 bg-pink-500 animate-pulse delay-75" />
              <div className="w-1 h-3 bg-pink-500 animate-pulse delay-150" />
            </div>
            <span className="text-[10px] font-mono text-pink-400 tracking-widest">
              {t('status')}
            </span>
          </div>

          <CharacterViewer scale={1.6} offset={[0, 0, 0]}>
            <SignalNode />
          </CharacterViewer>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest border-b border-white/10 pb-2 mb-4">
            {t('channels.title')}
          </h3>

          <div className="flex items-center gap-3 text-sm group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
            <div className="p-2 bg-pink-500/20 text-pink-400 rounded-lg">
              <Mail size={16} />
            </div>
            <div>
              <div className="text-slate-400 text-xs">
                {t('channels.email.label')}
              </div>
              <div className="text-white">{t('channels.email.value')}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm group hover:bg-white/5 p-2 rounded-lg transition-colors">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <Globe size={16} />
            </div>
            <div>
              <div className="text-slate-400 text-xs">
                {t('channels.social.label')}
              </div>
              <div className="text-white">{t('channels.social.value')}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm group hover:bg-white/5 p-2 rounded-lg transition-colors">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <MapPin size={16} />
            </div>
            <div>
              <div className="text-slate-400 text-xs">
                {t('channels.location.label')}
              </div>
              <div className="text-white">{t('channels.location.value')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: FORM TERMINAL --- */}
      <div className="flex-1 bg-slate-900/80 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        {/* Background Grid Decoration */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5 pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2">
              {t('header.title')}
            </h2>
            <p className="text-slate-400 text-sm font-mono">
              {/* Gunakan t.rich untuk handle <br /> */}
              {t.rich('header.subtitle', {
                br: (chunks) => (
                  <>
                    <br />
                    {chunks}
                  </>
                ),
              })}
            </p>
          </div>

          {isSuccess ? (
            // SUCCESS STATE
            <div className="h-64 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-400 ring-2 ring-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {t('success.title')}
              </h3>
              <p className="text-slate-400 max-w-xs mx-auto mb-6">
                {t('success.desc')}
              </p>
              <Button
                variant="outline"
                onClick={() => setIsSuccess(false)}
                className="border-white/10 text-white hover:bg-white/10"
              >
                {t('success.btn_another')}
              </Button>
            </div>
          ) : (
            // FORM STATE
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-[10px] text-pink-400 font-mono uppercase tracking-widest mb-1.5 block">
                          {t('form.name.label')}
                        </FieldLabel>
                        <Input
                          placeholder={t('form.name.placeholder')}
                          {...field}
                          className="bg-black/30 border-white/10 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 h-12 transition-all"
                        />
                        {fieldState.invalid && (
                          <FieldError
                            errors={[fieldState.error]}
                            className="text-red-400 text-xs mt-1"
                          />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-[10px] text-pink-400 font-mono uppercase tracking-widest mb-1.5 block">
                          {t('form.email.label')}
                        </FieldLabel>
                        <Input
                          placeholder={t('form.email.placeholder')}
                          {...field}
                          className="bg-black/30 border-white/10 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 h-12 transition-all"
                        />
                        {fieldState.invalid && (
                          <FieldError
                            errors={[fieldState.error]}
                            className="text-red-400 text-xs mt-1"
                          />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>

              <FieldGroup>
                <Controller
                  control={form.control}
                  name="message"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-[10px] text-pink-400 font-mono uppercase tracking-widest mb-1.5 block">
                        {t('form.message.label')}
                      </FieldLabel>
                      <Textarea
                        placeholder={t('form.message.placeholder')}
                        rows={5}
                        {...field}
                        className="bg-black/30 border-white/10 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 resize-none transition-all"
                      />
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="text-red-400 text-xs mt-1"
                        />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold h-14 rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] group"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{t('form.submit_btn')}</span>
                    <Send
                      size={16}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </div>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
