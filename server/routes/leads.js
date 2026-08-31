const express = require('express');
const { z } = require('zod');
const fs = require('fs').promises;
const path = require('path');
const supabase = require('../config/supabaseClient');
const {
  BadRequestError,
  NotFoundError,
  errorMessages
} = require('../errors');

const router = express.Router();
const leadsFilePath = path.join(__dirname, '..', 'data', 'leads.json');

// Helper to read local leads file safely
async function getLocalLeads() {
  try {
    const raw = await fs.readFile(leadsFilePath, 'utf8');
    return JSON.parse(raw) || [];
  } catch (e) {
    return [];
  }
}

// Helper to save local leads file safely
async function saveLocalLeads(leads) {
  try {
    await fs.writeFile(leadsFilePath, JSON.stringify(leads, null, 2), 'utf8');
  } catch (e) {
    console.warn('Error writing local leads.json:', e.message);
  }
}

// Dynamic Zod Schema for validation of POST requests
const createLeadSchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().trim().email({ message: "A valid 'email' address is required" }).optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.string().optional().default('New'),
  notes: z.string().optional(),
  formData: z.record(z.any()).optional()
}).passthrough();

// GET /api/leads - Fetch all leads (Supabase with Fail-safe Local File Fallback)
router.get('/', async (req, res, next) => {
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          return res.status(200).json({
            success: true,
            data
          });
        }
      } catch (sbErr) {
        console.warn('Supabase fetch leads notice:', sbErr.message);
      }
    }

    // Fallback to local leads.json
    const localData = await getLocalLeads();
    return res.status(200).json({
      success: true,
      data: localData
    });
  } catch (err) {
    return next(err);
  }
});

// GET /api/leads/:id - Fetch single lead by ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return res.status(200).json({
            success: true,
            data
          });
        }
      } catch (sbErr) {
        console.warn('Supabase fetch lead by ID notice:', sbErr.message);
      }
    }

    const localData = await getLocalLeads();
    const found = localData.find((l) => String(l.id) === String(id));
    if (!found) {
      throw new NotFoundError(errorMessages.LEAD_NOT_FOUND, `Lead with ID '${id}' not found`);
    }

    return res.status(200).json({
      success: true,
      data: found
    });
  } catch (err) {
    return next(err);
  }
});

// Set of known columns to prevent redundant RPC calls
const knownColumns = new Set([
  'id',
  'created_at',
  'name',
  'full_name',
  'email',
  'phone',
  'company',
  'status',
  'notes',
  'form_data'
]);

// Helper to sanitize any field key into a valid safe PostgreSQL column identifier
function sanitizeColumnName(rawKey) {
  return String(rawKey || '')
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1_$2') // camelCase to snake_case
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')         // replace non-alphanumeric with _
    .replace(/^_+|_+$/g, '')             // trim leading/trailing _
    .substring(0, 63);                  // PostgreSQL max identifier length is 63
}

// Ensure columns exist dynamically in Supabase leads table via RPC
async function ensureLeadColumnsExist(fieldKeys) {
  if (!supabase) return;
  for (const rawKey of fieldKeys) {
    const colName = sanitizeColumnName(rawKey);
    if (!colName || knownColumns.has(colName)) continue;

    try {
      const { error } = await supabase.rpc('add_lead_column', {
        column_name: colName,
        column_type: 'text'
      });

      if (!error) {
        knownColumns.add(colName);
        console.log(`✓ Supabase column '${colName}' ensured in leads table.`);
      } else {
        console.warn(`Notice ensuring column '${colName}':`, error.message);
      }
    } catch (e) {
      console.warn(`Dynamic column RPC error for '${colName}':`, e.message);
    }
  }
}

