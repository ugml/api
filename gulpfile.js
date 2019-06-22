const gulp = require("gulp");
const ts = require("gulp-typescript");
const nodemon = require("gulp-nodemon");
const JSON_FILES = ["src/*.json", "src/**/*.json"];
const TEST_FILES = ["src/**/*.spec.ts", "src/**/*.test.ts"];
const CONFIG_FILES = ["src/config/**/*"];
const SCHEMA_FILES = ["src/schemas/**/*"];
const SOURCE_FILES = ["src/**/*.ts", "!" + TEST_FILES];

// pull in the project TypeScript config
const tsProject = ts.createProject("tsconfig.json");

gulp.task("compile", () => {
  const tsResult = gulp.src(SOURCE_FILES).pipe(
    tsProject("./tsconfig.json", {
      logLevel: 1,
      compilerOptions: {
        listFiles: true,
      },
    }),
  );
  return tsResult.js.pipe(gulp.dest("dist"));
});

gulp.task("watch", done => {
  return nodemon({
    script: "dist",
    watch: SOURCE_FILES,
    ext: "ts",
    tasks: changedFiles => {
      console.log("files changed", changedFiles);
      return ["compile"];
    },
    done,
  }).on("restart", () => console.log("Restart!"));
});

gulp.task("copy:config", () => gulp.src(CONFIG_FILES).pipe(gulp.dest("dist/config")));
gulp.task("copy:schema", () => gulp.src(SCHEMA_FILES).pipe(gulp.dest("dist/schemas")));
gulp.task("copy:json", () => gulp.src(JSON_FILES).pipe(gulp.dest("dist")));

gulp.task("assets", gulp.series(["copy:config", "copy:schema", "copy:json"]));

gulp.task("build", gulp.series("assets", "compile"));
gulp.task("default", gulp.series("build", "watch"));
