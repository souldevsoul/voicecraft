/**
 * ESLint Plugin: Product Quality - FIXED VERSION
 * Only checks actual color values, not utility classes
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');
/* eslint-enable @typescript-eslint/no-require-imports */

// List of Tailwind utility prefixes that are NOT colors
const NON_COLOR_UTILITIES = [
  'text-xs',
  'text-sm',
  'text-base',
  'text-lg',
  'text-xl',
  'text-2xl',
  'text-3xl',
  'text-4xl',
  'text-left',
  'text-center',
  'text-right',
  'text-justify',
  'text-opacity-',
  'text-ellipsis',
  'text-clip',
  'text-wrap',
  'bg-opacity-',
  'bg-none',
  'bg-gradient-',
  'bg-fixed',
  'bg-local',
  'bg-scroll',
  'bg-clip-',
  'bg-origin-',
  'bg-contain',
  'bg-cover',
  'bg-auto',
  'border-',
  'border-solid',
  'border-dashed',
  'border-dotted',
  'border-double',
  'border-none',
  'border-0',
  'border-2',
  'border-4',
  'border-8',
  'border-t',
  'border-r',
  'border-b',
  'border-l',
  'border-x',
  'border-y',
  'border-t-',
  'border-r-',
  'border-b-',
  'border-l-',
  'border-opacity-',
];

function isColorClass(className) {
  // Check if it's a non-color utility
  if (NON_COLOR_UTILITIES.some(util => className.startsWith(util))) {
    return false;
  }

  // Check if it's an actual color class
  const colorPrefixes = ['text-', 'bg-', 'border-'];
  if (!colorPrefixes.some(prefix => className.startsWith(prefix))) {
    return false;
  }

  // Must have a color name after the prefix
  const parts = className.split('-');
  if (parts.length < 2) {
    return false;
  }

  // Check if second part is a color name (not a utility)
  const colorNames = [
    'slate',
    'gray',
    'zinc',
    'neutral',
    'stone',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
    'black',
    'white',
    'transparent',
    'current',
    'inherit',
  ];

  return colorNames.some(color => parts[1] === color || parts[1].startsWith(color));
}

