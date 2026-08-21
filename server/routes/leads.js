const express = require('express');
const { z } = require('zod');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// Zod Schema for validation of POST requests
const createLeadSchema = z.object({
  name: z.string().trim().min(1, { message: "'name' is required and cannot be empty" }),
  email: z.string().trim().email({ message: "A valid 'email' address is required" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional()
});

// GET /api/leads - Fetch all leads
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      data: data || []
    });
  } catch (err) {
    return next(err);
  }
});

// GET /api/leads/:id - Fetch single lead by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: `Lead with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    return next(err);
  }
});

// POST /api/leads - Create a new lead with Zod validation
router.post('/', async (req, res, next) => {
  try {
    // Validate request payload using Zod
    const parseResult = createLeadSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errorMessages = parseResult.error.errors.map(e => e.message).join(', ');
      return res.status(400).json({
        success: false,
        error: `Validation Error: ${errorMessages}`
      });
    }

    const validPayload = parseResult.data;

    // Insert payload into Supabase 'leads' table
    const { data, error } = await supabase
      .from('leads')
      .insert([validPayload])
      .select();

    if (error) {
      throw error;
    }

    return res.status(201).json({
      success: true,
      data: data ? data[0] : validPayload
    });
  } catch (err) {
    return next(err);
  }
});

// DELETE /api/leads/:id - Delete lead by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Lead with ID '${id}' not found or already deleted`
      });
    }

    return res.status(200).json({
      success: true,
      data: data[0]
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
