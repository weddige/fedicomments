# FediComments

FediComments is a module for easy integration of Mastodon comments into a website. It is based on previous work by [Carl Schwan](https://carlschwan.eu/2020/12/29/adding-comments-to-your-static-blog-with-mastodon/) and [Daniel Pecos Martínez](https://danielpecos.com/2022/12/25/mastodon-as-comment-system-for-your-static-blog/).

## Installation

The module can be installed via `npm`:

```bash
npm install git+https://github.com/weddige/fedicomments.git
```

## Usage

To get started with FediComments, simply add the following code to your site and replace  `<your mastodon host>`, `<your mastodon user>` and `<the id of the toot>` with the appropriate values.

```html
<div id="mastodon-comments-list">
    <button id="mastodon-comments-load">Load comments</button>
</div>
<script type="module" type="text/javascript">
    import FediComments from 'node_modules/fedicomments/dist/FediComments.js'

    var fedicomments = new FediComments(
        '<your mastodon host>',
        '<your mastodon user>',
        '<the id of the toot>',
        document.getElementById('mastodon-comments-list'),
        toot => `
<div style="margin-left: calc(2em * ${toot.auxilliary.depth})">
    <div>
        <img src="${toot.account.avatar_static}" height=60 width=60 alt="">
        <a href="${toot.account.url}" rel="nofollow">
            ${toot.account.display_name}</a>
        (<a href="${toot.account.url}" rel="nofollow">
            ${toot.auxilliary.account}</a>)<br>
        <a class="date" href="${toot.url}" rel="nofollow">
            ${toot.created_at.substr(0, 10)}
            ${toot.created_at.substr(11, 8)}</a>
    </div>
    <div>${toot.content}</div>
</div>`
    );
    document.getElementById("mastodon-comments-load").onclick = function () { fedicomments.loadComments() };
</script>
```

This will not look pretty, but it will display a button that will load the comments. To adapt the layout of the comments to your website, you need to change the templating string.

The variable `toot` is a Mastodon status. In addition to all the [default values](https://docs.joinmastodon.org/methods/statuses/#200-ok-1) FediComments adds some auxilliary values, that you can use as well:

 * `toot.auxilliary.depth` is the depth of nested comments
 * `toot.auxilliary.account` is the full account name (e.g. `@user@server.tld`)