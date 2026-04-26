import { z } from 'zod'
import { assertUsState, isValidUsZip } from '@/lib/validation/location'

const requiredText = (label: string) => z.string().trim().min(1, `${label} is required`)

export const listingSchema = z.object({
  listingType: z.enum(['farm', 'program']),
  title: requiredText('Title'),
  description: requiredText('Description'),
  countyFips: z.string().trim().optional().nullable(),
  address: requiredText('Address'),
  city: requiredText('City'),
  state: requiredText('State').refine(assertUsState, 'State must be a valid US state code'),
  zipCode: requiredText('ZIP').refine(isValidUsZip, 'ZIP must be a valid US ZIP'),
  contactName: requiredText('Contact name'),
  contactEmail: z.string().trim().email('Contact email must be valid'),
  contactPhone: z.string().trim().optional().nullable(),
  volunteerDate: z.string().trim().min(1, 'Volunteer date is required'),
  startTime: z.string().trim().min(1, 'Start time is required'),
  endTime: z.string().trim().min(1, 'End time is required'),
  requiredVolunteers: z.coerce.number().int().positive().max(500),
  programId: z.string().uuid().optional().nullable(),
})

export const signupSchema = z.object({
  listingId: z.string().uuid(),
  volunteerName: requiredText('Name'),
  volunteerEmail: z.string().trim().email('Email must be valid'),
  volunteerPhone: z.string().trim().optional().nullable(),
  volunteerDate: z.string().trim().min(1, 'Date is required'),
  startTime: z.string().trim().min(1, 'Start time is required'),
  endTime: z.string().trim().min(1, 'End time is required'),
  declaredHours: z.coerce.number().positive().max(24),
})

export const resourceSubmissionSchema = z.object({
  programName: requiredText('Program name'),
  providerName: z.string().trim().optional().nullable(),
  category: z.string().trim().optional().nullable(),
  description: requiredText('Description'),
  countyFips: z.string().trim().optional().nullable(),
  address: requiredText('Address'),
  city: requiredText('City'),
  state: requiredText('State').refine(assertUsState, 'State must be a valid US state code'),
  zipCode: requiredText('ZIP').refine(isValidUsZip, 'ZIP must be a valid US ZIP'),
  contactName: requiredText('Contact name'),
  contactEmail: z.string().trim().email('Contact email must be valid'),
  contactPhone: z.string().trim().optional().nullable(),
  websiteUrl: z.string().trim().url('Website must be a valid URL').optional().nullable(),
})

export const approvalSchema = z.object({
  signupId: z.string().uuid(),
  decision: z.enum(['approved', 'rejected']),
  approvedHours: z.coerce.number().nonnegative().max(24).optional(),
  reviewNotes: z.string().trim().optional().nullable(),
})