module.exports = {
  rules: {
    'no-broken-internal-links': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Ensure all internal links point to existing pages',
          category: 'Product Quality',
          recommended: true,
        },
        messages: {
          brokenLink: 'Internal link "{{href}}" points to non-existent page. This will cause a 404 error.',
        },
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name.name === 'href' && node.value?.type === 'Literal') {
              const href = node.value.value;

              if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
                const cleanPath = href.split('#')[0].split('?')[0];

                // Try both app and src/app directories
                const baseDirs = [
                  path.join(context.getCwd(), 'app'),
                  path.join(context.getCwd(), 'src', 'app'),
                ];

                let fileExists = false;

                for (const baseDir of baseDirs) {
                  // Check direct path
                  const directFiles = [
                    path.join(baseDir, cleanPath, 'page.tsx'),
                    path.join(baseDir, cleanPath, 'page.jsx'),
                  ];

                  if (directFiles.some(file => fs.existsSync(file))) {
                    fileExists = true;
                    break;
                  }

                  // Check with dynamic route patterns like [locale]
                  try {
                    const searchDir = fs.existsSync(baseDir) ? fs.readdirSync(baseDir) : [];
                    for (const entry of searchDir) {
                      // Check for [locale] or other dynamic segments
                      if (entry.startsWith('[') && entry.endsWith(']')) {
                        const dynamicPath = path.join(baseDir, entry);
                        const nestedFiles = [
                          path.join(dynamicPath, cleanPath, 'page.tsx'),
                          path.join(dynamicPath, cleanPath, 'page.jsx'),
                          path.join(dynamicPath, '(unauth)', cleanPath, 'page.tsx'),
                          path.join(dynamicPath, '(unauth)', cleanPath, 'page.jsx'),
                          path.join(dynamicPath, '(auth)', cleanPath, 'page.tsx'),
                          path.join(dynamicPath, '(auth)', cleanPath, 'page.jsx'),
                        ];

                        if (nestedFiles.some(file => fs.existsSync(file))) {
                          fileExists = true;
                          break;
                        }
                      }

                      // Check for route groups like (marketing), (dashboard), etc.
                      if (entry.startsWith('(') && entry.endsWith(')')) {
                        const routeGroupPath = path.join(baseDir, entry);
                        const routeGroupFiles = [
                          path.join(routeGroupPath, cleanPath, 'page.tsx'),
                          path.join(routeGroupPath, cleanPath, 'page.jsx'),
                        ];

                        if (routeGroupFiles.some(file => fs.existsSync(file))) {
                          fileExists = true;
                          break;
                        }
                      }
                    }
                  } catch {
                    // Ignore errors reading directory
                  }

                  if (fileExists) {
                    break;
                  }
                }

                if (!fileExists && cleanPath !== '/' && cleanPath !== '') {
                  context.report({
                    node,
                    messageId: 'brokenLink',
                    data: { href },
                  });
                }
              }
            }
          },
        };
      },
    },

    'use-styleguide-colors-only': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Only use colors defined in the style guide',
          category: 'Brand Consistency',
          recommended: true,
        },
        messages: {
          unauthorizedColor: 'Color "{{color}}" is not in the approved style guide. Use one of: {{approved}}',
          arbitraryColor: 'Avoid arbitrary color values like "{{color}}". Use Tailwind utility classes from the style guide.',
        },
        schema: [
          {
            type: 'object',
            properties: {
              allowedColors: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        ],
      },
      create(context) {
        const options = context.options[0] || {};
        const allowedColors = options.allowedColors || ['black', 'white', 'gray-'];

        return {
          JSXAttribute(node) {
            if (node.name.name === 'className' && node.value?.value) {
              const classes = node.value.value.split(' ');

              classes.forEach((className) => {
                // Only check if it's actually a color class
                if (!isColorClass(className)) {
                  return;
                }

                const color = className.split('-').slice(1).join('-');
                const isAllowed = allowedColors.some(allowed => color.startsWith(allowed));

                if (!isAllowed && !color.includes('[') && !color.includes('inherit') && !color.includes('transparent')) {
                  context.report({
                    node,
                    messageId: 'unauthorizedColor',
                    data: {
                      color: className,
                      approved: allowedColors.join(', '),
                    },
                  });
                }

                // Check for arbitrary values like bg-[#FF0000]
                if (className.includes('[#') || className.includes('[rgb')) {
                  context.report({
                    node,
                    messageId: 'arbitraryColor',
                    data: { color: className },
                  });
                }
              });
            }
          },
        };
      },
    },

    'consistent-company-info': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Ensure company information (address, phone, email) is consistent',
          category: 'Content Consistency',
          recommended: true,
        },
        messages: {
          inconsistentEmail: 'Email "{{found}}" doesn\'t match configured email "{{configured}}"',
        },
        schema: [
          {
            type: 'object',
            properties: {
              companyName: { type: 'string' },
              email: { type: 'string' },
            },
          },
        ],
      },
      create(context) {
        const options = context.options[0] || {};

        return {
          Literal(node) {
            if (typeof node.value === 'string' && options.email) {
              const emailMatch = node.value.match(/\b[\w.%+-]+@[A-Z0-9.-]+\.[A-Z|]{2,}\b/i);
              if (emailMatch && emailMatch[0] !== options.email && !emailMatch[0].includes('example.com')) {
                context.report({
                  node,
                  messageId: 'inconsistentEmail',
                  data: {
                    found: emailMatch[0],
                    configured: options.email,
                  },
                });
              }
            }
          },
        };
      },
    },

    'consistent-payment-providers': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Ensure payment provider mentions are consistent',
          category: 'Content Consistency',
          recommended: true,
        },
        messages: {
          inconsistentProvider: 'Payment provider "{{provider}}" used here, but config specifies "{{configured}}". Keep consistent.',
        },
        schema: [
          {
            type: 'object',
            properties: {
              provider: {
                type: 'string',
                enum: ['stripe', 'ecommpay', 'paypal', 'square'],
              },
            },
          },
        ],
      },
      create(context) {
        const options = context.options[0] || {};
        const configuredProvider = options.provider || 'stripe';

        const providerPatterns = {
          stripe: /\bstripe\b/i,
          ecommpay: /\becommpay\b/i,
          paypal: /\bpaypal\b/i,
          square: /\bsquare\b/i,
        };

        return {
          Literal(node) {
            if (typeof node.value === 'string') {
              Object.entries(providerPatterns).forEach(([provider, pattern]) => {
                if (pattern.test(node.value) && provider !== configuredProvider) {
                  context.report({
                    node,
                    messageId: 'inconsistentProvider',
                    data: { provider, configured: configuredProvider },
                  });
                }
              });
            }
          },
        };
      },
    },

    // ========================================
    // UX CONSISTENCY RULES
    // ========================================

    'no-button-without-handler': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Buttons should have onClick handler or type attribute',
          category: 'UX Consistency',
          recommended: true,
        },
        messages: {
          missingHandler: 'Button has no onClick handler or type. Non-interactive buttons confuse users.',
        },
      },
      create(context) {
        return {
          JSXElement(node) {
            const elementName = node.openingElement.name.name;

            if (elementName === 'button' || elementName === 'Button') {
              const attributes = node.openingElement.attributes;
              const hasOnClick = attributes.some(attr => attr.name?.name === 'onClick');
              const hasType = attributes.some(attr => attr.name?.name === 'type');
              const hasAsChild = attributes.some(attr => attr.name?.name === 'asChild');

              if (!hasOnClick && !hasType && !hasAsChild) {
                context.report({
                  node,
                  messageId: 'missingHandler',
                });
              }
            }
          },
        };
      },
    },

    'no-form-without-submit': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Forms must have onSubmit handler',
          category: 'UX Consistency',
          recommended: true,
        },
        messages: {
          missingSubmit: 'Form has no onSubmit handler. Forms should handle submission explicitly.',
        },
      },
      create(context) {
        return {
          JSXElement(node) {
            if (node.openingElement.name.name === 'form') {
              const attributes = node.openingElement.attributes;
              const hasOnSubmit = attributes.some(attr => attr.name?.name === 'onSubmit');
              const hasAction = attributes.some(attr => attr.name?.name === 'action');

              if (!hasOnSubmit && !hasAction) {
                context.report({
                  node,
                  messageId: 'missingSubmit',
                });
              }
            }
          },
        };
      },
    },

    'no-missing-alt-text': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Images must have alt text for accessibility',
          category: 'Accessibility',
          recommended: true,
        },
        messages: {
          missingAlt: 'Image missing alt attribute. Add alt="" for decorative images or descriptive alt text.',
        },
      },
      create(context) {
        return {
          JSXElement(node) {
            const elementName = node.openingElement.name.name;

            if (elementName === 'img' || elementName === 'Image') {
              const attributes = node.openingElement.attributes;
              const altAttr = attributes.find(attr => attr.name?.name === 'alt');

              if (!altAttr) {
                context.report({
                  node,
                  messageId: 'missingAlt',
                });
              }
            }
          },
        };
      },
    },

    'no-generic-placeholders': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Avoid generic placeholder text like "Enter text", "Click here"',
          category: 'UX Consistency',
          recommended: true,
        },
        messages: {
          genericPlaceholder: 'Generic placeholder "{{text}}" should be more specific. Example: "Enter your email address"',
        },
      },
      create(context) {
        const genericPhrases = [
          'click here',
          'click me',
          'enter text',
          'type here',
          'input text',
          'enter value',
        ];

        return {
          JSXAttribute(node) {
            if (node.name?.name === 'placeholder' && node.value?.value) {
              const value = node.value.value.toLowerCase().trim();

              if (genericPhrases.includes(value)) {
                context.report({
                  node,
                  messageId: 'genericPlaceholder',
                  data: { text: node.value.value },
                });
              }
            }
          },
        };
      },
    },

    'require-loading-state-on-async-button': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Buttons with async onClick should show loading state',
          category: 'UX Consistency',
          recommended: true,
        },
        messages: {
          missingLoadingState: 'Async button onClick should have loading state. Users need feedback during async operations.',
        },
      },
      create(context) {
        return {
          JSXElement(node) {
            const elementName = node.openingElement.name.name;

            if (elementName === 'button' || elementName === 'Button') {
              const attributes = node.openingElement.attributes;
              const onClickAttr = attributes.find(attr => attr.name?.name === 'onClick');

              if (onClickAttr?.value?.expression) {
                const source = context.getSourceCode();
                const onClickCode = source.getText(onClickAttr.value.expression);

                const isAsync = onClickCode.includes('async') || onClickCode.includes('await')
                  || onClickCode.includes('fetch(') || onClickCode.includes('.then(');

                if (isAsync) {
                  const hasLoadingProp = attributes.some(attr =>
                    attr.name?.name === 'loading'
                    || attr.name?.name === 'isLoading'
                    || attr.name?.name === 'disabled',
                  );

                  if (!hasLoadingProp) {
                    context.report({
                      node: onClickAttr,
                      messageId: 'missingLoadingState',
                    });
                  }
                }
              }
            }
          },
        };
      },
    },

    'require-try-catch-fetch': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Fetch calls should be wrapped in try-catch',
          category: 'Error Handling',
          recommended: true,
        },
        messages: {
          missingTryCatch: 'Fetch call not wrapped in try-catch. API calls can fail and should handle errors gracefully.',
        },
      },
      create(context) {
        return {
          CallExpression(node) {
            if (node.callee.name === 'fetch'
              || (node.callee.type === 'MemberExpression' && node.callee.property.name === 'fetch')) {
              let parent = node.parent;
              let inTryCatch = false;

              while (parent) {
                if (parent.type === 'TryStatement') {
                  inTryCatch = true;
                  break;
                }
                parent = parent.parent;
              }

              if (!inTryCatch) {
                context.report({
                  node,
                  messageId: 'missingTryCatch',
                });
              }
            }
          },
        };
      },
    },

    'require-empty-state': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Lists/grids should handle empty state with helpful message',
          category: 'UX Consistency',
          recommended: true,
        },
        messages: {
          missingEmptyState: 'Array map without empty state check. Show helpful message when data is empty.',
        },
      },
      create(context) {
        return {
          CallExpression(node) {
            if (node.callee.type === 'MemberExpression'
              && node.callee.property.name === 'map') {
              let parent = node.parent;
              let hasLengthCheck = false;

              while (parent && parent.type !== 'Program') {
                if (parent.type === 'ConditionalExpression'
                  || parent.type === 'IfStatement'
                  || parent.type === 'LogicalExpression') {
                  const source = context.getSourceCode();
                  const parentText = source.getText(parent);

                  if (parentText.includes('.length')
                    || parentText.includes('?.length')
                    || parentText.includes('isEmpty')
                    || parentText.includes('hasData')) {
                    hasLengthCheck = true;
                    break;
                  }
                }
                parent = parent.parent;
              }

              if (!hasLengthCheck) {
                context.report({
                  node,
                  messageId: 'missingEmptyState',
                });
              }
            }
          },
        };
      },
    },

    'require-image-optimization': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Use Next.js Image component instead of img tag',
          category: 'Performance',
          recommended: true,
        },
        messages: {
          useNextImage: 'Use Next.js <Image> component instead of <img> for automatic optimization.',
        },
      },
      create(context) {
        return {
          JSXElement(node) {
            if (node.openingElement.name.name === 'img') {
              const filename = context.getFilename();
              if (filename.includes('/app/') || filename.includes('/pages/') || filename.includes('/src/')) {
                context.report({
                  node,
                  messageId: 'useNextImage',
                });
              }
            }
          },
        };
      },
    },

    'require-aria-label-on-icon-buttons': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Icon-only buttons need aria-label for screen readers',
          category: 'Accessibility',
          recommended: true,
        },
        messages: {
          missingAriaLabel: 'Icon button missing aria-label. Screen readers need descriptive text.',
        },
      },
      create(context) {
        return {
          JSXElement(node) {
            const elementName = node.openingElement.name.name;

            if (elementName === 'button' || elementName === 'Button') {
              const attributes = node.openingElement.attributes;
              const hasAriaLabel = attributes.some(attr =>
                attr.name?.name === 'aria-label'
                || attr.name?.name === 'aria-labelledby',
              );

              const hasTextChild = node.children.some(child =>
                child.type === 'JSXText' && child.value.trim().length > 0,
              );

              const source = context.getSourceCode();
              const buttonContent = source.getText(node);
              const hasIcon = /Icon|icon|svg|SVG|Ri[A-Z]|Lucide|Menu|X|Close|Search|Arrow/.test(buttonContent);

              if (hasIcon && !hasTextChild && !hasAriaLabel) {
                context.report({
                  node,
                  messageId: 'missingAriaLabel',
                });
              }
            }
          },
        };
      },
    },
  },
};
