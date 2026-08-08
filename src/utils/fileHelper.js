const fs = require('fs');
const path = require('path');
const { logger } = require('./logger');

const DEFAULT_OUTPUT_DIR = path.resolve(process.cwd(), 'output');

function writeBookDetails(book, options = {}) {
  const outputDir = options.outputDir || DEFAULT_OUTPUT_DIR;
  const fileName = options.fileName || 'book-details.txt';
  const filePath = path.join(outputDir, fileName);

  if (!book?.title || !book?.author || !book?.publisher) {
    throw new Error(
      `Cannot write book details — need title, author, and publisher. Received: ${JSON.stringify(book)}`,
    );
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const content = [
    'Book Store Search Result',
    '========================',
    `Title    : ${book.title}`,
    `Author   : ${book.author}`,
    `Publisher: ${book.publisher}`,
    '',
    `Generated at: ${new Date().toISOString()}`,
    '',
  ].join('\n');

  fs.writeFileSync(filePath, content, 'utf8');
  logger.info(`Wrote book details to ${filePath}`);
  return filePath;
}

module.exports = { writeBookDetails, DEFAULT_OUTPUT_DIR };
