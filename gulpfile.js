const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
    const tsResult = tsProject.src()
        .pipe(tsProject());
    gulp.src(['src/config/**/*']).pipe(gulp.dest('dist/config'));
    gulp.src(['src/schemas/**/*']).pipe(gulp.dest('dist/schemas'));
    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', gulp.series('scripts', () => {
    gulp.watch('src/**/*.ts', ['scripts']);
}));

gulp.task('assets', function() {
    return gulp.src(JSON_FILES)
        .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('watch', 'assets'));