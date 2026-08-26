import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

/**
 * Contact form.
 *
 * The backend is the same PHP handler the previous site used, deployed
 * alongside the static build. That fixes the wire format: field names,
 * the `website` honeypot, the `form_ts` timing stamp and the
 * `X-Requested-With: fetch` header that switches the handler from a 303
 * redirect to a JSON response. None of these may be renamed.
 *
 * It is also a real <form> with a real action, so it still works with
 * JavaScript disabled — the handler redirects back with ?contact=sent.
 */

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;
type Status = { kind: 'idle' | 'sending' | 'sent' | 'error'; message?: string };

interface Props {
  /** Recorded against the enquiry so we know which page it came from. */
  source: string;
  /** Where the no-JS redirect returns to. Must be a local path. */
  returnPath: string;
  action?: string;
  email: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm({ source, returnPath, action = '/contact.php', email }: Props) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const tsRef = useRef<HTMLInputElement>(null);

  // Stamped client-side, as the handler expects. Set after mount so a cached
  // page does not submit a stale timestamp.
  useEffect(() => {
    if (tsRef.current) tsRef.current.value = String(Math.floor(Date.now() / 1000));
  }, []);

  // Surface the result of a no-JS submission (handler redirects with a flag).
  useEffect(() => {
    const flag = new URLSearchParams(window.location.search).get('contact');
    if (flag === 'sent') {
      setStatus({ kind: 'sent', message: `Thanks — we'll reply within one business day.` });
    } else if (flag === 'error') {
      setStatus({ kind: 'error', message: `We couldn't send your message. Please email ${email}.` });
    }
  }, [email]);

  const validate = (fd: FormData): FieldErrors => {
    const next: FieldErrors = {};
    const name = String(fd.get('name') ?? '').trim();
    const mail = String(fd.get('email') ?? '').trim();
    const message = String(fd.get('message') ?? '').trim();

    if (!name) next.name = 'Please tell us your name.';
    if (!mail) next.email = 'We need an email address to reply to.';
    else if (!EMAIL.test(mail)) next.email = "That address doesn't look right.";
    if (!message) next.message = 'Let us know how we can help.';

    return next;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);

    const found = validate(fd);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus({ kind: 'idle' });
      return;
    }

    setStatus({ kind: 'sending' });

    try {
      const res = await fetch(action, {
        method: 'POST',
        body: fd,
        headers: { 'X-Requested-With': 'fetch' },
      });

      // The handler may emit PHP warnings before the JSON when display_errors
      // is on, so recover the JSON object rather than trusting res.json().
      const raw = await res.text();
      const start = raw.indexOf('{');
      const parsed = start === -1 ? null : JSON.parse(raw.slice(start));

      if (parsed?.ok) {
        form.reset();
        if (tsRef.current) tsRef.current.value = String(Math.floor(Date.now() / 1000));
        setStatus({ kind: 'sent', message: `Thanks — we'll reply within one business day.` });
      } else {
        setStatus({
          kind: 'error',
          message: parsed?.error || `Something went wrong. Please email ${email}.`,
        });
      }
    } catch {
      setStatus({ kind: 'error', message: `We couldn't reach the server. Please email ${email}.` });
    }
  };

  const busy = status.kind === 'sending';

  return (
    <form ref={formRef} action={action} method="post" onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Handler contract — do not rename */}
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="return" value={returnPath} />
      <input ref={tsRef} type="hidden" name="form_ts" defaultValue="" />

      {/* Honeypot: hidden from people, irresistible to bots */}
      <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <Input id="name" name="name" autoComplete="name" maxLength={100} required aria-invalid={!!errors.name} />
        </Field>

        <Field id="email" label="Work email" error={errors.email}>
          <Input id="email" name="email" type="email" autoComplete="email" maxLength={150} required aria-invalid={!!errors.email} />
        </Field>
      </div>

      <Field id="company" label="Company" hint="optional">
        <Input id="company" name="company" autoComplete="organization" maxLength={150} />
      </Field>

      <Field id="message" label="How can we help?" error={errors.message}>
        <Textarea id="message" name="message" rows={5} maxLength={5000} required aria-invalid={!!errors.message} />
      </Field>

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
        <Button type="submit" disabled={busy} size="lg" className="group relative overflow-hidden">
          <span className="relative z-10">{busy ? 'Sending…' : 'Send message'}</span>
        </Button>

        <p
          role="status"
          aria-live="polite"
          className={[
            'text-sm transition-opacity duration-300',
            status.kind === 'sent' ? 'text-accent' : '',
            status.kind === 'error' ? 'text-destructive' : '',
            status.kind === 'idle' ? 'text-quiet' : '',
          ].join(' ')}
        >
          {status.message}
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-baseline gap-2 text-xs font-normal tracking-wide text-quiet uppercase">
        <span className="font-mono">{label}</span>
        {hint && <span className="text-[0.6875rem] normal-case tracking-normal text-faint">{hint}</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
