'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var koa = require('koa');
var send = require('koa-send'),
    serve = require('koa-static'),
    body = require('koa-body-parser')(),
    app = koa(),
    router = require('koa-router')();

app.use(serve(__dirname + "/src"));

router.get('/', _regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return send(this, "./src/html/index.html");

                case 2:
                case 'end':
                    return _context.stop();
            }
        }
    }, _callee, this);
}));

router.post('/search', body, _regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    console.log(this.request.body);
                    this.status = 200;
                    this.body = 'some jade output for post requests';

                case 3:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _callee2, this);
}));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8080);