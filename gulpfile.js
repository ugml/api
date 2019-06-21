const gulp = require("gulp");
const ts = require("gulp-typescript");
const nodemon = require("gulp-nodemon");
const Cache = require("gulp-file-cache");
const JSON_FILES = ["src/*.json", "src/**/*.json"];
const TEST_FILES = ["src/**/*.spec.ts", "src/**/*.test.ts"];
const CONFIG_FILES = ["src/config/**/*"];
const SCHEMA_FILES = ["src/schemas/**/*"];
const SOURCE_FILES = ["src/**/*.ts", "!" + TEST_FILES];

const cache = new Cache();

// pull in the project TypeScript config
const tsProject = ts.createProject("tsconfig.json");

gulp.task("compile", () => {
  const tsResult = gulp.src(SOURCE_FILES).pipe(tsProject());
  return tsResult.js.pipe(gulp.dest("dist"));
});

gulp.task("watch", done => {
  return nodemon({
    script: "dist",
    watch: SOURCE_FILES,
    ext: "compile",
    tasks: ["compile"],
    done,
  }).on("restart", () => console.log("Restart!"));
});

gulp.task("copy:config", () => gulp.src(CONFIG_FILES).pipe(gulp.dest("dist/config")));
gulp.task("copy:schema", () => gulp.src(SCHEMA_FILES).pipe(gulp.dest("dist/schemas")));
gulp.task("copy:json", () => gulp.src(JSON_FILES).pipe(gulp.dest("dist")));

gulp.task("assets", gulp.series(["copy:config", "copy:schema", "copy:json"]));

gulp.task("default", gulp.series("assets", "compile", "watch"));
