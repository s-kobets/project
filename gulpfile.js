// �������������� �������
var lr = require('tiny-lr'), // ������������� ��� livereload
    gulp = require('gulp'), // ����������� Gulp JS
    jade = require('gulp-jade'), // ������ ��� Jade
    stylus = require('gulp-stylus'), // ������ ��� Stylus
	nib = require('nib'), //��������� �������� �����-���������� ��������� CSS3
    livereload = require('gulp-livereload'), // Livereload ��� Gulp
    myth = require('gulp-myth'), // ������ ��� Myth - http://www.myth.io/
    csso = require('gulp-csso'), // ����������� CSS
    imagemin = require('gulp-imagemin'), // ����������� �����������
    uglify = require('gulp-uglify'), // ����������� JS
    concat = require('gulp-concat'), // ������� ������
    connect = require('gulp-connect'), // Webserver
	notify = require('gulp-notify'),
    server = lr();

// �������� Stylus
gulp.task('stylus', function() {
    gulp.src('./assets/stylus/common.styl')
        .pipe(stylus({use:[nib()]})) // �������� stylus
    .on('error', console.log) // ���� ���� ������, ������� � ����������
    .pipe(myth()) // ��������� �������� - http://www.myth.io/
    .pipe(gulp.dest('./public/css/')) // ���������� css
    .pipe(connect.reload()); // ���� ������� �� ������������ css
});

// �������� html �� Jade
gulp.task('jade', function() {
    gulp.src(['./assets/template/pages/index.jade'])
        .pipe(jade({
            pretty: true
        }))  // �������� Jade ������ � ����� ./assets/template/ �������� ����� � _*
        .on('error', console.log) // ���� ���� ������, ������� � ����������
    .pipe(gulp.dest('./public/')) // ���������� ��������� �����
	.pipe(notify("Done!"))
    .pipe(connect.reload()); // ���� ������� �� ������������ ��������
});

// �������� JS
gulp.task('js', function() {
    gulp.src(['./assets/js/jquery.js',
				'./assets/js/**/*.js'])
        .pipe(concat('common.js')) // �������� ��� JS, ����� ��� ������� ��������� � ./assets/js/vendor/**
        .pipe(gulp.dest('./public/js'))
		.pipe(notify("Done!")) // ������� ��������� ��� ��������� �����
        .pipe(connect.reload()); // ���� ������� �� ������������ ��������
});

// �������� � ������������ �����������
gulp.task('images', function() {
    gulp.src('./assets/img/**/*')
        .pipe(imagemin())
		.pipe(notify("Done!"))
        .pipe(gulp.dest('./public/img'))

});

// ��������� ������ ��� ����������
gulp.task('connect', function() {
  connect.server({
	port: 9000,
    root: ['public', 'assets'],
    livereload: true
  });  
});

// ������ ������� ���������� gulp watch
gulp.task('watch', function() {
    // ��������������� ������ �������
    gulp.run('stylus');
    gulp.run('jade');
    gulp.run('images');
    gulp.run('js');

    // ���������� Livereload
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
//�� ����� ��� �� �����.............
gulp.task('build', function() {
    // css
    gulp.src('./assets/stylus/common.styl')
        .pipe(stylus({
            use: ['nib']
        })) // �������� stylus
    .pipe(myth()) // ��������� �������� - http://www.myth.io/
    .pipe(csso()) // ������������ css
    .pipe(gulp.dest('./build/css/')) // ���������� css

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