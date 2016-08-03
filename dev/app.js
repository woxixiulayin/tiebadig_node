const  koa = require('koa');
var  send = require('koa-send'),
    serve = require('koa-static'),
    body = require('koa-body-parser')(),
    app = koa(),
    router = require('koa-router')();

app.use(serve((__dirname + "/src")));

router.get('/', function *() {
        yield send(this, "./src/html/index.html");
});


router.post('/search', body, function *() {
    console.log(this.request.body);
    this.status = 200;
    this.body = 'some jade output for post requests';
});


app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8080);