const htmlToText = require('html-to-text');

module.exports = {
  configFunction(
    eleventyConfig,
    overrides = {
      htmlToTextOverrides: {},
      sentenceRegex: /(\p{Terminal_Punctuation}\p{White_Space})/gu,
      lengthCutoff: 200,
      terminator: '...',
    },
  ) {
    eleventyConfig.addFilter('description', templateContent => {
      let content = htmlToText.fromString(templateContent, {
        wordwrap: false,
        ignoreHref: true,
        ignoreImage: true,
        uppercaseHeadings: false,
        ...overrides.htmlToTextOverrides,
      });

      let sentences = content.split(overrides.sentenceRegex);

      let description = sentences.shift();
      while (description.length < overrides.lengthCutoff) {
        description += sentences.shift() + sentences.shift();
      }

      description += overrides.terminator;
      return description;
    });
  },
};
