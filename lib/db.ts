import 'server-only';
import type { Lead, Message, StatusKey } from './types';
import { supabaseAdmin } from './supabase';

const now = () => new Date().toISOString();

function dbError(operation: string, error: unknown): never {
  const detail = error instanceof Error ? error.message : JSON.stringify(error);
  throw new Error(`[db] ${operation} failed: ${detail}`);
}

// ---------- Чтение ----------

export async function listLeads(): Promise<Lead[]> {
  const supabase = supabaseAdmin();
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) dbError('list leads', error);
  if (!leads?.length) return [];

  const ids = leads.map((lead) => lead.id);
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('lead_id,text,id')
    .in('lead_id', ids)
    .eq('sender', 'client')
    .order('id', { ascending: false });

  if (messagesError) dbError('load lead previews', messagesError);

  const previews = new Map<number, string>();
  for (const message of messages ?? []) {
    if (!previews.has(Number(message.lead_id))) {
      previews.set(Number(message.lead_id), message.text);
    }
  }

  return leads.map((lead) => ({
    ...lead,
    id: Number(lead.id),
    preview: previews.get(Number(lead.id)),
  })) as Lead[];
}

export async function getLead(id: number): Promise<(Lead & { messages: Message[] }) | null> {
  const supabase = supabaseAdmin();
  const { data: lead, error } = await supabase.from('leads').select('*').eq('id', id).maybeSingle();

  if (error) dbError('get lead', error);
  if (!lead) return null;

  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .eq('lead_id', id)
    .order('id', { ascending: true });

  if (messagesError) dbError('get lead messages', messagesError);

  return {
    ...lead,
    id: Number(lead.id),
    messages: (messages ?? []).map((message) => ({
      ...message,
      id: Number(message.id),
      lead_id: Number(message.lead_id),
    })),
  } as Lead & { messages: Message[] };
}

// ---------- Запись ----------

export type NewLead = Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>> & {
  firstMessage?: string;
};

export async function createLead(input: NewLead): Promise<number> {
  const t = now();
  const { data, error } = await supabaseAdmin()
    .from('leads')
    .insert({
      name: input.name ?? '',
      tg_username: input.tg_username ?? '',
      phone: input.phone ?? '',
      email: input.email ?? '',
      address: input.address ?? '',
      kind: input.kind ?? 'request',
      source: input.source ?? 'site_order',
      request_type: input.request_type ?? '',
      product: input.product ?? '',
      status: input.status ?? 'new',
      notes: input.notes ?? '',
      unread: input.firstMessage ? 1 : 0,
      created_at: t,
      updated_at: t,
    })
    .select('id')
    .single();

  if (error) dbError('create lead', error);
  const id = Number(data.id);
  if (input.firstMessage) await addMessage(id, 'client', input.firstMessage, false);
  return id;
}

const EDITABLE = [
  'name',
  'tg_username',
  'phone',
  'email',
  'address',
  'status',
  'notes',
  'unread',
  'request_type',
] as const;

export async function updateLead(
  id: number,
  patch: Partial<Record<(typeof EDITABLE)[number], string | number>>,
) {
  const changes = Object.fromEntries(
    EDITABLE.filter((key) => key in patch).map((key) => [key, patch[key]]),
  ) as Record<string, string | number>;

  if (!Object.keys(changes).length) return;

  const { error } = await supabaseAdmin()
    .from('leads')
    .update({ ...changes, updated_at: now() })
    .eq('id', id);

  if (error) dbError('update lead', error);
}

export async function addMessage(
  leadId: number,
  sender: Message['sender'],
  text: string,
  touch = true,
) {
  const t = now();
  const supabase = supabaseAdmin();
  const { error } = await supabase.from('messages').insert({
    lead_id: leadId,
    sender,
    text,
    created_at: t,
  });

  if (error) dbError('add message', error);
  if (!touch) return;

  const changes: { updated_at: string; unread?: number } = { updated_at: t };
  if (sender === 'client') changes.unread = 1;
  const { error: updateError } = await supabase.from('leads').update(changes).eq('id', leadId);
  if (updateError) dbError('touch lead after message', updateError);
}

export async function deleteLead(id: number) {
  const { error } = await supabaseAdmin().from('leads').delete().eq('id', id);
  if (error) dbError('delete lead', error);
}

export function isStatus(s: unknown): s is StatusKey {
  return (
    typeof s === 'string' &&
    ['lead', 'new', 'in_progress', 'link_sent', 'paid', 'closed'].includes(s)
  );
}
