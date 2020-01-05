const htmlToText = require('html-to-text');

module.exports = {
  configFunction(
    eleventyConfig,
    overrides = {
      htmlToTextOverrides: {},
      phraseRegex: /(\p{Terminal_Punctuation}\p{White_Space})/gu,
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

      let phrases = content.split(overrides.phraseRegex);

      let description = phrases.shift();
      while (description.length < overrides.lengthCutoff) {
        description += phrases.shift() + phrases.shift();
      }

      description += overrides.terminator;
      return description;
    });
  },
};
