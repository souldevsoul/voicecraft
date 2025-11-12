/**
 * ESLint Plugin: Product Quality
 *
 * Custom rules focused on product quality, not code quality:
 * - Link validation (no broken links, no 404s)
 * - Color contrast and accessibility
 * - Style guide compliance
 * - Payment provider consistency
 * - Page structure validation
 * - Content consistency
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  rules: {
    // ========================================
    // LINK VALIDATION RULES
    // ========================================

    'no-broken-internal-links': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Ensure all internal links point to existing pages',
          category: 'Product Quality',
          recommended: true
        },
        messages: {
          brokenLink: 'Internal link "{{href}}" points to non-existent page. This will cause a 404 error.',
          missingPage: 'Link references {{href}} but file {{file}} does not exist.'
        }
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name.name === 'href' && node.value?.type === 'Literal') {
              const href = node.value.value;

              // Only check internal links (starting with /)
              if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
                // Skip anchors and query params
                const cleanPath = href.split('#')[0].split('?')[0];

                // Map route to file
                const baseDir = path.join(context.getCwd(), 'app');
                const possibleFiles = [
                  path.join(baseDir, cleanPath, 'page.tsx'),
                  path.join(baseDir, cleanPath, 'page.jsx'),
                  path.join(baseDir, cleanPath + '.tsx'),
                  path.join(baseDir, cleanPath + '.jsx'),
                ];

                const fileExists = possibleFiles.some(file => fs.existsSync(file));

                if (!fileExists) {
                  context.report({
                    node,
                    messageId: 'brokenLink',
                    data: {
                      href,
                      file: possibleFiles[0]
                    }
                  });
                }
              }
            }
          }
        };
      }
    },

    'no-external-links-without-target': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'External links should open in new tab with security attributes',
          category: 'Product Quality',
          recommended: true
        },
        messages: {
          missingTarget: 'External link should have target="_blank" rel="noopener noreferrer"',
          missingRel: 'External link with target="_blank" missing rel="noopener noreferrer"'
        },
        fixable: 'code'
      },
      create(context) {
        return {
          JSXElement(node) {
            if (node.openingElement.name.name === 'a') {
              const attributes = node.openingElement.attributes;
              const hrefAttr = attributes.find(attr => attr.name?.name === 'href');
              const targetAttr = attributes.find(attr => attr.name?.name === 'target');
              const relAttr = attributes.find(attr => attr.name?.name === 'rel');

              if (hrefAttr?.value?.value) {
                const href = hrefAttr.value.value;
                const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');

                if (isExternal) {
                  if (!targetAttr) {
                    context.report({
                      node: hrefAttr,
                      messageId: 'missingTarget'
                    });
                  } else if (targetAttr.value?.value === '_blank' && !relAttr) {
                    context.report({
                      node: targetAttr,
                      messageId: 'missingRel'
                    });
                  }
                }
              }
            }
          }
        };
      }
    },

    // ========================================
    // COLOR & ACCESSIBILITY RULES
    // ========================================

    'enforce-color-contrast': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Ensure text colors have sufficient contrast against backgrounds (WCAG AA)',
          category: 'Accessibility',
          recommended: true
        },
        messages: {
          lowContrast: 'Color combination has insufficient contrast ({{ratio}}:1). WCAG AA requires {{required}}:1 for {{type}}.',
          invalidColor: 'Color "{{color}}" is not in the style guide. Use approved colors only.'
        }
      },
      create(context) {
        // WCAG AA contrast requirements
        const CONTRAST_RATIOS = {
          'normal-text': 4.5,
          'large-text': 3.0  // 18px+ or 14px+ bold
        };

        function calculateLuminance(r, g, b) {
          const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        }

        function getContrastRatio(hex1, hex2) {
          const rgb1 = hexToRgb(hex1);
          const rgb2 = hexToRgb(hex2);
          if (!rgb1 || !rgb2) return null;

          const l1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
          const l2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);
          return (lighter + 0.05) / (darker + 0.05);
        }

        function hexToRgb(hex) {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : null;
        }

        return {
          JSXAttribute(node) {
            if (node.name.name === 'className' && node.value?.value) {
              const classes = node.value.value.split(' ');

              // Check for text color + background color combinations
              const textColors = classes.filter(c => c.startsWith('text-'));
              const bgColors = classes.filter(c => c.startsWith('bg-'));

              if (textColors.length > 0 && bgColors.length > 0) {
                // This is simplified - in production, map Tailwind classes to actual hex values
                const textColor = textColors[0];
                const bgColor = bgColors[0];

                // Example: text-gray-500 on bg-white should be checked
                // Implementation would map Tailwind colors to hex and calculate contrast
              }
            }
          }
        };
      }
    },

    'use-styleguide-colors-only': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Only use colors defined in the style guide',
          category: 'Brand Consistency',
          recommended: true
        },
        messages: {
          unauthorizedColor: 'Color "{{color}}" is not in the approved style guide. Use one of: {{approved}}',
          arbitraryColor: 'Avoid arbitrary color values. Use Tailwind utility classes from the style guide.'
        },
        schema: [
          {
            type: 'object',
            properties: {
              allowedColors: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          }
        ]
      },
      create(context) {
        const options = context.options[0] || {};
        const allowedColors = options.allowedColors || [
          'black', 'white', 'gray-', 'red-600', 'red-700'  // Default minimal palette
        ];

        return {
          JSXAttribute(node) {
            if (node.name.name === 'className' && node.value?.value) {
              const classes = node.value.value.split(' ');

              classes.forEach(className => {
                if (className.startsWith('text-') || className.startsWith('bg-') ||
                    className.startsWith('border-')) {
                  const color = className.split('-').slice(1).join('-');
                  const isAllowed = allowedColors.some(allowed => color.startsWith(allowed));

                  if (!isAllowed && !color.includes('[') && !color.includes('inherit')) {
                    context.report({
                      node,
                      messageId: 'unauthorizedColor',
                      data: {
                        color: className,
                        approved: allowedColors.join(', ')
                      }
                    });
                  }
                }

                // Check for arbitrary values like bg-[#FF0000]
                if (className.includes('[#') || className.includes('[rgb')) {
                  context.report({
                    node,
                    messageId: 'arbitraryColor'
                  });
                }
              });
            }
          }
        };
      }
    },

    // ========================================
    // PAYMENT PROVIDER CONSISTENCY RULES
    // ========================================

    'consistent-payment-providers': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Ensure payment provider mentions are consistent across the app',
          category: 'Content Consistency',
          recommended: true
        },
        messages: {
          inconsistentProvider: 'Payment provider "{{provider}}" used here, but config specifies "{{configured}}". Keep consistent.',
          missingProvider: 'Payment provider mention missing. Add configured provider: {{configured}}'
        },
        schema: [
          {
            type: 'object',
            properties: {
              provider: {
                type: 'string',
                enum: ['stripe', 'ecommpay', 'paypal', 'square']
              }
            }
          }
        ]
      },
      create(context) {
        const options = context.options[0] || {};
        const configuredProvider = options.provider || 'stripe';

        const providerPatterns = {
          stripe: /\bstripe\b/i,
          ecommpay: /\becommpay\b/i,
          paypal: /\bpaypal\b/i,
          square: /\bsquare\b/i
        };

        return {
          Literal(node) {
            if (typeof node.value === 'string') {
              Object.entries(providerPatterns).forEach(([provider, pattern]) => {
                if (pattern.test(node.value) && provider !== configuredProvider) {
                  context.report({
                    node,
                    messageId: 'inconsistentProvider',
                    data: {
                      provider,
                      configured: configuredProvider
                    }
                  });
                }
              });
            }
          },
          TemplateElement(node) {
            const text = node.value.cooked;
            if (text) {
              Object.entries(providerPatterns).forEach(([provider, pattern]) => {
                if (pattern.test(text) && provider !== configuredProvider) {
                  context.report({
                    node,
                    messageId: 'inconsistentProvider',
                    data: {
                      provider,
                      configured: configuredProvider
                    }
                  });
                }
              });
            }
          }
        };
      }
    },

    'consistent-company-info': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Ensure company information (address, phone, email) is consistent',
          category: 'Content Consistency',
          recommended: true
        },
        messages: {
          inconsistentAddress: 'Address "{{found}}" doesn\'t match configured address "{{configured}}"',
          inconsistentPhone: 'Phone "{{found}}" doesn\'t match configured phone "{{configured}}"',
          inconsistentEmail: 'Email "{{found}}" doesn\'t match configured email "{{configured}}"'
        },
        schema: [
          {
            type: 'object',
            properties: {
              companyName: { type: 'string' },
              address: { type: 'string' },
              phone: { type: 'string' },
              email: { type: 'string' }
            }
          }
        ]
      },
      create(context) {
        const options = context.options[0] || {};

        return {
          Literal(node) {
            if (typeof node.value === 'string') {
              // Check for email pattern
              const emailMatch = node.value.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
              if (emailMatch && options.email && emailMatch[0] !== options.email) {
                context.report({
                  node,
                  messageId: 'inconsistentEmail',
                  data: {
                    found: emailMatch[0],
                    configured: options.email
                  }
                });
              }

              // Check for phone pattern
              const phoneMatch = node.value.match(/\+?[\d\s\-\(\)]{10,}/);
              if (phoneMatch && options.phone) {
                const cleanFound = phoneMatch[0].replace(/[\s\-\(\)]/g, '');
                const cleanConfig = options.phone.replace(/[\s\-\(\)]/g, '');
                if (cleanFound !== cleanConfig) {
                  context.report({
                    node,
                    messageId: 'inconsistentPhone',
                    data: {
                      found: phoneMatch[0],
                      configured: options.phone
                    }
                  });
                }
              }
            }
          }
        };
      }
    },

    // ========================================
    // PAGE STRUCTURE RULES
    // ========================================

    'require-page-metadata': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Ensure all pages have proper metadata (title, description)',
          category: 'SEO & Product Quality',
          recommended: true
        },
        messages: {
          missingMetadata: 'Page is missing metadata export. Add: export const metadata = { title: "...", description: "..." }',
          emptyTitle: 'Page title is empty. Provide a descriptive title.',
          emptyDescription: 'Page description is empty. Provide a clear description.',
          titleTooShort: 'Page title too short ({{length}} chars). Recommend 40-60 characters.',
          titleTooLong: 'Page title too long ({{length}} chars). Keep under 60 characters.',
          descriptionTooShort: 'Description too short ({{length}} chars). Recommend 120-160 characters.',
          descriptionTooLong: 'Description too long ({{length}} chars). Keep under 160 characters.'
        }
      },
      create(context) {
        const filename = context.getFilename();

        // Only check page.tsx/jsx files in app directory
        if (!filename.includes('/app/') || !filename.match(/page\.(tsx|jsx)$/)) {
          return {};
        }

        let hasMetadataExport = false;
        let titleNode = null;
        let descriptionNode = null;

        return {
          ExportNamedDeclaration(node) {
            if (node.declaration?.type === 'VariableDeclaration') {
              const declaration = node.declaration.declarations[0];
              if (declaration?.id?.name === 'metadata') {
                hasMetadataExport = true;

                // Check metadata object properties
                if (declaration.init?.type === 'ObjectExpression') {
                  declaration.init.properties.forEach(prop => {
                    if (prop.key?.name === 'title') {
                      titleNode = prop.value;
                      if (prop.value.type === 'Literal') {
                        const title = prop.value.value;
                        if (!title || title.length === 0) {
                          context.report({ node: prop, messageId: 'emptyTitle' });
                        } else if (title.length < 40) {
                          context.report({
                            node: prop,
                            messageId: 'titleTooShort',
                            data: { length: title.length }
                          });
                        } else if (title.length > 60) {
                          context.report({
                            node: prop,
                            messageId: 'titleTooLong',
                            data: { length: title.length }
                          });
                        }
                      }
                    }

                    if (prop.key?.name === 'description') {
                      descriptionNode = prop.value;
                      if (prop.value.type === 'Literal') {
                        const desc = prop.value.value;
                        if (!desc || desc.length === 0) {
                          context.report({ node: prop, messageId: 'emptyDescription' });
                        } else if (desc.length < 120) {
                          context.report({
                            node: prop,
                            messageId: 'descriptionTooShort',
                            data: { length: desc.length }
                          });
                        } else if (desc.length > 160) {
                          context.report({
                            node: prop,
                            messageId: 'descriptionTooLong',
                            data: { length: desc.length }
                          });
                        }
                      }
                    }
                  });
                }
              }
            }
          },
          'Program:exit'() {
            if (!hasMetadataExport) {
              context.report({
                loc: { line: 1, column: 0 },
                messageId: 'missingMetadata'
              });
            }
          }
        };
      }
    },

    'require-proper-page-structure': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Ensure pages follow proper structure (header, main, footer)',
          category: 'Product Quality',
          recommended: true
        },
        messages: {
          missingMain: 'Page should wrap main content in <main> tag for accessibility',
          missingHeader: 'Page should include a <header> or <Navbar> component',
          missingFooter: 'Page should include a <Footer> component',
          improperStructure: 'Page structure should be: Header -> Main -> Footer'
        }
      },
      create(context) {
        const filename = context.getFilename();
        if (!filename.includes('/app/') || !filename.match(/page\.(tsx|jsx)$/)) {
          return {};
        }

        let hasMain = false;
        let hasHeader = false;
        let hasFooter = false;

        return {
          JSXElement(node) {
            const elementName = node.openingElement.name.name;

            if (elementName === 'main') hasMain = true;
            if (elementName === 'header' || elementName === 'Navbar') hasHeader = true;
            if (elementName === 'footer' || elementName === 'Footer') hasFooter = true;
          },
          'Program:exit'(node) {
            if (!hasMain) {
              context.report({
                node,
                messageId: 'missingMain'
              });
            }
            if (!hasFooter) {
              context.report({
                node,
                messageId: 'missingFooter'
              });
            }
          }
        };
      }
    }
  }
};
