const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const filters = require('./utils/filters.js');
const passthroughs = require('./utils/passthroughs.js');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginArrayFilters = require("@jamshop/eleventy-plugin-array-filters");
const UglifyJS = require("uglify-js");
const htmlmin = require("html-minifier");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const localizedCollections = ['post'];

module.exports = function(eleventyConfig) {
		eleventyConfig.addPlugin(syntaxHighlight);
		eleventyConfig.addPlugin(pluginArrayFilters);
		// Copy our static assets to the output folder
		passthroughs.forEach(passthroughPath => {
				eleventyConfig.addPassthroughCopy(passthroughPath);
		});

		// Filters
		Object.keys(filters).forEach((filterName) => {
				eleventyConfig.addFilter(filterName, filters[filterName]);
		})

	// Eleventy Navigation https://www.11ty.dev/docs/plugins/navigation/
	eleventyConfig.addPlugin(eleventyNavigationPlugin);

	// Configuration API: use eleventyConfig.addLayoutAlias(from, to) to add
	// layout aliases! Say you have a bunch of existing content using
	// layout: post. If you don’t want to rewrite all of those values, just map
	// post to a new file like this:
	// eleventyConfig.addLayoutAlias("post", "layouts/my_new_post_layout.njk");

	// Merge data instead of overriding
	// https://www.11ty.dev/docs/data-deep-merge/
	eleventyConfig.setDataDeepMerge(true);

	// Add support for maintenance-free post authors
	// Adds an authors collection using the author key in our post frontmatter
	// Thanks to @pdehaan: https://github.com/pdehaan
	eleventyConfig.addCollection("authors", collection => {
		const blogs = collection.getFilteredByGlob("posts/*.md");
		return blogs.reduce((coll, post) => {
			const author = post.data.author;
			if (!author) {
				return coll;
			}
			if (!coll.hasOwnProperty(author)) {
				coll[author] = [];
			}
			coll[author].push(post.data);
			return coll;
		}, {});
	});

	// Date formatting (human readable)
	eleventyConfig.addFilter("readableDate", dateObj => {
		return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
	});

	// Date formatting (machine readable)
	eleventyConfig.addFilter("machineDate", dateObj => {
		return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
	});

	// Minify CSS
	eleventyConfig.addFilter("cssmin", function(code) {
		return new CleanCSS({}).minify(code).styles;
	});

	// Minify JS
	eleventyConfig.addFilter("jsmin", function(code) {
		let minified = UglifyJS.minify(code);
		if (minified.error) {
			console.log("UglifyJS error: ", minified.error);
			return code;
		}
		return minified.code;
	});

	// Minify HTML output
	eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
		if (outputPath.indexOf(".html") > -1) {
			let minified = htmlmin.minify(content, {
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true
			});
			return minified;
		}
		return content;
	});

	// Don't process folders with static assets e.g. images
	eleventyConfig.addPassthroughCopy("./src/assets");

	/* Markdown Plugins */
	let markdownIt = require("markdown-it");
	let markdownItAnchor = require("markdown-it-anchor");
	let options = {
		html: true,
		breaks: true,
		linkify: true
	};
	let opts = {
		permalink: false
	};

	eleventyConfig.setLibrary("md", markdownIt(options)
		.use(markdownItAnchor, opts)
	);

	return {
		templateFormats: ["md", "njk", "html", "liquid"],

		// If your site lives in a different subdirectory, change this.
		// Leading or trailing slashes are all normalized away, so don’t worry about it.
		// If you don’t have a subdirectory, use "" or "/" (they do the same thing)
		// This is only used for URLs (it does not affect your file structure)
		pathPrefix: process.env.WEB_PATH_PREFIX || '',
		markdownTemplateEngine: "liquid",
		htmlTemplateEngine: "njk",
		dataTemplateEngine: "njk",
		dir: {
			input: 'src',
			output: '_site'
		}
	};
};
