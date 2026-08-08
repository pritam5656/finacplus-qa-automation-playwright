function timestamp() {
  return new Date().toISOString();
}

function format(value) {
  try {
    return typeof value === 'string' ? value : JSON.stringify(value);
  } catch {
    return String(value);
  }
}

const logger = {
  info(message, meta) {
    const extra = meta !== undefined ? ` ${format(meta)}` : '';
    console.log(`[INFO] ${timestamp()} ${message}${extra}`);
  },
  warn(message, meta) {
    const extra = meta !== undefined ? ` ${format(meta)}` : '';
    console.warn(`[WARN] ${timestamp()} ${message}${extra}`);
  },
  error(message, meta) {
    const extra = meta !== undefined ? ` ${format(meta)}` : '';
    console.error(`[ERROR] ${timestamp()} ${message}${extra}`);
  },
};

module.exports = { logger };
