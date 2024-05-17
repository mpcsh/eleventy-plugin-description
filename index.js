const { convert } = require("html-to-text");
const mergeWith = require("lodash.mergewith");

const DEFAULTS = {
  phraseRegex: /(\p{Terminal_Punctuation}\p{White_Space})/gu,
  lengthCutoff: 200,
  terminator: "...",
  htmlToTextOptions: {
    wordwrap: false,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
      ...["h1", "h2", "h3", "h4", "h5", "h6"].map((selector) => ({
        selector,
        options: { uppercase: false },
      })),
    ],
  },
};

function concatArrays(dst, src) {
  if (Array.isArray(dst)) {
    return dst.concat(src);
  }
}

function description(templateContent, overrides) {
  const phraseRegex = overrides.phraseRegex ?? DEFAULTS.phraseRegex;
  const lengthCutoff = overrides.lengthCutoff ?? DEFAULTS.lengthCutoff;
  const terminator = overrides.terminator ?? DEFAULTS.terminator;
  const htmlToTextOptions = mergeWith(
    {},
    DEFAULTS.htmlToTextOptions,
    overrides.htmlToTextOptions,
    concatArrays,
  );

  let content = convert(templateContent, htmlToTextOptions);
  let phrases = content.split(phraseRegex);

  let description = "";
  while (phrases.length > 0 && description.length < lengthCutoff) {
    description += phrases.shift();
  }
  description += terminator;

  return description;
}

module.exports = {
  description,
  configFunction(eleventyConfig, overrides) {
    eleventyConfig.addFilter("description", (text) =>
      description(text, overrides),
    );
  },
};
