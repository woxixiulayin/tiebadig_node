'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var superagent = require('superagent');
var default_para = { tieba_name: '李毅', author: '', rep_num: '1', deepth: '1' };
var $ = require("cheerio");

var Post = require("./post.js").Post;

var preUrl = "http://tieba.baidu.com/";

function Spider(para) {
    this.para = para || default_para;
    this.urls = [];
    this.posts = [];
}

Spider.prototype = {
    constructor: Spider,

    //每个url的处理入口
    parseUrl: function parseUrl(url) {
        var _this = this;

        return new _promise2.default(function (resolve, reject) {
            superagent.get(url).end(function (err, res) {
                if (err || !res.ok) {
                    console.log(err);
                    reject(err);
                } else {
                    //后续处理这个url下获取到的info信息
                    var html = res.text,
                        posts = _this.getPosts(html);
                    resolve(posts);
                }
            });
        });
    },

    //制定获取数据的策略
    getPosts: function getPosts(html) {
        var _this2 = this;

        var parse = $.load(html),
            list = parse("#thread_list li.j_thread_list"),
            posts = [];

        list.each(function (i, ele) {
            if ($(ele).attr("data-field") == undefined) return;
            //获取每个post的li数据
            var data_field = JSON.parse($(ele).attr("data-field")),
                rep_num = data_field.reply_num,
                author = data_field.author_name;

            //排除不符合条件的数据
            if (rep_num < _this2.para.rep_num || _this2.para.author != '' && author != _this2.para.author) return;

            //提取具体参数
            var title = $(ele).find("div.threadlist_title a").text(),
                last_time = $(ele).find("span.j_reply_data").text(),
                url_link = preUrl + "/p/" + data_field.id,
                body = $(ele).find("div.threadlist_abs_onlyline").text(),
                post = new Post(title, author, url_link, rep_num, last_time, body);
            // console.log(post);
            posts.push(post);
        });

        return posts;
    },

    //入口函数
    run: function run() {
        var para = this.para,
            promises = [],
            that = this;

        for (var i = 0; i < para.deepth; i++) {
            var url = "http://tieba.baidu.com/f?kw=" + para.tieba_name + "&pn=" + i * 50;
            this.urls.push(url);
        }
        // console.log(this.para);

        this.urls.forEach(function (url, index) {
            promises.push(that.parseUrl(url));
        });
        return _promise2.default.all(promises);
    }
};

// //测试
// let spider = new Spider(default_para);
// console.log(spider.run());


exports.Spider = Spider;