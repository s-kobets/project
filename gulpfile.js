// Инициализируем плагины
var lr = require('tiny-lr'), // Минивебсервер для livereload
    gulp = require('gulp'), // Сообственно Gulp JS
    jade = require('gulp-jade'), // Плагин для Jade
    stylus = require('gulp-stylus'), // Плагин для Stylus
	nib = require('nib'), //фреймворк упрощает кросс-браузерную поддержку CSS3
    livereload = require('gulp-livereload'), // Livereload для Gulp
    myth = require('gulp-myth'), // Плагин для Myth - http://www.myth.io/
    csso = require('gulp-csso'), // Минификация CSS
    imagemin = require('gulp-imagemin'), // Минификация изображений
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    connect = require('gulp-connect'), // Webserver
	notify = require('gulp-notify'),
    server = lr();

// Собираем Stylus
gulp.task('stylus', function() {
    gulp.src('./assets/stylus/common.styl')
        .pipe(stylus({use:[nib()]})) // собираем stylus
    .on('error', console.log) // Если есть ошибки, выводим и продолжаем
    .pipe(myth()) // добавляем префиксы - http://www.myth.io/
    .pipe(gulp.dest('./public/css/')) // записываем css
    .pipe(connect.reload()); // даем команду на перезагрузку css
});

// Собираем html из Jade
gulp.task('jade', function() {
    gulp.src(['./assets/template/pages/index.jade'])
        .pipe(jade({
            pretty: true
        }))  // Собираем Jade только в папке ./assets/template/ исключая файлы с _*
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
    .pipe(gulp.dest('./public/')) // Записываем собранные файлы
	.pipe(notify("Done!"))
    .pipe(connect.reload()); // даем команду на перезагрузку страницы
});

// Собираем JS
gulp.task('js', function() {
    gulp.src(['./assets/js/jquery.js',
				'./assets/js/**/*.js'])
        .pipe(concat('common.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
        .pipe(gulp.dest('./public/js'))
		.pipe(notify("Done!")) // выводит сообщение при изменении файла
        .pipe(connect.reload()); // даем команду на перезагрузку страницы
});

// Копируем и минимизируем изображения
gulp.task('images', function() {
    gulp.src('./assets/img/**/*')
        .pipe(imagemin())
		.pipe(notify("Done!"))
        .pipe(gulp.dest('./public/img'))

});

// Локальный сервер для разработки
gulp.task('connect', function() {
  connect.server({
	port: 9000,
    root: ['public', 'assets'],
    livereload: true
  });  
});

// Запуск сервера разработки gulp watch
gulp.task('watch', function() {
    // Предварительная сборка проекта
    gulp.run('stylus');
    gulp.run('jade');
    gulp.run('images');
    gulp.run('js');

    // Подключаем Livereload
    server.listen(35729, function(err) {
        if (err) return console.log(err);

        gulp.watch('assets/stylus/**/*.styl', function() {
            gulp.run('stylus');			
        });
        gulp.watch('assets/template/**/*.jade', function() {
            gulp.run('jade');
        });
        gulp.watch('assets/img/**/*', function() {
            gulp.run('images');
        });
        gulp.watch('assets/js/**/*', function() {
            gulp.run('js');
        });
    });
    gulp.run('connect');
});
//до этого еще не дошел.............
gulp.task('build', function() {
    // css
    gulp.src('./assets/stylus/common.styl')
        .pipe(stylus({
            use: ['nib']
        })) // собираем stylus
    .pipe(myth()) // добавляем префиксы - http://www.myth.io/
    .pipe(csso()) // минимизируем css
    .pipe(gulp.dest('./build/css/')) // записываем css

    // jade
    gulp.src(['./assets/template/*.jade', '!./assets/template/_*.jade'])
        .pipe(jade())
        .pipe(gulp.dest('./build/'))

    // js
    gulp.src(['./assets/js/**/*.js', '!./assets/js/vendor/**/*.js'])
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));

    // image
    gulp.src('./assets/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))

});