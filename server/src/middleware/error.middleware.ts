
import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  next,
) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error('API Error:', {
    name: error instanceof Error ? error.name : 'Unknown',
    message: error instanceof Error ? error.message : error,
    code:
      typeof error === 'object' && error !== null && 'code' in error
        ? error.code
        : undefined,
  });

  const errorCode =
    typeof error === 'object' && error !== null && 'code' in error
      ? error.code
      : undefined;

  if (errorCode === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'A record with this information already exists.',
    });
  }

  if (errorCode === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'The requested record was not found.',
    });
  }

  if (errorCode === 'P2003') {
    return res.status(409).json({
      success: false,
      message: 'This operation conflicts with related records.',
    });
  }

  if (errorCode === 'P2034') {
    return res.status(409).json({
      success: false,
      message: 'The transaction conflicted with another operation. Please try again.',
    });
  }

  if (
    errorCode === 'P1001' ||
    errorCode === 'P1002' ||
    errorCode === 'P1008' ||
    errorCode === 'P1017' ||
    errorCode === 'P2024'
  ) {
    return res.status(503).json({
      success: false,
      message: 'The database is temporarily unavailable. Please try again shortly.',
    });
  }

  if (
    error instanceof Error &&
    error.message.startsWith('PRODUCT_NOT_FOUND:')
  ) {
    return res.status(404).json({
      success: false,
      message: 'One or more products could not be found.',
    });
  }

  if (
    error instanceof Error &&
    error.message.startsWith('PRODUCT_NOT_ACTIVE:')
  ) {
    return res.status(409).json({
      success: false,
      message: 'One or more products are not available for purchase.',
    });
  }

  if (
    error instanceof Error &&
    error.message.startsWith('INSUFFICIENT_STOCK:')
  ) {
    return res.status(409).json({
      success: false,
      message: 'Insufficient stock for one or more products.',
    });
  }

  if (
    error instanceof Error &&
    error.message.startsWith('ORDER_STATUS_TRANSITION_NOT_ALLOWED:')
  ) {
    return res.status(409).json({
      success: false,
      message: 'This order status transition is not allowed.',
    });
  }

  if (
    error instanceof Error &&
    error.message === 'ORDER_STATUS_CONFLICT'
  ) {
    return res.status(409).json({
      success: false,
      message: 'The order was updated by another request. Please refresh and try again.',
    });
  }

  return res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.',
  });
};
