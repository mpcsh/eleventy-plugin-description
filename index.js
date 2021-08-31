const { htmlToText } = require("html-to-text");

function description(
  templateContent,
  overrides = {
    htmlToTextOverrides: {},
    phraseRegex: /(\p{Terminal_Punctuation}\p{White_Space})/gu,
    lengthCutoff: 200,
    terminator: "...",
  }
) {
  let content = htmlToText(templateContent, {
    wordwrap: false,
    ignoreHref: true,
    ignoreImage: true,
    uppercaseHeadings: false,
    ...overrides.htmlToTextOverrides,
  });

  let phrases = content.split(overrides.phraseRegex);

  let description = "";
  while (phrases.length > 0 && description.length < overrides.lengthCutoff) {
    description += phrases.shift();
  }
  description += overrides.terminator;

  return description;
}

module.exports = {
  description,
  configFunction(
    eleventyConfig,
    overrides = {
      htmlToTextOverrides: {},
      phraseRegex: /(\p{Terminal_Punctuation}\p{White_Space})/gu,
      lengthCutoff: 200,
      terminator: "...",
    }
  ) {
    eleventyConfig.addFilter("description", (text) =>
      description(text, overrides)
    );
  },
};
