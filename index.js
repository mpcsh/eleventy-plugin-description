const htmlToText = require('html-to-text');

module.exports = {
  configFunction(
    eleventyConfig,
    options = {
      htmlToTextOverrides: {},
      sentenceRegex: /(\p{Terminal_Punctuation}\p{White_Space})/gu,
      maxLength: 200,
      terminator: '...',
    },
  ) {
    eleventyConfig.addFilter('description', templateContent => {
      let content = htmlToText.fromString(templateContent, {
        wordwrap: false,
        ignoreHref: true,
        ignoreImage: true,
        uppercaseHeadings: false,
        ...options.htmlToTextOverrides,
      });

      let sentences = content.split(options.sentenceRegex);

      let description = sentences.shift();
      while (description.length < options.maxLength) {
        description += sentences.shift() + sentences.shift();
      }

      description += options.terminator;
      return description;
    });
  },
};
