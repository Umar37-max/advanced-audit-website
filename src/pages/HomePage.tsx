import React from 'react';
import { Hero } from '../components/Hero';
import { Manifesto } from '../components/Manifesto';
import { About } from '../components/About';
import { Services } from '../components/Services';
import { Process } from '../components/Process';
import { Industries } from '../components/Industries';
import { Clients } from '../components/Clients';
import { Team } from '../components/Team';
import { FinalCta } from '../components/FinalCta';
import { Contact } from '../components/Contact';
import { DotNav } from '../components/ui/Chrome';

/**
 * Порядок разделов выстроен как сценарий:
 * зачем это нужно → кто мы → что делаем → как работаем →
 * кому уже помогли → кто в команде → призыв → контакты.
 * Человек сначала понимает свою выгоду и только потом читает о компании.
 */
export function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Manifesto />
        <About />
        <Services />
        <Process />
        <Industries />
        <Clients />
        <Team />
        <FinalCta />
        <Contact />
      </main>

      {/* Риски-навигация знают только про секции главной, поэтому живут здесь */}
      <DotNav />
    </>
  );
}
