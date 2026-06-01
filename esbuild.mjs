import * as esbuild from "esbuild"
import copyStaticFiles from "esbuild-copy-static-files";

const isDebugBuild = process.env.DEBUG === "true";

await esbuild.build({
	entryPoints: ["build/compile/AwayMessageBookmarks.js"],
	bundle: true,
	outfile: "build/bundle/amb/index.js",
	platform: "browser",
	target: "chrome143",
	format: "esm",
	allowOverwrite: true,
	minifySyntax: !isDebugBuild,
	minifyWhitespace: !isDebugBuild,
	minifyIdentifiers: !isDebugBuild,
	charset: "utf8",
	assetNames: "[name]",
	sourcemap: isDebugBuild ? "inline" : false,
	plugins: [
		copyStaticFiles({
			src: "static",
			dest: "build/bundle",
		}),
	],
});
