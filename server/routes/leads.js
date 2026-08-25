const express = require('express');
const { z } = require('zod');
const fs = require('fs').promises;
const path = require('path');
const supabase = require('../config/supabaseClient');

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

// Zod Schema for validation of POST requests
const createLeadSchema = z.object({
  name: z.string().trim().min(1, { message: "'name' is required and cannot be empty" }),
  email: z.string().trim().email({ message: "A valid 'email' address is required" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional()
});

// GET /api/leads - Fetch all leads (Supabase with Fail-safe Local File Fallback)
router.get('/', async (req, res) => {
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
    return res.status(200).json({
      success: true,
      data: []
    });
  }
});

// GET /api/leads/:id - Fetch single lead by ID
router.get('/:id', async (req, res) => {
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
      return res.status(404).json({
        success: false,
        error: `Lead with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: found
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST /api/leads - Create a new lead with Zod validation
router.post('/', async (req, res) => {
  try {
    const parseResult = createLeadSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errorMessages = parseResult.error.errors.map((e) => e.message).join(', ');
      return res.status(400).json({
        success: false,
        error: `Validation Error: ${errorMessages}`
      });
    }

    const validPayload = {
      ...parseResult.data,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .insert([validPayload])
          .select();

        if (!error && data) {
          return res.status(201).json({
            success: true,
            data: data[0]
          });
        }
      } catch (sbErr) {
        console.warn('Supabase insert lead notice:', sbErr.message);
      }
    }

    // Local file fallback
    const localData = await getLocalLeads();
    localData.unshift(validPayload);
    await saveLocalLeads(localData);

    return res.status(201).json({
      success: true,
      data: validPayload
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// DELETE /api/leads/:id - Delete lead by ID
router.delete('/:id', async (req, res) => {
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
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
