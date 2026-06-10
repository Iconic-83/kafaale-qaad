-- Add donation_refunded to AdminAction enum
ALTER TYPE "AdminAction" ADD VALUE IF NOT EXISTS 'donation_refunded';
