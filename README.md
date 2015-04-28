# APM-mouse

Ever heard of APM (actions per minute) and EPM (effective actions per minute) in Warcraft and Starcraft? 

For the good old times' sake, here's some practice in seconds

Enjoy: http://yanshuoh.github.io/APM-mouse/

## Downloads
* Available in npm: npm install APM-mouse
* git clone: https://github.com/YanshuoH/APM-mouse.git

## Modules
This is a self-training project, built with ReactJS, Sass and Gulp.

## Building
Since there's no server-side, see package.json
```
npm install -g gulp
npm install
gulp build # build dist files once, or
gulp # watch for changes
```
Also, as one of the vendor uses compass, you may want to install Gem/Compass/Gulp-compass for building as well.
Help yourself with Ruby-GEM and Compass-compile, I've only uploaded a dist file in this repo, using it as a static css file.

## Browser
Tested with Chrome 37 and above, Firefox 37.
IE 8 failed. (Seems like ReactJS does not like IE8)

## Todos
* In comming responsive support for tablets.
* and so on

## IOS issues
Since execution of JS in IOS is weired...It doesn't work well in IOS devices.
Quote in [skroll](https://github.com/Prinzhorn/skrollr)

> Mobile browsers try to save battery wherever they can. That's why mobile browsers delay the execution of JavaScript while you are scrolling. iOS in particular does this very aggressively and completely stops JavaScript. In short, that's the reason why many scrolling libraries either don't work on mobile devices or they come with their own scrollbar which is a usability nightmare on desktop.


ISC Licence
