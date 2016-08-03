const superagent = require('superagent');
const default_para = { tieba_name: '李毅', author: '', rep_num: '1', deepth: '1' };
const $ = require("cheerio");

var Post = require("./post.js").Post;

var preUrl = "http://tieba.baidu.com/";

function Spider(para) {
        this.para = para || default_para;
        this.urls = [];
        this.posts = [];
}

Spider.prototype = {
    constructor: Spider,
    parseUrl: function (url) {
         return new Promise( (resolve, reject) => {
            superagent.get(url)
            .end( (err, res) => {
                if (err || !res.ok) {
                    console.log(err);
                    reject(err);
                } else {
                    //后续处理这个url下获取到的info信息
                    let html = res.text,
                        posts = this.getPosts(html);
                    resolve(posts);
                }
            });
        });
    },
    getPosts: function (html) {
        let parse = $.load(html),
            list = parse("#thread_list li.j_thread_list"),
            posts = [];

        list.each((i, ele) => {
            if($(ele).attr("data-field") == undefined) return;
            let data_field = JSON.parse($(ele).attr("data-field")),
                author = data_field.author_name,
                rep_num = data_field.reply_num,
                title = $(ele).find("div").first().find("div").last().find("a").text(),
                last_time = $(ele).find("span.j_reply_data").text(),
                url_link = preUrl + $(ele).find("div").first().find("div").last().find("a").attr("href"),
                body = $(ele).find("div.threadlist_abs_onlyline").text(),
                post = new Post(title, author, url_link, rep_num, last_time, body);
                // console.log(post);
                posts.push(post);
        })

        return posts;
    },

    run: function () {
        let para = this.para,
            promises = [],
            that = this;

        for(let i=0; i<para.deepth; i++){
            let url = "http://tieba.baidu.com/f?kw=" + para.tieba_name + "&pn=" + i*50;
            this.urls.push(url);
        }
        // console.log(this.para);

        this.urls.forEach( function(url, index) {
            promises.push(that.parseUrl(url));
        });
        return Promise.all(promises);
    }
};


// //测试
// let spider = new Spider(default_para);
// console.log(spider.run());


exports.Spider = Spider;