// POST /api/leads - Create a new lead supporting dynamic column creation & insertion
router.post('/', async (req, res, next) => {
  try {
    const parseResult = createLeadSchema.safeParse(req.body);

    if (!parseResult.success) {
      const validationMsgs = parseResult.error.errors.map((e) => e.message).join(', ');
      throw new BadRequestError(errorMessages.VALIDATION_ERROR, `Validation Error: ${validationMsgs}`);
    }

    const bodyData = parseResult.data || {};
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const createdAt = new Date().toISOString();

    // Standard Lead Properties
    const name = bodyData.name || bodyData.fullName || 'Anonymous Inquiry';
    const email = bodyData.email || bodyData.workEmail || 'not-provided@inquiry.com';
    const phone = bodyData.phone || bodyData.phoneNumber || '';
    const company = bodyData.company || bodyData.organization || '';
    const status = bodyData.status || 'New';
    
    // Extract dynamic fields (both from root payload and formData if passed)
    const dynamicFields = { ...(bodyData.formData || {}), ...bodyData };
    delete dynamicFields.id;
    delete dynamicFields.created_at;
    delete dynamicFields.formData;

    // Collect all field keys that should be real columns in PostgreSQL
    const allFieldKeys = Object.keys(dynamicFields);

    // 1. Automatically ensure columns exist in Supabase at runtime
    await ensureLeadColumnsExist(allFieldKeys);

    // Build comprehensive notes if extra dynamic fields exist
    let notes = bodyData.notes || bodyData.message || '';
    const extraFieldKeys = Object.keys(dynamicFields).filter(
      k => !['name', 'fullName', 'email', 'workEmail', 'phone', 'phoneNumber', 'company', 'organization', 'status', 'notes', 'message'].includes(k)
    );

    if (extraFieldKeys.length > 0) {
      const formattedExtras = extraFieldKeys
        .map(k => `• ${k.charAt(0).toUpperCase() + k.slice(1)}: ${dynamicFields[k]}`)
        .join('\n');
      notes = notes ? `${notes}\n\n[Custom Form Fields]:\n${formattedExtras}` : `[Custom Form Fields]:\n${formattedExtras}`;
    }

    const fullLeadRecord = {
      id: leadId,
      name,
      email,
      phone,
      company,
      status,
      notes,
      ...dynamicFields,
      formData: dynamicFields,
      created_at: createdAt
    };

    // ── Tier 1: Supabase Direct DB Insertion with Real Dynamic Columns ──
    if (supabase) {
      try {
        // Construct dynamic insert payload mapping every field to its sanitized SQL column
        const insertPayload = {
          name,
          email,
          phone,
          company,
          status,
          notes,
          form_data: dynamicFields // keeps backward compatibility for jsonb
        };

        // Add each dynamic field as a direct column property
        for (const [k, v] of Object.entries(dynamicFields)) {
          const colName = sanitizeColumnName(k);
          if (colName && !insertPayload[colName]) {
            insertPayload[colName] = typeof v === 'object' ? JSON.stringify(v) : String(v ?? '');
          }
        }

        const { data, error } = await supabase
          .from('leads')
          .insert([insertPayload])
          .select();

        if (!error && data && data.length > 0) {
          return res.status(201).json({
            success: true,
            data: { ...data[0], formData: data[0].form_data || fullLeadRecord.formData }
          });
        } else if (error) {
          console.warn('Supabase dynamic insert notice (falling back to standard payload):', error.message);
          
          // Fallback insert without dynamic column keys in case columns were not created yet
          const standardPayload = {
            name,
            email,
            phone,
            company,
            status,
            notes,
            form_data: dynamicFields
          };
          const fallbackRes = await supabase.from('leads').insert([standardPayload]).select();
          if (!fallbackRes.error && fallbackRes.data && fallbackRes.data.length > 0) {
            return res.status(201).json({
              success: true,
              data: { ...fallbackRes.data[0], formData: fallbackRes.data[0].form_data || fullLeadRecord.formData }
            });
          }
        }
      } catch (sbErr) {
        console.warn('Supabase insert lead call notice:', sbErr.message);
      }
    }

    // ── Tier 2: Local JSON Storage Fallback ──
    const localData = await getLocalLeads();
    localData.unshift(fullLeadRecord);
    await saveLocalLeads(localData);

    return res.status(201).json({
      success: true,
      data: fullLeadRecord
    });
  } catch (err) {
    return next(err);
  }
});

// DELETE /api/leads/:id - Delete lead by ID
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .delete()
          .eq('id', id)
          .select();

        if (!error && data && data.length > 0) {
          return res.status(200).json({
            success: true,
            data: data[0]
          });
        }
      } catch (sbErr) {
        console.warn('Supabase delete lead notice:', sbErr.message);
      }
    }

    const localData = await getLocalLeads();
    const nextData = localData.filter((l) => String(l.id) !== String(id));
    await saveLocalLeads(nextData);

    return res.status(200).json({
      success: true,
      data: { id }
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
