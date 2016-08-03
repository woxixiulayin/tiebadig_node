"use strict";

function Post(title, author, url_link, rep_num, last_time, body) {
        this.title = title || "";
        this.author = author || "";
        this.url_link = url_link || "";
        this.rep_num = rep_num || 0;
        this.last_time = last_time || "";
        this.body = body || "";
}

exports.Post = Post;