"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit, Key, FileText, Target, CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

export default function SetupWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [keys, setKeys] = useState({ deepseek: '', apify: '', rapid: '', serp: '' });
  const [resume, setResume] = useState('');
  const [goals, setGoals] = useState('');
  const [locations, setLocations] = useState('');

  const handleNext = () => {
    if (step === 1 && !keys.deepseek.trim()) {
      setError('DeepSeek API Key is mandatory to proceed.');
      return;
    }
    if (step === 2 && !resume.trim()) {
      setError('Please provide your resume text.');
      return;
    }
    setError('');
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!goals.trim()) {
      setError('Please provide your career goals.');
      return;
    }
    if (!locations.trim()) {
      setError('Please provide your target locations (e.g. Remote, WI).');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deepseekApiKey: keys.deepseek,
          apifyApiKey: keys.apify,
          rapidApiKey: keys.rapid,
          serpApiKey: keys.serp,
          resumeText: resume,
          goalsText: goals,
          locationsText: locations
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save settings.');
      }

      router.push('/');
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, var(--subtle), var(--bg))',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Progress Bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '4px', background: 'var(--subtle)', width: '100%'
        }}>
          <div style={{
            height: '100%',
            background: 'var(--accent)',
            width: `${(step / 3) * 100}%`,
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px', background: 'var(--accent-dim)',
            border: '1px solid var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px', color: 'var(--accent)'
          }}>
            <BrainCircuit size={28} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Universal Career Dashboard
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
            {step === 1 && "Let's connect your AI engines."}
            {step === 2 && "Feed the engine your professional context."}
            {step === 3 && "Tell us exactly what you're looking for."}
          </p>
        </div>

        {error && (
          <div style={{ background: 'var(--red-dim)', color: 'var(--red)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '24px', border: '1px solid var(--red)' }}>
            {error}
          </div>
        )}

        {/* STEP 1: API KEYS */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <InputRow 
                icon={<Key size={16} />} label="DeepSeek API Key" 
                placeholder="sk-..." required value={keys.deepseek} 
                onChange={(e: any) => setKeys({...keys, deepseek: e.target.value})} 
              />
              <InputRow 
                icon={<Key size={16} />} label="Apify API Token" 
                placeholder="apify_api_..." value={keys.apify} 
                onChange={(e: any) => setKeys({...keys, apify: e.target.value})} 
              />
              <InputRow 
                icon={<Key size={16} />} label="RapidAPI Key" 
                placeholder="..." value={keys.rapid} 
                onChange={(e: any) => setKeys({...keys, rapid: e.target.value})} 
              />
              <InputRow 
                icon={<Key size={16} />} label="SerpApi Key" 
                placeholder="..." value={keys.serp} 
                onChange={(e: any) => setKeys({...keys, serp: e.target.value})} 
              />
            </div>
          </div>
        )}

        {/* STEP 2: RESUME */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
              <FileText size={16} color="var(--accent)" /> Paste Your Full Resume
            </label>
            <textarea 
              value={resume}
              onChange={(e: any) => setResume(e.target.value)}
              placeholder="Paste your entire resume text here. The AI will use this to score job fit and generate tailored outreach."
              style={{
                width: '100%', height: '240px', background: 'var(--subtle)', border: '1px solid var(--border2)',
                borderRadius: '8px', padding: '16px', color: 'var(--text)', fontSize: '13px', resize: 'none',
                fontFamily: 'inherit', outline: 'none'
              }}
            />
          </div>
        )}

        {/* STEP 3: GOALS & LOCATIONS */}
        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                <Target size={16} color="var(--accent)" /> Target Locations
              </label>
              <input 
                value={locations}
                onChange={(e: any) => setLocations(e.target.value)}
                placeholder="e.g. Remote, Work from home, Wisconsin, WI"
                style={{
                  width: '100%', background: 'var(--subtle)', border: '1px solid var(--border2)',
                  borderRadius: '8px', padding: '12px 16px', color: 'var(--text)', fontSize: '13px',
                  fontFamily: 'inherit', outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                <Target size={16} color="var(--accent)" /> Target Roles & Goals
              </label>
              <textarea 
                value={goals}
                onChange={(e: any) => setGoals(e.target.value)}
                placeholder="e.g. 'I am looking for a Senior Product Manager role in B2B SaaS. I want fully remote, focusing on AI-driven products. Salary expectation is $160k+.'"
                style={{
                  width: '100%', height: '180px', background: 'var(--subtle)', border: '1px solid var(--border2)',
                  borderRadius: '8px', padding: '16px', color: 'var(--text)', fontSize: '13px', resize: 'none',
                  fontFamily: 'inherit', outline: 'none'
                }}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
          <button 
            onClick={() => { setError(''); setStep(s => s - 1); }}
            style={{
              padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
              background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              opacity: step === 1 ? 0 : 1, pointerEvents: step === 1 ? 'none' : 'auto',
              transition: 'all 0.2s'
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {step < 3 ? (
            <button 
              onClick={handleNext}
              style={{
                padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
                background: 'var(--text)', border: 'none', color: 'var(--surface)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
                background: 'var(--accent)', border: 'none', color: '#fff',
                cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.2s', opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? <Loader2 size={16} className="spin" /> : <CheckCircle2 size={16} />}
              {isSubmitting ? 'Initializing...' : 'Launch Dashboard'}
            </button>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}

function InputRow({ icon, label, placeholder, required = false, value, onChange }: any) {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)', marginBottom: '8px' }}>
        {icon} {label} {required && <span style={{ color: 'var(--red)' }}>*</span>}
      </label>
      <input 
        type="password"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
          padding: '12px 16px', borderRadius: '8px', color: 'var(--text)', fontSize: '13px',
          outline: 'none', transition: 'border-color 0.2s', fontFamily: 'monospace'
        }}
        onFocus={(e: any) => e.target.style.borderColor = 'var(--accent)'}
        onBlur={(e: any) => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}
